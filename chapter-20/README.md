# Chapter 20 - Production Build and Docker Containerization

This chapter packages and containerizes the Angular frontend built over Chapters 11–19 for production deployment.

Building on the fully featured bookstore app (hybrid rendering, real-time SSE notifications, Signal Store architecture, and authentication), we now:

- Run `ng build` to generate optimized production artifacts via AOT compilation, tree-shaking, and code minification
- Examine the build output structure and compare it to Spring Boot JAR packaging from Chapter 10
- Configure Express proxy middleware in `server.ts` so SSR-initiated API calls resolve to the backend gateway via the configurable `API_URL` environment variable
- Create a multi-stage Dockerfile following Chapter 10 patterns, adapting for Node.js runtime differences (node_modules vs. JAR bundling)
- Build, test, and publish the frontend container image to Docker Hub

The result is a portable, self-contained Angular frontend container ready for orchestration with backend services.

## What You'll Learn

This chapter project showcases:

- How to run `ng build` for production with AOT compilation, tree-shaking, and minification
- How build output structure organizes chunks, assets, and source maps
- How to compare frontend build artifacts to Spring Boot JAR packaging patterns
- How to configure Express proxy middleware for SSR-initiated backend API calls
- How to make the backend gateway URL configurable via environment variables
- How to design a multi-stage Dockerfile adapted for Node.js (vs. Java)
- How to handle node_modules dependency installation in a container runtime
- How to tag and publish a container image to Docker Hub
- How to validate the containerized frontend runs correctly in isolation

## Project Features

### Production Build Pipeline

- **AOT Compilation**: `ng build` compiles TypeScript with Angular's Ahead-of-Time compiler, catching template errors at build time
- **Tree-Shaking**: Webpack removes unused code, significantly reducing bundle sizes
- **Minification**: JavaScript, CSS, and HTML are minified for optimal transfer size
- **Environment File Swap**: Build process replaces `environment.ts` with `environment.prod.ts` (configured in Chapter 16)
- **Source Maps**: Optional `.js.map` files for production debugging without exposing source

### Build Output Structure

- `index.html`: Main entry point with prerendered/server-rendered routes embedded
- `server.js`: SSR server bundle
- `browser/`: Client-side bundles organized by route chunks
- `styles/`: Global CSS bundles
- `assets/`: Static resources (images, fonts, JSON)
- `public/`: Public directory contents (favicon, robots.txt, etc.)

### Express Proxy Middleware (server.ts)

- `server.ts` configures Express proxy middleware to route SSR-initiated API calls to the backend gateway
- The `API_URL` environment variable (set during container bootstrap) controls the backend target
- Proxy middleware intercepts requests matching `/inventory/api/**` patterns and forwards them upstream
- Allows the frontend container to communicate with backend services without hardcoding hostnames

### Multi-Stage Dockerfile

- **Stage 1 (Builder)**: Node.js base image, installs dependencies, runs `npm run build`
- **Stage 2 (Runtime)**: Leaner Node.js base, copies built artifacts and `node_modules` from builder
- **Key Difference from Java**: node_modules must be copied to runtime (Java JAR bundles all dependencies)
- Exposes port 4200; reads `API_URL` and `PORT` environment variables at startup
- Runs `npm run serve:ssr:chapter-20` to start the production SSR server

### Docker Image Publishing

- Build image with appropriate tag: `docker build -t yourdockerhub/bookstore-frontend:latest .`
- Configure Docker Hub credentials and push: `docker push yourdockerhub/bookstore-frontend:latest`
- Image is portable and can be deployed anywhere Docker runs

## Build and Deployment Strategy

The production pipeline combines three complementary patterns:

- **AOT + Tree-Shaking + Minification**: Optimal bundle sizes and fast startup performance
- **Environment-Driven Configuration**: `API_URL` and `PORT` set at container boot, not at build time
- **Multi-Stage Docker Build**: Minimize runtime image size by excluding build toolchain
- **Express Proxy in SSR Server**: Backend connectivity is transparent to routes; no CORS complexity

This approach mirrors the containerization strategy from Chapter 10 (Spring Boot), adapting for Node.js dependency management.

## Tech Stack

- Angular 21 (standalone APIs, SSR)
- Angular Material
- NgRx Signal Store plus NgRx Events
- RxJS for reactive streams
- Express.js for proxy middleware
- Node.js 20+
- Docker & Docker Hub
- Multi-stage Dockerfile builds

## Getting Started

### Prerequisites

- Node.js 20+
- Angular CLI 21.x
- Docker (for containerization)
- Docker Hub account (for publishing images)

### Installation

```bash
npm install
```

### Development Server

```bash
npm run start
```

Open `http://localhost:4200/`.

### Production Build

```bash
npm run build
```

This generates optimized artifacts in the `dist/` directory with AOT compilation, tree-shaking, and minification applied.

### SSR Serve (after build)

```bash
npm run serve:ssr:chapter-20
```

Launches the production SSR server. Reads `API_URL` and `PORT` from environment:
```bash
API_URL=http://localhost:8080 PORT=4200 npm run serve:ssr:chapter-20
```

### Docker Build and Run

Build the image:
```bash
docker build -t yourdockerhub/bookstore-frontend:latest .
```

Run a container:
```bash
docker run -e API_URL=http://host.docker.internal:8080 -p 4200:4200 yourdockerhub/bookstore-frontend:latest
```

Publish to Docker Hub:
```bash
docker push yourdockerhub/bookstore-frontend:latest
```

## Testing

Run tests:

```bash
npm test
```

Run tests once:

```bash
npm run test:run
```

Run interactive test UI:

```bash
npm run test:ui
```

### Unit Test Coverage

Spec files are co-located with their source files and cover all major layers:

| Layer | Covered files |
|---|---|
| App bootstrap | `app.spec.ts` |
| Guards | `auth.guard.spec.ts` |
| Interceptors | `auth.interceptor.spec.ts` |
| Core services | `authentication.spec.ts`, `token.service.spec.ts` |
| Auth services/store | `auth.service.spec.ts`, `auth.store.spec.ts` |
| Books services | `book.service.spec.ts`, `author.service.spec.ts`, `notification.service.spec.ts` |
| Books stores | `author.store.spec.ts` |
| Auth components/pages | `signin-form.spec.ts`, `signup-form.spec.ts`, `signin.spec.ts`, `signup.spec.ts` |
| Books components/pages | `book-form.spec.ts`, `book-list.spec.ts`, `author-form.spec.ts`, `author-list-dialog.spec.ts`, `list.spec.ts` |
| Profile | `profile-form.spec.ts`, `profile.spec.ts` |
| Static pages | `privacy.spec.ts`, `terms.spec.ts` |
| Layout and utilities | `header.spec.ts`, `footer.spec.ts`, `error.utils.spec.ts` |

## Formatting

Format source files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## Project Structure

```text
.
├── Dockerfile                         # Multi-stage build for production container
├── package.json                       # Build, serve, and test scripts
├── angular.json                       # AOT, treeshake, minify, environment swap config
├── tsconfig.json
├── tsconfig.app.json
├── src/
│   ├── main.ts                        # Client bootstrap
│   ├── main.server.ts                 # SSR server bootstrap
│   ├── server.ts                      # Express server + proxy middleware
│   ├── environments/
│   │   ├── environment.ts             # Dev API base URL
│   │   └── environment.prod.ts        # Prod API base URL (swapped by ng build)
│   └── app/
│       ├── app.config.ts              # HTTP client + interceptor + hydration
│       ├── app.routes.ts              # Public catalog + auth/guest guarded routes
│       ├── app.routes.server.ts       # Per-route render mode (SSR/Prerender/CSR)
│       ├── core/
│       ├── features/
│       ├── pages/
│       └── shared/
└── dist/                              # Build output (gitignored)
    ├── server.js                      # Production SSR server bundle
    ├── browser/                       # Client-side route chunks
    ├── styles/                        # Global CSS bundles
    ├── assets/                        # Static resources
    └── public/                        # Favicon, robots.txt, etc.
```

## Key Implementation Highlights

### 1) AOT Compilation and Build Optimization

`ng build` applies Angular's ahead-of-time compiler, Webpack tree-shaking, and code minification. Build output is organized into chunks (one per lazy-loaded route), global styles, and assets, totaling a fraction of the dev bundle.

### 2) Environment Configuration at Runtime

Rather than building separate images per environment, `environment.prod.ts` includes a default `API_BASE_URL`. The Express server reads `API_URL` from process environment at startup, allowing the same image to target different backends without rebuilding.

### 3) Express Proxy Middleware

The SSR server (`server.ts`) adds proxy middleware to intercept `/inventory/api/**` requests and forward them upstream. This eliminates CORS issues and allows the frontend to reference the backend by hostname only.

### 4) Multi-Stage Dockerfile Architecture

Stage 1 builds the app; Stage 2 copies only the runtime artifacts. This keeps the final image lean by excluding Node build tools.

### 5) Dependency Management in Containers

Unlike Java's self-contained JAR, Node.js requires `node_modules` in the runtime container. The Dockerfile copies `node_modules` from the builder stage or relies on `npm ci --production` in the runtime stage, depending on strategy.

### 6) Container Image Publishing and Portability

The built image is tagged and pushed to a registry (Docker Hub, ECR, etc.), making it reusable across development, staging, and production environments without rebuilding.

### 7) Full-Stack Parity with Chapter 10 Patterns

Chapter 20 mirrors Chapter 10's containerization approach, ensuring frontend and backend follow parallel deployment practices for consistency and operational familiarity.

## Next Steps

The frontend is now a portable, self-contained container — but it runs in isolation. In **Chapter 21: Connecting Frontend and Backend in Production**, we will:

- Connect the containerized frontend to the Spring Boot backend services
- Add an Nginx reverse proxy for load balancing and SSL termination
- Define a Docker Compose deployment orchestrating frontend, backend, and database
- Complete the full-stack Bookstore platform as a single reproducible deployment
