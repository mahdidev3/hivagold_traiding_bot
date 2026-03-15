import argparse
import json

import requests


def _print_response(response: requests.Response):
    response.raise_for_status()
    print(json.dumps(response.json(), ensure_ascii=False, indent=2))


def add_common_room_args(parser: argparse.ArgumentParser):
    parser.add_argument("--mobile", required=True)
    parser.add_argument("--base-domain", default="https://hivagold.com")
    parser.add_argument("--market", default="xag", choices=["xag", "mazaneh", "ounce"])


def main():
    parser = argparse.ArgumentParser(description="Hivagold API Server CLI")
    parser.add_argument(
        "--server", default="http://localhost:8000", help="API server base URL"
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    login_parser = subparsers.add_parser("login")
    login_parser.add_argument("--mobile", required=True)
    login_parser.add_argument("--password", required=True)
    login_parser.add_argument("--base-domain")

    logout_parser = subparsers.add_parser("logout")
    logout_parser.add_argument("--mobile", required=True)
    logout_parser.add_argument("--base-domain")

    room_status_parser = subparsers.add_parser("room-status")
    room_status_parser.add_argument("--mobile", required=True)
    room_status_parser.add_argument("--base-domain", default="https://hivagold.com")
    room_status_parser.add_argument(
        "--market", default="xag", choices=["xag", "mazaneh", "ounce"]
    )

    room_parser = subparsers.add_parser("room")
    room_parser.add_argument(
        "action",
        choices=[
            "portfolios",
            "orders",
            "order-create",
            "order-close",
            "transactions",
            "transaction-close",
            "portfolio-close",
            "portfolio-create",
        ],
    )
    add_common_room_args(room_parser)
    room_parser.add_argument("--order-id")
    room_parser.add_argument("--transaction-id")
    room_parser.add_argument("--portfolio-id")
    room_parser.add_argument("--order-type")
    room_parser.add_argument("--action-side", choices=["buy", "sell"])
    room_parser.add_argument("--units", type=float)
    room_parser.add_argument("--price", type=float)
    room_parser.add_argument("--stop-loss", type=float)
    room_parser.add_argument("--take-profit", type=float)

    args = parser.parse_args()

    if args.command == "login":
        payload = {"mobile": args.mobile, "password": args.password}
        if args.base_domain:
            payload["base_domain"] = args.base_domain
        response = requests.post(f"{args.server}/login", json=payload, timeout=30)
        _print_response(response)
        return

    if args.command == "logout":
        payload = {"mobile": args.mobile}
        if args.base_domain:
            payload["base_domain"] = args.base_domain
        response = requests.post(f"{args.server}/logout", json=payload, timeout=30)
        _print_response(response)
        return

    if args.command == "room-status":
        payload = {
            "mobile": args.mobile,
            "base_domain": args.base_domain,
            "market": args.market,
        }
        response = requests.post(f"{args.server}/room/status", json=payload, timeout=30)
        _print_response(response)
        return

    if args.command == "room":
        payload = {
            "mobile": args.mobile,
            "base_domain": args.base_domain,
            "market": args.market,
            "payload": {},
        }
        optional_fields = {
            "order_id": args.order_id,
            "transaction_id": args.transaction_id,
            "portfolio_id": args.portfolio_id,
            "order_type": args.order_type,
            "action": args.action_side,
            "units": args.units,
            "price": args.price,
            "stop_loss": args.stop_loss,
            "take_profit": args.take_profit,
        }
        payload["payload"] = {k: v for k, v in optional_fields.items() if v is not None}
        response = requests.post(
            f"{args.server}/room/{args.action}", json=payload, timeout=30
        )
        _print_response(response)
        return

    raise SystemExit("Unsupported command")


if __name__ == "__main__":
    main()
