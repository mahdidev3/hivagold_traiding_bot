import argparse
import json

import requests


def _print_response(response: requests.Response):
    response.raise_for_status()
    print(json.dumps(response.json(), ensure_ascii=False, indent=2))


def _bot_ref_payload(args: argparse.Namespace) -> dict:
    payload = {}
    if args.bot_id:
        payload["bot_id"] = args.bot_id
    if args.mobile:
        payload["mobile"] = args.mobile
    if args.domain:
        payload["domain"] = args.domain
    return payload


def main():
    parser = argparse.ArgumentParser(description="Hivagold API Server CLI")
    parser.add_argument("--server", default="http://localhost:8000", help="API server base URL")
    subparsers = parser.add_subparsers(dest="command", required=True)

    login_parser = subparsers.add_parser("login")
    login_parser.add_argument("--mobile", required=True)
    login_parser.add_argument("--password", required=True)
    login_parser.add_argument("--base-domain")

    logout_parser = subparsers.add_parser("logout")
    logout_parser.add_argument("--mobile", required=True)
    logout_parser.add_argument("--base-domain")

    create_bot = subparsers.add_parser("create-bot")
    create_bot.add_argument("--mobile", required=True)
    create_bot.add_argument("--password", required=True)
    create_bot.add_argument("--domain", required=True)
    create_bot.add_argument("--strategy", default="pending")
    create_bot.add_argument("--room", default="xag")
    create_bot.add_argument("--run-mode", default="simulator")
    create_bot.add_argument("--active", action="store_true")

    for name in ("start-bot", "stop-bot", "remove-bot"):
        p = subparsers.add_parser(name)
        p.add_argument("--bot-id")
        p.add_argument("--mobile")
        p.add_argument("--domain")

    args = parser.parse_args()

    if args.command == "login":
        payload = {"mobile": args.mobile, "password": args.password}
        if args.base_domain:
            payload["base_domain"] = args.base_domain
        _print_response(requests.post(f"{args.server}/login", json=payload, timeout=30))
        return

    if args.command == "logout":
        payload = {"mobile": args.mobile}
        if args.base_domain:
            payload["base_domain"] = args.base_domain
        _print_response(requests.post(f"{args.server}/logout", json=payload, timeout=30))
        return

    if args.command == "create-bot":
        payload = {
            "mobile": args.mobile,
            "password": args.password,
            "domain": args.domain,
            "strategy": args.strategy,
            "room": args.room,
            "run_mode": args.run_mode,
            "active": args.active,
        }
        _print_response(requests.post(f"{args.server}/bots/create", json=payload, timeout=30))
        return

    endpoint = {
        "start-bot": "/bots/start",
        "stop-bot": "/bots/stop",
        "remove-bot": "/bots/remove",
    }.get(args.command)
    if endpoint:
        _print_response(requests.post(f"{args.server}{endpoint}", json=_bot_ref_payload(args), timeout=30))
        return

    raise SystemExit("Unsupported command")


if __name__ == "__main__":
    main()
