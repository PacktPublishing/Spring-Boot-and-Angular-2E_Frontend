# Chapter 21 - Connecting Frontend and Backend in Production

This chapter connects the containerized Angular frontend from Chapter 20 with the Spring Boot backend from Chapter 10 into one production-style deployment. The Bookstore platform now runs behind a single edge entry point, with Nginx routing browser traffic to the Angular SSR server and forwarding API requests to the Spring Cloud Gateway.

This closes the loop opened in Chapter 10. Across the book, we built a modern full-stack application with reactive forms, event-driven state management, JWT authentication, CRUD workflows, server-side rendering, and real-time notifications. In this final step, those pieces run together as independently deployable containers orchestrated by Docker Compose.

## What You'll Learn

This chapter project shows how to:

- Connect the Angular SSR container to the Spring Boot microservices stack
- Add Nginx as the edge reverse proxy for browser and API traffic
- Route Server-Sent Events through a dedicated proxy configuration
- Extend Docker Compose with frontend and reverse proxy services
- Start the full Bookstore platform with a single `docker compose up -d` command
- Use a production-style deployment topology with clear service boundaries

## Architecture Overview

The deployed system consists of the following layers:

- **Infrastructure**: PostgreSQL, MongoDB, Zipkin, and Keycloak
- **Service Discovery**: Eureka Server
- **Business Services**: Inventory Service and User Service
- **API Layer**: Spring Cloud Gateway
- **Frontend Runtime**: Angular SSR container
- **Edge Proxy**: Nginx

Request flow:

1. The browser connects to Nginx on port `80`.
2. Nginx forwards page requests to the Angular SSR container.
3. Nginx forwards API requests to the Gateway container.
4. The Gateway routes requests to the underlying Spring Boot services.
5. SSE notification traffic is proxied with streaming-friendly settings so live updates are not buffered or broken.

## Project Features

### Unified Docker Compose Deployment

The `docker-compose.yml` file now defines the entire platform in one place. It includes:

- PostgreSQL for the inventory domain
- MongoDB for the user domain
- Zipkin for distributed tracing
- Keycloak for authentication and authorization
- Eureka Server for service registration and discovery
- Inventory Service
- User Service
- Gateway Server
- Angular SSR frontend
- Nginx reverse proxy

Service startup order is controlled with health checks and `depends_on` conditions so containers wait for their dependencies before coming online.

### Angular SSR as a Runtime Service

The frontend is packaged as a Node-based SSR container. It exposes port `4000` internally and reads the backend target from `API_URL`, which is set in Docker Compose to point at the gateway service.

This keeps the frontend runtime environment-specific without rebuilding the image for each deployment target.

### Nginx as the Single Public Entry Point

Nginx is the only service exposed to the browser. It centralizes:

- SSR page delivery
- API proxying
- consistent public routing
- support for streaming notification endpoints

This mirrors real production deployments where an edge proxy sits in front of application containers and hides internal network topology from clients.

### SSE-Aware Proxying

Real-time notifications use Server-Sent Events, which require long-lived HTTP connections and no response buffering. Nginx is configured to proxy these requests separately so event streams pass through correctly.

Without this dedicated configuration, notifications can stall, buffer, or disconnect unexpectedly.

## Tech Stack

- Angular 21 with SSR
- Node.js 22 runtime for the frontend container
- Spring Boot microservices
- Spring Cloud Gateway
- Eureka Server
- Keycloak
- PostgreSQL
- MongoDB
- Zipkin
- Docker
- Docker Compose
- Nginx

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Access to the container images referenced in `docker-compose.yml`

### Start the Full Platform

From the `chapter-21` directory, run:

```bash
docker compose up -d
```

This starts the full stack:

- PostgreSQL
- MongoDB
- Keycloak
- Zipkin
- Eureka Server
- Inventory Service
- User Service
- Gateway Server
- Angular SSR frontend
- Nginx

Open the application at:

```text
http://localhost
```

### Stop the Platform

```bash
docker compose down
```

### Rebuild and Restart

If you need to rebuild images and restart everything from a clean state:

```bash
./containerization/docker-clean-rebuild.sh
```

## Containerization Helper Files

The `containerization/` directory contains helper assets used by the Compose deployment.

### `bookstore-realm.json`

This file seeds Keycloak during container startup.

It defines:

- the `bookstore` realm
- default realm roles such as `admin`, `author`, and `user`
- the gateway client configuration
- sample users with predefined credentials and roles

Docker Compose mounts this file into the Keycloak container and starts Keycloak with `start-dev --import-realm`, so the authentication server is initialized automatically.

### `docker-clean-rebuild.sh`

This is an operational helper script for resetting the local Docker environment and recreating the stack.

It performs a more aggressive workflow than a normal `docker compose down` by:

- removing known Bookstore containers by explicit name
- stopping and deleting related leftover containers
- removing matching images, volumes, and networks
- pruning unused Docker resources
- rebuilding images without cache
- starting the Compose stack again

Use it when stale containers, conflicting names, broken images, or leftover networks prevent a clean startup.

## Reverse Proxy Files

The `nginx/` directory contains the files for the edge proxy image:

- `nginx.conf`: Nginx routing rules for SSR, API proxying, and SSE-friendly streaming
- `Dockerfile`: packages the custom Nginx configuration into a deployable image

Together, these files turn Nginx into the single browser-facing entry point for the platform.

## Project Structure

```text
.
├── Dockerfile                         # Multi-stage Angular SSR image
├── docker-compose.yml                 # Full-stack orchestration for frontend, backend, and infra
├── nginx/
│   ├── Dockerfile                     # Custom Nginx image build
│   └── nginx.conf                     # Reverse proxy and SSE routing rules
├── containerization/
│   ├── bookstore-realm.json           # Keycloak realm import with sample users and roles
│   └── docker-clean-rebuild.sh        # Clean rebuild helper for the local Docker environment
├── package.json                       # Frontend build, serve, and test scripts
├── angular.json
├── src/
│   ├── main.ts                        # Browser bootstrap
│   ├── main.server.ts                 # SSR bootstrap
│   ├── server.ts                      # Angular SSR server
│   ├── environments/
│   └── app/
└── public/
```

## Deployment Notes

### Internal Ports

- Nginx listens on `80`
- Angular SSR listens on `4000`
- Gateway Server listens on `8080`
- Inventory Service listens on `8081`
- User Service listens on `8082`
- Eureka listens on `8761`
- Keycloak listens on `8090`
- Zipkin listens on `9411`

### Why This Setup Matters

This deployment reflects common production architecture patterns:

- each service is independently deployable
- infrastructure is defined declaratively in Compose
- internal service communication stays on a private Docker network
- the browser talks to a single public entry point
- frontend and backend containers remain loosely coupled through environment-driven configuration

The result is a reproducible, full-stack deployment that developers can start with one command while still following patterns used in real microservice environments.

## Testing

Run the frontend test suite with:

```bash
npm test
```

Run tests once with:

```bash
npm run test:run
```

## Next Steps

At this point, the Bookstore platform is fully containerized from the browser edge to the data layer. A natural next step is to adapt this local Compose deployment for cloud infrastructure, external secrets management, TLS termination, and CI/CD-based image delivery.
