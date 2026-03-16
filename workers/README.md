# Workers Deployment Guide

This file only explains deployment.

## Option 1: Docker Compose (local)

Each worker has `workers/<worker_name>/docker/docker-compose.yaml`.

Run one worker:

```bash
cd workers/api_server/docker
docker compose up --build -d
```

Repeat for:

- `workers/bot_auth_worker/docker`
- `workers/bot_captcha_worker/docker`
- `workers/bot_room_worker/docker`
- `workers/bot_simulator_worker/docker`
- `workers/bot_trading_worker/docker`

## Option 2: Kubernetes

From repository root:

```bash
# build images
docker build -t hivagold-api-server:<APP_VERSION> workers/api_server
docker build -t bot-auth-worker:<APP_VERSION> workers/bot_auth_worker
docker build -t bot-captcha-worker:<APP_VERSION> workers/bot_captcha_worker
docker build -t bot-room-worker:<APP_VERSION> workers/bot_room_worker
docker build -t bot-trading-worker:<APP_VERSION> workers/bot_trading_worker

# prepare manifests + load images (minikube flow)
./k8s/manage.ps1 prepare all

# deploy
./k8s/manage.ps1 apply all

# verify
./k8s/manage.ps1 check-all
./k8s/manage.ps1 status all
```
