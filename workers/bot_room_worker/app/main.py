from contextlib import asynccontextmanager
from logging import Logger

from fastapi import FastAPI, HTTPException

from config import get_config
from .clients import build_clients
from .logging_setup import setup_logger
from .queue_manager import RoomQueueManager
from .schemas import (
    CreateActivePortfolioRequest,
    CreateActivePortfolioResponse,
    CloseOrderRequest,
    CloseOrderResponse,
    CloseTransactionRequest,
    CloseTransactionResponse,
    ClosePortfolioRequest,
    ClosePortfolioResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    GetOrdersRequest,
    GetOrdersResponse,
    GetPortfoliosRequest,
    GetPortfoliosResponse,
    GetTransactionsRequest,
    GetTransactionsResponse,
    HealthResponse,
    RoomStatusRequest,
    RoomStatusResponse,
)
from .service import (
    CreateActivePortfolioService,
    CloseOrderService,
    CloseTransactionService,
    ClosePortfolioService,
    CreateOrderService,
    GetOrdersService,
    GetPortfoliosService,
    GetTransactionsService,
    RoomWorkerService,
    CheckRoomStatusService,
)

config = get_config()
logger: Logger = setup_logger(config)

redis_client, portfolio_client, orders_client = build_clients(config, logger)

get_portfolios_service = GetPortfoliosService(
    config, portfolio_client, redis_client, logger
)
create_active_portfolio_service = CreateActivePortfolioService(
    config, portfolio_client, redis_client, logger
)
get_orders_service = GetOrdersService(config, orders_client, redis_client, logger)
create_order_service = CreateOrderService(config, orders_client, redis_client, logger)
close_order_service = CloseOrderService(config, orders_client, redis_client, logger)
get_transactions_service = GetTransactionsService(
    config, portfolio_client, redis_client, logger
)
close_transaction_service = CloseTransactionService(
    config, portfolio_client, redis_client, logger
)
close_portfolio_service = ClosePortfolioService(
    config,
    portfolio_client,
    orders_client,
    redis_client,
    logger,
)
check_room_status_service = CheckRoomStatusService(config, redis_client, logger)

room_worker_service = RoomWorkerService(
    get_portfolios_service=get_portfolios_service,
    create_active_portfolio_service=create_active_portfolio_service,
    get_orders_service=get_orders_service,
    create_order_service=create_order_service,
    close_order_service=close_order_service,
    get_transactions_service=get_transactions_service,
    close_transaction_service=close_transaction_service,
    close_portfolio_service=close_portfolio_service,
    check_room_status_service=check_room_status_service,
    logger=logger,
)
queue_manager = RoomQueueManager(room_worker_service, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting room queue manager")
    await queue_manager.start()
    yield
    logger.info("Stopping room queue manager")
    await queue_manager.stop()


app = FastAPI(
    title=config.APP_NAME,
    version=config.APP_VERSION,
    lifespan=lifespan,
)


def _raise_if_failed(result: dict) -> None:
    if not result.get("success"):
        raise HTTPException(
            status_code=400, detail=result.get("error", "Unknown error")
        )


@app.post("/room/status", response_model=RoomStatusResponse)
async def room_status(request: RoomStatusRequest):
    try:
        logger.debug("Received room_status request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "check_room_status"
        result = await queue_manager.enqueue(args)
        return RoomStatusResponse(**result)
    except Exception as exc:
        logger.error(f"Error in room_status endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        app_name=config.APP_NAME,
        version=config.APP_VERSION,
    )


@app.post("/room/portfolios", response_model=GetPortfoliosResponse)
async def get_portfolios(request: GetPortfoliosRequest):
    try:
        logger.debug("Received get_portfolios request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "get_portfolios"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return GetPortfoliosResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in get_portfolios endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/portfolios/active", response_model=CreateActivePortfolioResponse)
async def create_active_portfolio(request: CreateActivePortfolioRequest):
    try:
        logger.debug(
            "Received create_active_portfolio request mobile=%s", request.mobile
        )
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "create_active_portfolio"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return CreateActivePortfolioResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in create_active_portfolio endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/orders", response_model=GetOrdersResponse)
async def get_orders(request: GetOrdersRequest):
    try:
        logger.debug("Received get_orders request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "get_orders"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return GetOrdersResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in get_orders endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/order/create", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    try:
        logger.debug("Received create_order request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "create_order"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return CreateOrderResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in create_order endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/order/close", response_model=CloseOrderResponse)
async def close_order(request: CloseOrderRequest):
    try:
        logger.debug("Received close_order request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "close_order"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return CloseOrderResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in close_order endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/transactions", response_model=GetTransactionsResponse)
async def get_transactions(request: GetTransactionsRequest):
    try:
        logger.debug("Received get_transactions request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "get_transactions"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return GetTransactionsResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in get_transactions endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/transaction/close", response_model=CloseTransactionResponse)
async def close_transaction(request: CloseTransactionRequest):
    try:
        logger.debug("Received close_transaction request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "close_transaction"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return CloseTransactionResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in close_transaction endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/portfolio/close", response_model=ClosePortfolioResponse)
async def close_portfolio(request: ClosePortfolioRequest):
    try:
        logger.debug("Received close_portfolio request mobile=%s", request.mobile)
        args = request.model_dump(exclude_none=True)
        args["worker_action"] = "close_portfolio"
        result = await queue_manager.enqueue(args)
        _raise_if_failed(result)
        return ClosePortfolioResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in close_portfolio endpoint: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))
