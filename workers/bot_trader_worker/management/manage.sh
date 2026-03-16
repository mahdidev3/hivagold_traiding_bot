#!/usr/bin/env bash
set -e

case "$1" in
  local)
    python run.py
    ;;
  *)
    echo "Usage: ./management/manage.sh local"
    exit 1
    ;;
esac
