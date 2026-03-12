import argparse
import json
import requests


def main():
    parser = argparse.ArgumentParser(description="Hivagold API Server CLI")
    parser.add_argument("--server", default="http://localhost:8007", help="API server base URL")

    subparsers = parser.add_subparsers(dest="command", required=True)

    login_parser = subparsers.add_parser("login")
    login_parser.add_argument("--mobile", required=True)
    login_parser.add_argument("--password", required=True)
    login_parser.add_argument("--base-domain")

    logout_parser = subparsers.add_parser("logout")
    logout_parser.add_argument("--mobile", required=True)
    logout_parser.add_argument("--base-domain")

    signals_parser = subparsers.add_parser("signals")
    signals_parser.add_argument("--latest", action="store_true")

    args = parser.parse_args()

    if args.command == "login":
        payload = {"mobile": args.mobile, "password": args.password}
        if args.base_domain:
            payload["base_domain"] = args.base_domain
        response = requests.post(f"{args.server}/login", json=payload, timeout=30)
    elif args.command == "logout":
        payload = {"mobile": args.mobile}
        if args.base_domain:
            payload["base_domain"] = args.base_domain
        response = requests.post(f"{args.server}/logout", json=payload, timeout=30)
    elif args.command == "signals":
        response = requests.get(f"{args.server}/signals/latest", timeout=30)
    else:
        raise SystemExit("Unsupported command")

    response.raise_for_status()
    print(json.dumps(response.json(), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
