# Chapter 19 - Real-Time Updates with Server-Sent Events

This chapter extends the hybrid-rendered bookstore app with real-time updates using Server-Sent Events (SSE).

Building on Chapter 18, we keep the existing SSR/hydration and API-driven Signal Store architecture, then add a lightweight push channel for live catalog updates:

- A dedicated `NotificationService` wraps the browser `EventSource` API in an RxJS `Observable`
- The service listens to both default SSE messages and named `NEW_BOOK` events
- Only `NEW_BOOK` notifications are forwarded to the UI through `eventType` filtering
- The books list page subscribes with `takeUntilDestroyed` for automatic cleanup
- On each incoming event, the page shows a `MatSnackBar` toast and reloads the current book page via existing `BookStore` events
- ISBN-based suppression prevents users from receiving duplicate notifications for books they just created locally

This chapter demonstrates a production-oriented pattern where unidirectional server-to-client push is enough: CRUD remains request-response, rendering remains hybrid for SEO/performance, and SSE delivers low-friction real-time updates.

## What You'll Learn

This chapter project showcases:

- How to integrate SSE in Angular using `EventSource` and RxJS
- How to consume both unnamed (`onmessage`) and named (`addEventListener`) SSE channels
- How to filter push payloads by `eventType` before emitting to the app layer
- How to wire real-time updates into a smart page without introducing new store infrastructure
- How to use `takeUntilDestroyed` for subscription lifecycle safety
- How to suppress self-notifications using a local ISBN tracking set
- Why SSE is a practical choice for one-way server push over standard HTTP infrastructure

## Project Features

### Real-Time Notifications (SSE)

- `NotificationService` (`features/books/services/notification.service.ts`):
  - Creates an `EventSource` connection to `/inventory/api/notifications/stream`
  - Parses incoming JSON payloads from both `onmessage` and `NEW_BOOK` listeners
  - Filters non-matching events (`eventType !== 'NEW_BOOK'`)
  - Emits typed `BookNotification` values (`shared/models/notification.ts`)
  - Closes the SSE connection when subscribers unsubscribe
  - Uses `isPlatformBrowser` to avoid EventSource usage during server rendering

### Books Page SSE Integration

- `List` page (`features/books/pages/list/list.ts`) now:
  - Subscribes to `notificationService.connect()` during `ngOnInit`
  - Uses `takeUntilDestroyed` with `DestroyRef` for cleanup
  - Displays a `MatSnackBar` when a new book notification arrives
  - Reloads the currently viewed page via `dispatch.loadBooks({ page, size })`
  - Reuses Chapter 17 store event pipelines rather than adding a new state layer

### Self-Notification Suppression

- The list page tracks ISBNs for locally created books in a `Set<string>`
- When the server later broadcasts the same ISBN, the notification is ignored once and removed from the set
- This prevents redundant "new book" toasts for the same user action

### Existing Hybrid Rendering and Auth Flows Preserved

- `/books` remains server-rendered (`RenderMode.Server`)
- `/privacy` and `/terms` remain pre-rendered (`RenderMode.Prerender`)
- `/auth/**` and `/profile` remain client-rendered (`RenderMode.Client`)
- Existing auth, profile, CRUD, pagination, and interceptor flows continue unchanged

## Why SSE Here?

For this chapter's requirements, SSE is a strong fit:

- Unidirectional push is sufficient (server to client)
- No specialized bidirectional socket infrastructure required
- Automatic browser reconnection behavior is built in
- Works well across standard HTTP proxies and gateways

Together with SSR and API CRUD, the app now demonstrates three complementary data/rendering patterns:

- Request-response for CRUD and auth
- Hybrid SSR/prerender/CSR for rendering strategy
- Real-time push notifications for live catalog updates

## Tech Stack

- Angular 21 (standalone APIs)
- Angular Material
- NgRx Signal Store plus NgRx Events
- RxJS + EventSource bridge for SSE
- Vitest-compatible Angular test runner setup

## Getting Started

### Prerequisites

- Node.js 20+
- Angular CLI 21.x

### Installation

```bash
npm install
```

### Development Server

```bash
npm run start
```

Open `http://localhost:4200/`.

### Build

```bash
npm run build
```

### SSR Serve (after build)

```bash
npm run serve:ssr:chapter-19
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
src/
├── environments/
│   ├── environment.ts                 # Dev environment config (API base URL)
│   └── environment.prod.ts            # Prod environment config
└── app/
    ├── app.config.ts                  # HTTP client + interceptor + hydration
    ├── app.routes.ts                  # Public catalog + auth/guest guarded route setup
    ├── app.routes.server.ts           # Per-route render mode config (SSR/Prerender/CSR)
    ├── app.spec.ts
    ├── core/
    │   ├── guards/
    │   ├── interceptors/
    │   └── services/
    ├── features/
    │   ├── auth/
    │   ├── books/
    │   │   ├── books.routes.ts
    │   │   ├── components/
    │   │   ├── pages/
    │   │   │   └── list/              # List page consumes SSE and reloads current page
    │   │   ├── services/
    │   │   │   ├── book.service.ts
    │   │   │   ├── author.service.ts
    │   │   │   └── notification.service.ts
    │   │   └── store/
    │   └── profile/
    ├── pages/
    │   ├── privacy/
    │   └── terms/
    └── shared/
        ├── layout/
        ├── models/
        │   └── notification.ts        # `BookNotification` SSE payload type
        ├── utils/
        └── validators/
```

## Key Implementation Highlights

### 1) EventSource Wrapped as Observable

The notification layer exposes SSE as a standard RxJS stream, making it easy to compose with Angular lifecycle utilities and existing store dispatch patterns.

### 2) Default + Named Event Handling

The service listens to both `onmessage` and named `NEW_BOOK` events so backend dispatch style does not leak complexity into the page component.

### 3) UI Reaction Without New State Infrastructure

Incoming events trigger `MatSnackBar` feedback and dispatch an existing `loadBooks` page event to refresh data. No extra reducer/state slice is required.

### 4) Self-Notification Suppression by ISBN

The UI records locally created ISBNs and drops the corresponding first matching SSE event, avoiding noisy duplicate notifications.

### 5) Full-Stack Pattern Composition

This chapter now combines SSR for discoverability and startup performance, classic HTTP for writes and reads, and SSE for low-latency visibility of remote changes.

## Next Steps

In Chapter 20, we will package and deploy the Angular frontend for production:

- Build optimized production artifacts
- Containerize the frontend with Docker
- Configure deployment alongside backend services
- Validate runtime configuration for production environments
