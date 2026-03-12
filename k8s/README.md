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

- Container images are currently referenced as:
  - `hivagold-api-server:latest`
  - `bot-auth-worker:latest`
  - `bot-captcha-worker:latest`
  - `bot-room-worker:latest`
  - `bot-trading-worker:latest`
- Update these image names/tags for your registry in production.
