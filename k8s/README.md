# Kubernetes Manifests

This folder contains a full baseline Kubernetes setup for the Hivagold trading bot microservices.

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

## Notes

- Container images are managed per worker via each worker `.env` (`APP_VERSION`) and can be synced into manifests with `k8s/manage.ps1 sync-images`.
- Initial defaults are `1.0.0.0` for all workers.
- You can set different `APP_VERSION` values per worker and run `k8s/manage.ps1 update <worker-name>` to roll out only one worker.
