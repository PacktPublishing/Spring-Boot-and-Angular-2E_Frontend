#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CHAPTER_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

DOCKER_NAMESPACE="${DOCKER_NAMESPACE:-dkiriakakis}"
FRONTEND_IMAGE_NAME="${FRONTEND_IMAGE_NAME:-ng-bookstore}"
NGINX_IMAGE_NAME="${NGINX_IMAGE_NAME:-nginx}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

FRONTEND_IMAGE="${DOCKER_NAMESPACE}/${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}"
NGINX_IMAGE="${DOCKER_NAMESPACE}/${NGINX_IMAGE_NAME}:${IMAGE_TAG}"

echo "[INFO] Building Angular SSR image: ${FRONTEND_IMAGE}"
docker build -t "${FRONTEND_IMAGE}" "${CHAPTER_DIR}"

echo "[INFO] Building Nginx image: ${NGINX_IMAGE}"
docker build -t "${NGINX_IMAGE}" "${CHAPTER_DIR}/nginx"

echo "[INFO] Pushing Angular SSR image: ${FRONTEND_IMAGE}"
docker push "${FRONTEND_IMAGE}"

echo "[INFO] Pushing Nginx image: ${NGINX_IMAGE}"
docker push "${NGINX_IMAGE}"

echo "[SUCCESS] Published ${FRONTEND_IMAGE} and ${NGINX_IMAGE}"
