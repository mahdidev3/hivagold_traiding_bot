# Kubernetes Manifests

This folder contains the baseline Kubernetes setup for the Hivagold trading bot microservices.

## Included resources

- Namespace: `hivagold`
- ConfigMap: shared non-sensitive environment variables
- Secret: `REDIS_PASSWORD`
- Redis:
  - PersistentVolumeClaim
  - Deployment
  - ClusterIP Service
- Deployments + Services for:
  - `api-server`
  - `bot-auth-worker`
  - `bot-captcha-worker`
  - `bot-room-worker`
  - `bot-trading-worker`
- Ingress for public API entrypoint (`api-server`)
- ExternalName Service (`hivagold-main-api`) for DNS-style CNAME forwarding to `demo.hivagold.com`
- `kustomization.yaml` to apply everything in order

## Image policy (important)

Before **any** Kubernetes action (`apply`, `update`, or `prepare`), make sure required images are available **locally**.

- Source of truth is local Docker Desktop images (offline/local flow).
- `manage.ps1` verifies required image tags based on each worker `.env` `APP_VERSION`.
- If current context is Minikube, `manage.ps1` loads those local images into Minikube directly using:
  - `minikube image load <image:tag> --overwrite=true`
- This workflow does not require pulling from the internet if images already exist locally.

## `manage.ps1` full usage

Run from repository root:

```powershell
./k8s/manage.ps1 <action> [target]
```

### Actions

- `sync-images`: update image tags in `k8s/base/*.yaml` from `.env` `APP_VERSION`
- `load-images`: verify local Docker images exist and load them into Minikube (when context is Minikube)
- `prepare`: run `sync-images` + `load-images`
- `apply`: prepare images, then apply manifests
- `update`: same behavior as `apply`, usually used with one worker target
- `delete`: delete manifests
- `get-all`: `kubectl get all -n hivagold`
- `check-all`: `kubectl get deployments,pods,svc,ingress -n hivagold -o wide`
- `status`: rollout status for one/all deployments
- `help`: print command help

### Targets

- `all` (default)
- `api-server`
- `bot-auth-worker`
- `bot-captcha-worker`
- `bot-room-worker`
- `bot-trading-worker`

## Examples (all actions)

### Help

```powershell
./k8s/manage.ps1 help
```

### Sync only (no Kubernetes apply)

```powershell
./k8s/manage.ps1 sync-images all
./k8s/manage.ps1 sync-images bot-auth-worker
```

### Load images only (offline/local image preparation)

```powershell
./k8s/manage.ps1 load-images all
./k8s/manage.ps1 load-images api-server
```

### Prepare (sync + load)

```powershell
./k8s/manage.ps1 prepare all
./k8s/manage.ps1 prepare bot-room-worker
```

### Apply/Update

```powershell
./k8s/manage.ps1 apply all
./k8s/manage.ps1 update bot-trading-worker
```

### Read/health checks

```powershell
./k8s/manage.ps1 get-all
./k8s/manage.ps1 check-all
./k8s/manage.ps1 status all
./k8s/manage.ps1 status api-server
```

### Delete

```powershell
./k8s/manage.ps1 delete bot-captcha-worker
./k8s/manage.ps1 delete all
```

## Recommended Minikube local workflow (no internet pulls)

1. Build images locally in Docker Desktop using versions from worker `.env`:

```powershell
docker build -t hivagold-api-server:<APP_VERSION> workers/api_server
docker build -t bot-auth-worker:<APP_VERSION> workers/bot_auth_worker
docker build -t bot-captcha-worker:<APP_VERSION> workers/bot_captcha_worker
docker build -t bot-room-worker:<APP_VERSION> workers/bot_room_worker
docker build -t bot-trading-worker:<APP_VERSION> workers/bot_trading_worker
```

2. Confirm context and local image preparation:

```powershell
kubectl config current-context
./k8s/manage.ps1 prepare all
```

3. Deploy and verify:

```powershell
./k8s/manage.ps1 apply all
./k8s/manage.ps1 check-all
./k8s/manage.ps1 status all
```
