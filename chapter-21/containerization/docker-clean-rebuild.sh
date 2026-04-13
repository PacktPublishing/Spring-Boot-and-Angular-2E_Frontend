#!/bin/bash

# Robust Docker cleanup and rebuild script for all project and infra containers
# Services: eureka-server, gateway-server, inventory-ms, user-ms, postgres, mongo, zipkin, keycloak
# Usage: ./docker-clean-rebuild.sh

set -euo pipefail

PROJECT_NAME="bookstore"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/../docker-compose.yml"

# Explicit container names used by docker-compose.yml (prevents name-conflict leftovers)
CONTAINER_NAMES=(
  "bookstore-postgres"
  "bookstore-mongo"
  "bookstore-zipkin"
  "bookstore-keycloak"
  "bookstore-eureka-server"
  "bookstore-inventory-service"
  "bookstore-user-service"
  "bookstore-gateway-server"
  "bookstore-ng-frontend"
  "bookstore-nginx"
)

echo "[INFO] Force-removing known project containers by explicit name..."
docker rm -f "${CONTAINER_NAMES[@]}" 2>/dev/null || true

echo "[INFO] Stopping all running containers related to the project and infra..."
docker ps -a --format '{{.Names}}' | grep -E 'eureka|gateway|inventory|user|postgres|mongo|zipkin|keycloak|ng-frontend|nginx' | xargs -r docker stop || true

echo "[INFO] Removing all containers related to the project and infra..."
docker ps -a --format '{{.Names}}' | grep -E 'eureka|gateway|inventory|user|postgres|mongo|zipkin|keycloak|ng-frontend|nginx' | xargs -r docker rm -f || true

echo "[INFO] Removing all images related to the project and infra..."
docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' | grep -E 'eureka|gateway|inventory|user|postgres|mongo|zipkin|keycloak|ng-bookstore|nginx' | awk '{print $2}' | xargs -r docker rmi -f || true

echo "[INFO] Removing all volumes related to the project and infra..."
docker volume ls --format '{{.Name}}' | grep -E 'eureka|gateway|inventory|user|postgres|mongo|zipkin|keycloak|ng-bookstore|nginx' | xargs -r docker volume rm || true

echo "[INFO] Removing all networks related to the project and infra..."
docker network ls --format '{{.Name}}' | grep -E 'eureka|gateway|inventory|user|postgres|mongo|zipkin|keycloak|ng-bookstore|nginx' | xargs -r docker network rm || true

echo "[INFO] Pruning unused Docker resources (optional)..."
docker system prune -f

echo "[INFO] Building latest images using docker compose..."
docker compose -f "$COMPOSE_FILE" build --no-cache

echo "[INFO] Starting up all services with docker compose..."
docker compose -f "$COMPOSE_FILE" up -d

echo "[SUCCESS] All containers rebuilt and started."
# Remove all images related to the project (by name pattern)
IMAGES=$(docker images --format '{{.Repository}}:{{.Tag}}' | grep "$PROJECT_NAME" || true)
if [ -n "$IMAGES" ]; then
  echo "$IMAGES" | xargs -n 1 docker rmi -f || true
  echo "Project images removed."
else
  echo "No project images found to remove."
fi

# Remove all volumes related to the project (by name pattern)
VOLUMES=$(docker volume ls --format '{{.Name}}' | grep "$PROJECT_NAME" || true)
if [ -n "$VOLUMES" ]; then
  echo "$VOLUMES" | xargs -n 1 docker volume rm -f || true
  echo "Project volumes removed."
else
  echo "No project volumes found to remove."
fi

# Remove all networks related to the project (by name pattern)
NETWORKS=$(docker network ls --format '{{.Name}}' | grep "$PROJECT_NAME" || true)
if [ -n "$NETWORKS" ]; then
  echo "$NETWORKS" | xargs -n 1 docker network rm || true
  echo "Project networks removed."
else
  echo "No project networks found to remove."
fi

# Build latest images and recreate everything
if docker compose build --no-cache && docker compose up -d --remove-orphans; then
  echo "Docker Compose environment rebuilt and started."
else
  echo "Docker Compose build or up failed."
  exit 1
fi

echo "All project containers, images, volumes, and networks have been cleaned and recreated."
