#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
collector_rest_and_signal.py

- Polls /ounce/api/ounce-bars in a loop
- Uses the SAME cookies + headers + warmup session context
- Builds/updates local OHLC history
- Optionally reads latest websocket snapshots from ./data_ws
- Produces educational market scenarios, not financial advice
"""

import json
import math
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
import requests

BASE_DOMAIN = "demo.hivagold.com"
BASE_SITE = f"https://{BASE_DOMAIN}"
BASE_REFERER = f"{BASE_SITE}/ounce/"
BARS_URL = f"{BASE_SITE}/ounce/api/ounce-bars/"

HISTORY_PATH = Path("bars_history.csv")
WS_DIR = Path("data_ws")
SIGNAL_PATH = Path("signal_latest.json")


@dataclass
class Config:
    symbol: str = "ounce"
    resolution: str = "1"
    lookback_seconds: int = 6 * 3600
    poll_every_seconds: int = 5
    cookies_path: str = "cookies.json"


CFG = Config()


def load_cookies(path: str = "cookies.json") -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def build_http_session(cookies: dict) -> requests.Session:
    s = requests.Session()
    s.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Referer": BASE_REFERER,
            "Origin": BASE_SITE,
            "X-Requested-With": "XMLHttpRequest",
        }
    )

    for k, v in cookies.items():
        s.cookies.set(k, v, domain=BASE_DOMAIN, path="/")

    if "csrftoken" in cookies:
        s.headers["X-CSRFToken"] = cookies["csrftoken"]

    return s


def warmup_session(session: requests.Session) -> None:
    r = session.get(BASE_REFERER, timeout=20, allow_redirects=True)
    print("[HTTP] warmup status:", r.status_code)
    print("[HTTP] warmup final url:", r.url)
    print("[HTTP] cookies after warmup:", session.cookies.get_dict())


def normalize_bars_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    if "time" in df.columns and "ts" not in df.columns:
        df = df.rename(columns={"time": "ts"})

    required = ["ts", "open", "high", "low", "close"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(
            f"Missing required columns: {missing}. Got columns: {list(df.columns)}"
        )

    if "volume" not in df.columns:
        df["volume"] = np.nan

    df = df[["ts", "open", "high", "low", "close", "volume"]].copy()

    df["ts"] = pd.to_numeric(df["ts"], errors="coerce").astype("Int64")
    for col in ["open", "high", "low", "close", "volume"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["ts", "open", "high", "low", "close"]).copy()
    df["ts"] = df["ts"].astype(int)

    return df


def fetch_bars(
    session: requests.Session,
    symbol: str,
    resolution: str,
    start_ts: int,
    end_ts: int,
) -> pd.DataFrame:
    params = {
        "symbol": symbol,
        "from": start_ts,
        "to": end_ts,
        "resolution": resolution,
    }

    r = session.get(BARS_URL, params=params, timeout=30)
    print("[BARS] status:", r.status_code)
    print("[BARS] url:", r.url)
    r.raise_for_status()

    data = r.json()

    if isinstance(data, dict) and all(k in data for k in ["t", "o", "h", "l", "c"]):
        df = pd.DataFrame(
            {
                "ts": data["t"],
                "open": data["o"],
                "high": data["h"],
                "low": data["l"],
                "close": data["c"],
            }
        )
        if "v" in data:
            df["volume"] = data["v"]
        else:
            df["volume"] = np.nan
        return normalize_bars_dataframe(df)

    if isinstance(data, list):
        df = pd.DataFrame(data)
        return normalize_bars_dataframe(df)

    raise ValueError(f"Unexpected API response shape: {str(data)[:500]}")


def load_latest_ws(name: str) -> Optional[dict]:
    p = WS_DIR / f"{name}_latest.json"
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return None


def ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    up = delta.clip(lower=0.0)
    down = -delta.clip(upper=0.0)
    ma_up = up.ewm(alpha=1 / period, adjust=False).mean()
    ma_down = down.ewm(alpha=1 / period, adjust=False).mean()
    rs = ma_up / ma_down.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def macd(close: pd.Series):
    fast = ema(close, 12)
    slow = ema(close, 26)
    line = fast - slow
    signal = ema(line, 9)
    hist = line - signal
    return line, signal, hist


def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [
            df["high"] - df["low"],
            (df["high"] - prev_close).abs(),
            (df["low"] - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return tr.rolling(period).mean()


def bollinger(close: pd.Series, period: int = 20, n_std: float = 2.0):
    mid = close.rolling(period).mean()
    std = close.rolling(period).std(ddof=0)
    upper = mid + n_std * std
    lower = mid - n_std * std
    return lower, mid, upper


def donchian(df: pd.DataFrame, period: int = 20):
    upper = df["high"].rolling(period).max()
    lower = df["low"].rolling(period).min()
    mid = (upper + lower) / 2
    return lower, mid, upper


def slope(series: pd.Series, n: int = 10) -> float:
    s = series.dropna().tail(n)
    if len(s) < 3:
        return 0.0
    y = s.values.astype(float)
    x = np.arange(len(y), dtype=float)
    m = np.polyfit(x, y, 1)[0]
    return float(m)


def wall_features(wall_json: Optional[dict]) -> dict:
    out = {
        "best_bid": np.nan,
        "best_ask": np.nan,
        "spread": np.nan,
        "bid_volume_sum": np.nan,
        "ask_volume_sum": np.nan,
        "imbalance": np.nan,
        "microprice": np.nan,
    }

    if not wall_json or "json" not in wall_json or not wall_json["json"]:
        return out

    data = wall_json["json"]
    buys = data.get("buy", [])
    sells = data.get("sell", [])

    if not buys or not sells:
        return out

    best_bid = max(float(x["price"]) for x in buys)
    best_ask = min(float(x["price"]) for x in sells)

    bid_volume_sum = float(sum(x["volume"] for x in buys))
    ask_volume_sum = float(sum(x["volume"] for x in sells))

    denom = bid_volume_sum + ask_volume_sum
    imbalance = (bid_volume_sum - ask_volume_sum) / denom if denom else 0.0

    bb = max(buys, key=lambda x: float(x["price"]))
    ba = min(sells, key=lambda x: float(x["price"]))

    bid_px, bid_sz = float(bb["price"]), float(bb["volume"])
    ask_px, ask_sz = float(ba["price"]), float(ba["volume"])

    microprice = ((ask_px * bid_sz) + (bid_px * ask_sz)) / (bid_sz + ask_sz)

    out.update(
        {
            "best_bid": best_bid,
            "best_ask": best_ask,
            "spread": best_ask - best_bid,
            "bid_volume_sum": bid_volume_sum,
            "ask_volume_sum": ask_volume_sum,
            "imbalance": imbalance,
            "microprice": microprice,
        }
    )
    return out


def latest_price(price_json: Optional[dict]) -> float:
    if not price_json or "json" not in price_json or not price_json["json"]:
        return np.nan
    return float(price_json["json"].get("price", np.nan))


def build_features(
    df: pd.DataFrame,
    price_json: Optional[dict],
    wall_json: Optional[dict],
) -> dict:
    df = df.copy().sort_values("ts").drop_duplicates("ts")
    c = df["close"]

    _, _, macd_hist = macd(c)
    bb_low, bb_mid, bb_up = bollinger(c)
    dc_low, dc_mid, dc_up = donchian(df)
    atr14 = atr(df, 14)
    rsi14 = rsi(c, 14)

    now_price = latest_price(price_json)
    wf = wall_features(wall_json)

    feat = {
        "last_bar_ts": int(df["ts"].iloc[-1]),
        "bar_close": float(c.iloc[-1]),
        "ema9": float(ema(c, 9).iloc[-1]),
        "ema21": float(ema(c, 21).iloc[-1]),
        "ema50": float(ema(c, 50).iloc[-1]),
        "rsi14": float(rsi14.iloc[-1]),
        "macd_hist": float(macd_hist.iloc[-1]),
        "atr14": float(atr14.iloc[-1]),
        "bb_low": float(bb_low.iloc[-1]),
        "bb_mid": float(bb_mid.iloc[-1]),
        "bb_up": float(bb_up.iloc[-1]),
        "dc_low": float(dc_low.iloc[-1]),
        "dc_mid": float(dc_mid.iloc[-1]),
        "dc_up": float(dc_up.iloc[-1]),
        "slope_10": float(slope(c, 10)),
        "slope_20": float(slope(c, 20)),
        "now_price": float(now_price)
        if not math.isnan(now_price)
        else float(c.iloc[-1]),
    }

    feat.update(wf)
    return feat


def score_market(feat: dict) -> dict:
    score = 0.0
    reasons = []

    if feat["now_price"] > feat["ema9"] > feat["ema21"]:
        score += 1.5
        reasons.append("price > ema9 > ema21")
    elif feat["now_price"] < feat["ema9"] < feat["ema21"]:
        score -= 1.5
        reasons.append("price < ema9 < ema21")

    if feat["ema21"] > feat["ema50"]:
        score += 1.0
        reasons.append("ema21 > ema50")
    else:
        score -= 1.0
        reasons.append("ema21 <= ema50")

    if feat["macd_hist"] > 0:
        score += 1.0
        reasons.append("macd_hist positive")
    else:
        score -= 1.0
        reasons.append("macd_hist negative")

    if feat["rsi14"] < 30:
        score += 0.7
        reasons.append("rsi oversold")
    elif feat["rsi14"] > 70:
        score -= 0.7
        reasons.append("rsi overbought")

    if feat["slope_10"] > 0 and feat["slope_20"] > 0:
        score += 0.8
        reasons.append("short/medium slope positive")
    elif feat["slope_10"] < 0 and feat["slope_20"] < 0:
        score -= 0.8
        reasons.append("short/medium slope negative")

    if not math.isnan(feat["imbalance"]):
        if feat["imbalance"] > 0.15:
            score += 0.9
            reasons.append("bid imbalance")
        elif feat["imbalance"] < -0.15:
            score -= 0.9
            reasons.append("ask imbalance")

    if not math.isnan(feat["microprice"]):
        if feat["microprice"] > feat["now_price"]:
            score += 0.4
            reasons.append("microprice above last")
        elif feat["microprice"] < feat["now_price"]:
            score -= 0.4
            reasons.append("microprice below last")

    regime = "range"
    atr_ref = feat["atr14"] if not math.isnan(feat["atr14"]) else 0.0
    if abs(feat["slope_20"]) > max(atr_ref * 0.03, 1e-9):
        regime = "trend"

    if score >= 2.0:
        bias = "bullish"
    elif score <= -2.0:
        bias = "bearish"
    else:
        bias = "neutral"

    return {
        "score": round(score, 3),
        "bias": bias,
        "regime": regime,
        "reasons": reasons,
    }


def scenario_text(feat: dict, scored: dict) -> dict:
    px = feat["now_price"]
    atrv = feat["atr14"]

    if math.isnan(atrv) or atrv <= 0:
        atrv = max(abs(px) * 0.002, 0.5)

    long_trigger = max(feat["bb_mid"], feat["ema9"], px)
    short_trigger = min(feat["bb_mid"], feat["ema9"], px)

    long_sl = long_trigger - 1.2 * atrv
    long_tp1 = long_trigger + 1.0 * atrv
    long_tp2 = long_trigger + 2.0 * atrv

    short_sl = short_trigger + 1.2 * atrv
    short_tp1 = short_trigger - 1.0 * atrv
    short_tp2 = short_trigger - 2.0 * atrv

    return {
        "not_financial_advice": True,
        "bias": scored["bias"],
        "regime": scored["regime"],
        "score": scored["score"],
        "entry_zone_long_example": round(long_trigger, 2),
        "stop_long_example": round(long_sl, 2),
        "tp1_long_example": round(long_tp1, 2),
        "tp2_long_example": round(long_tp2, 2),
        "entry_zone_short_example": round(short_trigger, 2),
        "stop_short_example": round(short_sl, 2),
        "tp1_short_example": round(short_tp1, 2),
        "tp2_short_example": round(short_tp2, 2),
        "time_horizon_guess": "very short-term / intraday only",
        "note": "These are scenario levels derived from ATR and current structure, not guaranteed signals.",
    }


def merge_and_save(df_new: pd.DataFrame) -> pd.DataFrame:
    if HISTORY_PATH.exists():
        old = pd.read_csv(HISTORY_PATH)
        df = pd.concat([old, df_new], ignore_index=True)
    else:
        df = df_new.copy()

    df = normalize_bars_dataframe(df)
    df = df.sort_values("ts").drop_duplicates("ts").reset_index(drop=True)
    df.to_csv(HISTORY_PATH, index=False)
    return df


def main():
    cookies = load_cookies(CFG.cookies_path)
    session = build_http_session(cookies)
    warmup_session(session)

    while True:
        try:
            end_ts = int(time.time())
            start_ts = end_ts - CFG.lookback_seconds

            df_new = fetch_bars(
                session=session,
                symbol=CFG.symbol,
                resolution=CFG.resolution,
                start_ts=start_ts,
                end_ts=end_ts,
            )

            df = merge_and_save(df_new)

            price_json = load_latest_ws("price")
            wall_json = load_latest_ws("wall")

            feat = build_features(df, price_json, wall_json)
            scored = score_market(feat)
            scenario = scenario_text(feat, scored)

            output = {
                "ts": int(time.time()),
                "bars_count": int(len(df)),
                "features": feat,
                "score": scored,
                "scenario": scenario,
            }

            SIGNAL_PATH.write_text(
                json.dumps(output, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )

            print(json.dumps(output, ensure_ascii=False, indent=2))

        except KeyboardInterrupt:
            break
        except Exception as exc:
            print(f"[ERROR] {exc}")

        time.sleep(CFG.poll_every_seconds)


if __name__ == "__main__":
    main()
