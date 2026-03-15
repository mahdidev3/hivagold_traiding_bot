# Kubernetes Manifests

Kubernetes deployment files for the core online stack in namespace `hivagold`.

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

> Note: `bot_simulator_worker` is **not** part of the current Kubernetes base manifests.

## Managed targets (`manage.ps1`)

- `all`
- `api-server`
- `bot-auth-worker`
- `bot-captcha-worker`
- `bot-room-worker`
- `bot-trading-worker`

## `manage.ps1` usage

Run from repo root:

```powershell
./k8s/manage.ps1 <action> [target]
```

### Actions

- `sync-images` – update worker image tags in `k8s/base/*.yaml` from each worker `.env` `APP_VERSION`.
- `load-images` – verify local Docker images exist, and if context is Minikube, run `minikube image load`.
- `prepare` – run `sync-images` + `load-images`.
- `apply` / `update` – prepare images, then apply manifest(s).
- `delete` – delete manifest(s).
- `get-all` – `kubectl get all -n hivagold`.
- `check-all` – `kubectl get deployments,pods,svc,ingress -n hivagold -o wide`.
- `status` – rollout status for target deployment(s).
- `help` – print usage.

## Typical local Minikube flow

```powershell
# 1) Build images locally using each worker APP_VERSION
docker build -t hivagold-api-server:<APP_VERSION> workers/api_server
docker build -t bot-auth-worker:<APP_VERSION> workers/bot_auth_worker
docker build -t bot-captcha-worker:<APP_VERSION> workers/bot_captcha_worker
docker build -t bot-room-worker:<APP_VERSION> workers/bot_room_worker
docker build -t bot-trading-worker:<APP_VERSION> workers/bot_trading_worker

# 2) Sync tags + load to Minikube (if using minikube context)
./k8s/manage.ps1 prepare all

# 3) Deploy
./k8s/manage.ps1 apply all

# 4) Verify
./k8s/manage.ps1 check-all
./k8s/manage.ps1 status all
```
