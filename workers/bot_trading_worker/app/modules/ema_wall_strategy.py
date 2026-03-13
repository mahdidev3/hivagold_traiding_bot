from __future__ import annotations

import math
from typing import Any

from config import Config
from .base import MarketSnapshot


class EmaWallStrategyModule:
    name = "ema_wall_v1"

    def __init__(self, config: Config):
        self.config = config

    def evaluate(self, snapshot: MarketSnapshot, base_payload: dict[str, Any]) -> dict[str, Any]:
        bars = snapshot.bars
        closes = [bar["close"] for bar in bars]
        highs = [bar["high"] for bar in bars]
        lows = [bar["low"] for bar in bars]

        now_price = snapshot.latest_price
        ema9 = self._ema(closes, 9)
        ema21 = self._ema(closes, 21)
        ema50 = self._ema(closes, 50)
        atr14 = self._atr(highs, lows, closes, 14)

        wall = self._wall_features(snapshot.latest_wall)
        spread = wall.get("spread")
        if spread is None or spread <= 0:
            spread = max(atr14 * 0.15 if atr14 > 0 else 0.5, 0.1)

        score, reasons = self._score(now_price, ema9, ema21, ema50, closes, wall)
        confidence = min(abs(score) / 4.0, 1.0)

        bias = "neutral"
        if score >= 1.8:
            bias = "bullish"
        elif score <= -1.8:
            bias = "bearish"

        recommendation = None
        status = "hold"
        if bias in {"bullish", "bearish"}:
            action = "buy" if bias == "bullish" else "sell"
            ordertype = "limit" if confidence >= 0.6 else "market"

            entry_price = now_price
            if ordertype == "limit":
                direction = -1 if action == "buy" else 1
                entry_price = now_price + direction * spread * self.config.LIMIT_ORDER_SPREAD_FACTOR

            stop_loss, take_profit = self._risk_levels(
                action=action,
                entry_price=entry_price,
                atr14=atr14,
                spread=spread,
                confidence=confidence,
            )

            recommendation = {
                "action": action,
                "ordertype": ordertype,
                "price": round(entry_price, 2),
                "units": self.config.DEFAULT_UNITS,
                "stop_loss": stop_loss,
                "take_profit": take_profit,
            }
            status = "signal"

        result = dict(base_payload)
        result.update(
            {
                "status": status,
                "bias": bias,
                "score": round(score, 3),
                "confidence": round(confidence, 3),
                "reasons": reasons,
                "recommendation": recommendation,
                "metrics": {
                    "now_price": round(now_price, 5),
                    "ema9": round(ema9, 5),
                    "ema21": round(ema21, 5),
                    "ema50": round(ema50, 5),
                    "atr14": round(atr14, 5),
                    "spread": round(float(spread), 5),
                    "imbalance": wall.get("imbalance"),
                },
                "error": snapshot.last_error,
                "strategy": self.name,
            }
        )
        return result

    def _ema(self, values: list[float], period: int) -> float:
        alpha = 2.0 / (period + 1.0)
        ema_value = values[0]
        for value in values[1:]:
            ema_value = (value * alpha) + (ema_value * (1.0 - alpha))
        return float(ema_value)

    def _atr(self, highs: list[float], lows: list[float], closes: list[float], period: int) -> float:
        trs: list[float] = []
        for idx in range(1, len(closes)):
            high = highs[idx]
            low = lows[idx]
            prev_close = closes[idx - 1]
            trs.append(max(high - low, abs(high - prev_close), abs(low - prev_close)))
        use = trs[-period:] if len(trs) >= period else trs
        return float(sum(use) / len(use)) if use else 0.0

    def _risk_levels(self, action: str, entry_price: float, atr14: float, spread: float, confidence: float) -> tuple[float, float]:
        base_distance = max(atr14 * (1.2 + (1.0 - confidence) * 0.8), spread * 2.5, 0.05)
        reward_distance = base_distance * (1.6 + confidence * 1.2)
        if action == "buy":
            return round(entry_price - base_distance, 2), round(entry_price + reward_distance, 2)
        return round(entry_price + base_distance, 2), round(entry_price - reward_distance, 2)

    def _wall_features(self, wall: dict[str, Any] | None) -> dict[str, float | None]:
        if not wall:
            return {"imbalance": None, "spread": None, "microprice": None}
        buys = wall.get("buy") or wall.get("bids") or []
        sells = wall.get("sell") or wall.get("asks") or []
        if not buys or not sells:
            return {"imbalance": None, "spread": None, "microprice": None}
        try:
            best_bid = max(float(item["price"]) for item in buys)
            best_ask = min(float(item["price"]) for item in sells)
            bid_volume_sum = float(sum(float(item["volume"]) for item in buys))
            ask_volume_sum = float(sum(float(item["volume"]) for item in sells))
            denom = bid_volume_sum + ask_volume_sum
            imbalance = (bid_volume_sum - ask_volume_sum) / denom if denom else 0.0

            best_bid_item = max(buys, key=lambda item: float(item["price"]))
            best_ask_item = min(sells, key=lambda item: float(item["price"]))
            bid_px, bid_sz = float(best_bid_item["price"]), float(best_bid_item["volume"])
            ask_px, ask_sz = float(best_ask_item["price"]), float(best_ask_item["volume"])
            microprice = ((ask_px * bid_sz) + (bid_px * ask_sz)) / (bid_sz + ask_sz)
            return {"imbalance": imbalance, "spread": best_ask - best_bid, "microprice": microprice}
        except Exception:
            return {"imbalance": None, "spread": None, "microprice": None}

    def _score(self, now_price: float, ema9: float, ema21: float, ema50: float, closes: list[float], wall: dict[str, float | None]) -> tuple[float, list[str]]:
        score = 0.0
        reasons: list[str] = []
        if now_price > ema9 > ema21:
            score += 1.4
            reasons.append("price > ema9 > ema21")
        elif now_price < ema9 < ema21:
            score -= 1.4
            reasons.append("price < ema9 < ema21")
        if ema21 > ema50:
            score += 0.8
            reasons.append("ema21 > ema50")
        elif ema21 < ema50:
            score -= 0.8
            reasons.append("ema21 < ema50")

        momentum = closes[-1] - closes[-5] if len(closes) >= 5 else closes[-1] - closes[0]
        threshold = max(abs(closes[-1]) * 0.0005, 0.02)
        if momentum > threshold:
            score += 0.7
            reasons.append("momentum positive")
        elif momentum < -threshold:
            score -= 0.7
            reasons.append("momentum negative")

        imbalance = wall.get("imbalance")
        if imbalance is not None:
            if imbalance > 0.15:
                score += 0.9
                reasons.append("bid imbalance")
            elif imbalance < -0.15:
                score -= 0.9
                reasons.append("ask imbalance")

        microprice = wall.get("microprice")
        if microprice is not None:
            if microprice > now_price:
                score += 0.4
                reasons.append("microprice above last")
            elif microprice < now_price:
                score -= 0.4
                reasons.append("microprice below last")

        return (score, reasons) if math.isfinite(score) else (0.0, reasons)
