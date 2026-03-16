#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-help}"
TARGET="${2:-all}"
REMOTE_URL="${DOCTOR_REMOTE_URL:-https://github.com/mahdidev3/hivagold_traiding_bot.git}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

WORKERS=(
  "api_server:8000"
  "bot_captcha_worker:8001"
  "bot_auth_worker:8002"
  "bot_room_worker:8005"
  "bot_trading_worker:8006"
  "bot_simulator_worker:8007"
)

resolve_workers() {
  if [[ "$TARGET" == "all" ]]; then
    printf '%s\n' "${WORKERS[@]}"
    return
  fi
  for item in "${WORKERS[@]}"; do
    local name="${item%%:*}"
    if [[ "$name" == "$TARGET" ]]; then
      printf '%s\n' "$item"
      return
    fi
  done
  echo "[ERROR] Unknown target '$TARGET'." >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "[ERROR] Missing required command: $1" >&2; exit 1; }
}

call_manage() {
  local worker="$1"
  local action="$2"
  local script="$REPO_ROOT/workers/$worker/management/manage.sh"
  [[ -x "$script" ]] || chmod +x "$script"
  echo "[*] $worker -> $action"
  "$script" "$action"
}

action_doctor() {
  echo "[*] Running doctor checks..."
  for cmd in git python3 docker curl; do
    if command -v "$cmd" >/dev/null 2>&1; then
      echo "[OK] command '$cmd' found"
    else
      echo "[WARN] command '$cmd' not found"
    fi
  done

  if git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[OK] valid git repository"
    local branch
    branch="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)"
    echo "[i] current branch: $branch"
  else
    echo "[ERROR] not a git repository: $REPO_ROOT"
    exit 1
  fi

  while IFS= read -r item; do
    local worker="${item%%:*}"
    local port="${item##*:}"
    local manage_script="$REPO_ROOT/workers/$worker/management/manage.sh"
    if [[ -f "$manage_script" ]]; then
      echo "[OK] manage script exists: workers/$worker/management/manage.sh"
    else
      echo "[WARN] missing manage script for $worker"
    fi

    local env_file="$REPO_ROOT/workers/$worker/.env"
    if [[ -f "$env_file" ]]; then
      echo "[OK] env file exists: workers/$worker/.env"
    else
      echo "[WARN] missing env file for $worker at workers/$worker/.env"
    fi

    if curl -fsS "http://localhost:$port/health" >/dev/null 2>&1; then
      echo "[OK] $worker health endpoint is reachable on :$port"
    else
      echo "[WARN] $worker health endpoint is not reachable on :$port"
    fi
  done < <(resolve_workers)
}

action_update() {
  require_cmd git
  git -C "$REPO_ROOT" diff --quiet || {
    echo "[ERROR] Working tree has local changes. Commit or stash them before update." >&2
    exit 1
  }
  git -C "$REPO_ROOT" diff --cached --quiet || {
    echo "[ERROR] Index has staged changes. Commit or stash them before update." >&2
    exit 1
  }

  local branch
  branch="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)"
  echo "[*] Fetching latest commits from: $REMOTE_URL"
  git -C "$REPO_ROOT" fetch "$REMOTE_URL" "$branch"
  echo "[*] Pulling latest commits into branch '$branch'"
  git -C "$REPO_ROOT" pull --ff-only "$REMOTE_URL" "$branch"

  echo "[*] Restarting services after update"
  TARGET="all"
  action_restart
}

action_start() {
  while IFS= read -r item; do
    call_manage "${item%%:*}" "up"
  done < <(resolve_workers)
}

action_stop() {
  while IFS= read -r item; do
    call_manage "${item%%:*}" "down"
  done < <(resolve_workers)
}

action_restart() {
  while IFS= read -r item; do
    call_manage "${item%%:*}" "restart"
  done < <(resolve_workers)
}

action_build() {
  while IFS= read -r item; do
    call_manage "${item%%:*}" "build"
  done < <(resolve_workers)
}

action_status() {
  while IFS= read -r item; do
    local worker="${item%%:*}"
    local port="${item##*:}"
    if curl -fsS "http://localhost:$port/health" >/dev/null 2>&1; then
      echo "[OK] $worker running on :$port"
    else
      echo "[WARN] $worker not reachable on :$port"
    fi
  done < <(resolve_workers)
}

action_logs() {
  local item
  item="$(resolve_workers | head -n1)"
  [[ "$TARGET" == "all" ]] && {
    echo "[ERROR] logs action requires a single worker target" >&2
    exit 1
  }
  call_manage "${item%%:*}" "logs"
}

show_help() {
  cat <<USAGE
Usage: ./doctor.sh <action> [target]

Actions:
  doctor        Run diagnostics (commands, git, health checks)
  update        Pull latest code from $REMOTE_URL and restart all workers
  build         Build docker images for target worker(s)
  start         Start target worker(s)
  stop          Stop target worker(s)
  restart       Restart target worker(s)
  status        Check /health for target worker(s)
  logs          Follow docker logs for a single worker target
  help          Show this message

Targets:
  all (default)
  api_server | bot_captcha_worker | bot_auth_worker | bot_room_worker | bot_trading_worker | bot_simulator_worker

Examples:
  ./doctor.sh doctor
  ./doctor.sh update
  ./doctor.sh restart all
  ./doctor.sh status bot_trading_worker
  ./doctor.sh logs api_server
USAGE
}

case "$ACTION" in
  doctor) action_doctor ;;
  update) action_update ;;
  build) action_build ;;
  start) action_start ;;
  stop) action_stop ;;
  restart) action_restart ;;
  status) action_status ;;
  logs) action_logs ;;
  help|--help|-h) show_help ;;
  *)
    echo "[ERROR] Unknown action: $ACTION" >&2
    show_help
    exit 1
    ;;
esac
