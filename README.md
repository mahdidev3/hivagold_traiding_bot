# Hivagold Trading Bot

This codebase now focuses on task-based trading bots.

## Trading task model

A trading bot is created with:
- `portfolio_id`
- `market`
- `strategy`
- `user_id`

From these, worker generates a deterministic `task_id`. Multiple bots can run under the same `task_id`.

Current execution target is simulator mode (`run_mode=simulator`) with flexible architecture for future real integration.

## API server endpoints

Base URL: `http://localhost:8000`

- `GET /health`
- `POST /login`
- `POST /logout`
- `POST /bots/create`
- `POST /bots/remove`
- `POST /bots/start`
- `POST /bots/stop`
- `POST /tasks/status`
- `POST /tasks/logs`
