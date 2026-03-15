# Kubernetes Manifests

Kubernetes deployment files for the online stack in namespace `hivagold`.

## Included resources

From `k8s/base/kustomization.yaml`:

- `namespace.yaml`
- `configmap.yaml`
- `secret.yaml`
- `bot-captcha-worker.yaml`
- `bot-auth-worker.yaml`
- `bot-room-worker.yaml`
- `bot-trading-worker.yaml`
- `api-server.yaml`
- `ingress.yaml`
- `externalname-services.yaml`

> `bot_simulator_worker` is currently **not** deployed by `k8s/base`.

## Managed targets (`manage.ps1`)

- `all`
- `api-server`
- `bot-auth-worker`
- `bot-captcha-worker`
- `bot-room-worker`
- `bot-trading-worker`

## `manage.ps1` usage

Run from repository root:

```powershell
./k8s/manage.ps1 <action> [target]
```

### Actions

- `sync-images` – update image tags in manifests from worker `APP_VERSION`.
- `load-images` – ensure local images exist and load into Minikube when needed.
- `prepare` – run `sync-images` + `load-images`.
- `apply` / `update` – prepare then apply target manifest(s).
- `delete` – delete target manifest(s).
- `get-all` – `kubectl get all -n hivagold`.
- `check-all` – `kubectl get deployments,pods,svc,ingress -n hivagold -o wide`.
- `status` – rollout status for deployment target(s).
- `help` – print script usage.

## Typical local Minikube flow

```powershell
# 1) Build images using each worker APP_VERSION
docker build -t hivagold-api-server:<APP_VERSION> workers/api_server
docker build -t bot-auth-worker:<APP_VERSION> workers/bot_auth_worker
docker build -t bot-captcha-worker:<APP_VERSION> workers/bot_captcha_worker
docker build -t bot-room-worker:<APP_VERSION> workers/bot_room_worker
docker build -t bot-trading-worker:<APP_VERSION> workers/bot_trading_worker

# 2) Sync tags + load images
./k8s/manage.ps1 prepare all

# 3) Deploy
./k8s/manage.ps1 apply all

# 4) Verify
./k8s/manage.ps1 check-all
./k8s/manage.ps1 status all
```
