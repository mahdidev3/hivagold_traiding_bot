from workers.bot_trading_worker.app.service import BotThreadConfig, TradingWorkerService


class DummySessionStore:
    pass


class DummyMarket:
    pass


class DummyExec:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"
    WS_EXTERNAL_PRICE_URL = ""


def test_task_ws_urls_follow_market_and_selected_streams():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())
    bot = BotThreadConfig(
        user_id="u-1",
        portfolio_id="p-1",
        market="btc",
        strategy="simple_position_test_v1",
        mobile="0912",
        password="x",
        domain="https://hivagold.com",
        metadata={"ws_streams": ["price", "external-price"], "external_price_ws": "wss://feed.example/ws"},
    )
    urls = service._ws_urls("https://hivagold.com", bot)
    assert "price" in urls
    assert urls["price"].endswith("/btc/ws/btc/price/")
    assert "external-price" in urls
    assert "live-bars" not in urls


def test_simple_test_strategy_is_registered():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())
    bot = BotThreadConfig(
        user_id="u-1",
        portfolio_id="p-1",
        market="xag",
        strategy="simple_position_test_v1",
        mobile="0912",
        password="x",
        domain="https://hivagold.com",
    )
    strategy = service._resolve_strategy(bot)
    assert strategy is not None
    assert strategy.name == "simple_position_test_v1"
