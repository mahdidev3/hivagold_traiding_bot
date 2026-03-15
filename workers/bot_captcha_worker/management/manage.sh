#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-}"
VOLUME_NAME="${2:-}"
WORKER_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$WORKER_ROOT/docker/docker-compose.yaml"
ENV_FILE="$WORKER_ROOT/.env"
SERVICE_NAME="captcha-worker"
PORT="8001"

compose() { docker compose -f "$COMPOSE_FILE" --project-directory "$WORKER_ROOT" "$@"; }

get_app_version() { grep -m1 '^APP_VERSION=' "$ENV_FILE" | cut -d'=' -f2-; }
get_image_name() { awk '/^[[:space:]]*image:[[:space:]]*/{print $2; exit}' "$COMPOSE_FILE"; }

case "$ACTION" in
  build) compose build ;;
  up) compose up -d; echo "Service available at: http://localhost:$PORT" ;;
  down) compose down ;;
  restart) compose restart ;;
  logs) compose logs -f "$SERVICE_NAME" ;;
  all) compose build; compose up -d; compose logs -f "$SERVICE_NAME" ;;
  volumes) docker system df -v ;;
  volumes-rm) compose down -v ;;
  volume-rm) [ -n "$VOLUME_NAME" ] || { echo "Usage: manage.sh volume-rm <name>"; exit 1; }; docker volume rm "$VOLUME_NAME" ;;
  tag) IMAGE="$(get_image_name)"; VERSION="$(get_app_version)"; REPO="${IMAGE%%:*}"; docker image inspect "$IMAGE" >/dev/null; docker tag "$IMAGE" "$REPO:$VERSION" ;;
  build-tag) compose build; IMAGE="$(get_image_name)"; VERSION="$(get_app_version)"; REPO="${IMAGE%%:*}"; docker image inspect "$IMAGE" >/dev/null; docker tag "$IMAGE" "$REPO:$VERSION" ;;
  *) echo "Usage: $0 <build|up|down|restart|logs|all|volumes|volumes-rm|volume-rm|tag|build-tag> [volume-name]"; exit 1 ;;
esac
