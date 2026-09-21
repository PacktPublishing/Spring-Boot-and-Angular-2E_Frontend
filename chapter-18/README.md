# Chapter 18 - Hybrid Rendering, Hydration, and Deferred Loading

This chapter evolves the bookstore app from a CSR-only workaround into a hybrid-rendered Angular 22 application with per-route rendering strategies:

- Public book catalog rendered on the server for SEO and faster first content
- Static legal pages (`/privacy`, `/terms`) pre-rendered at build time
- Auth and profile routes kept client-rendered for interactive authenticated flows
- Authentication enforcement moved from route guard to component-level UI behavior in the catalog
- Hydration-aware browser guards in `TokenService` to prevent server-side localStorage errors
- Deferred paginator loading in the book list using `@defer` for better Core Web Vitals

It builds on the API-driven books/authors stores, interceptors, and profile management from Chapter 17 while introducing a production-style rendering pipeline.

## What You'll Learn

This chapter project showcases:

- Per-route rendering with `RenderMode.Server`, `RenderMode.Prerender`, and `RenderMode.Client`
- A public catalog strategy where browsing is open while management actions remain auth-aware in the UI
- Privacy and Terms pages as pre-rendered static routes linked from the footer
- Angular hydration behavior and why reusing server-rendered DOM improves startup work
- Browser-only storage protection using `isPlatformBrowser` in token persistence logic
- Deferred rendering of non-critical UI (`mat-paginator`) using `@defer (on viewport)`
- Continued NgRx Signal Store patterns for books, authors, and auth orchestration
- Continued API-driven CRUD and pagination flows from Chapter 17

## Project Features

### Authentication and Authorization

- Auth Signal Store includes:
  - Typed auth state (`user`, `accessToken`, `refreshToken`, `loading`, `error`)
  - Page events (`signinSubmitted`, `signupSubmitted`, `logoutClicked`)
  - API events (signin/signup/logout/refresh success and failure)
  - Computed state (`isAuthenticated`, `currentUser`, `userDisplayName`)
- Route guards:
  - `authGuard` protects private routes (`/profile`)
  - `guestGuard` prevents signed-in users from visiting `/auth/*`
- Public catalog access:
  - `/books` is accessible without `authGuard`
  - Edit/delete controls in the book list are shown only to authenticated users
- Token lifecycle:
  - Tokens and user data are persisted in local storage via `TokenService`
  - Store rehydrates state on startup from persisted token and user data

### HTTP and Backend Integration

- `AuthService` is API-based and uses `HttpClient` with environment URL:
  - `signin`
  - `signup`
  - `refreshToken`
  - `logout`
  - `getProfile`
  - `updateProfile`
- `authInterceptor` behavior:
  - Adds bearer token to protected requests
  - Skips auth endpoints (`signin`, `signup`, `refresh-token`)
  - On `401`, attempts refresh token flow
  - Retries failed request with new access token after refresh
  - Dispatches refresh failure event when refresh is unavailable or fails

### Profile Management

- Dedicated `/profile` page behind `authGuard`
- `Profile` page handles API load and update plus user notifications
- `ProfileForm` component handles presentation and form validation
- Shared utility `normalizeApiErrorMessage` standardizes backend error text extraction

### Books and Authors (API-Driven Signal Store)

- **BookStore** (`book.store.ts`) with:
  - Typed book state (`books`, `totalElements`, `totalPages`, `currentPage`, `pageSize`, `searchTerm`, `genreFilter`, `loading`, `error`)
  - Page events: `loadBooks`, `searchByTitle`, `createSubmitted`, `updateSubmitted`, `deleteConfirmed`
  - API events for load, search, create, update, and delete success and failure
  - Computed state: `hasBooks`, `isSearching`, `bookCount`
  - Event handlers using `switchMap` for load/search and `exhaustMap` for mutations
- **AuthorStore** (`author.store.ts`) with the same event-driven structure for authors
- `BookService` and `AuthorService` for paginated API integration
- `List` page dispatches store events for create, edit, and delete
- `BookList` component emits `editBookEvent`, `deleteBookEvent`, and page change events
- `AuthorListDialog` provides full author CRUD in a Material dialog
- `BookForm` patches `authorId` directly from `book.author.id` when opened in edit mode

### Rendering Strategies and Hydration

- `app.routes.server.ts` uses per-route rendering:
  - `/books` -> `RenderMode.Server`
  - `/privacy` and `/terms` -> `RenderMode.Prerender`
  - `/auth/**`, `/profile`, and fallback routes -> `RenderMode.Client`
- Angular hydration reuses server-rendered DOM during bootstrap instead of rebuilding it from scratch.
- `TokenService` now uses `isPlatformBrowser` checks so localStorage access only runs in browser contexts.
- The book list defers paginator rendering with `@defer (on viewport)` to reduce initial bundle work.

## Tech Stack

- Angular 22 (standalone APIs)
- Angular Material
- NgRx Signal Store plus NgRx Events
- RxJS
- Vitest-compatible Angular test runner setup

## Getting Started

### Prerequisites

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`
- Angular CLI 22.x

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
npm run serve:ssr:chapter-18
```

### SSR Data Verification

`/books` is server-rendered, so a healthy build can still ship a broken page if the
backend API is unreachable at render time — the server would happily render an empty
`<table>` and return `200 OK`. `scripts/verify-ssr.sh` guards against that by asserting
the server-rendered HTML contains a real book title, not just a `<table>` element.

Build with the **development** configuration for local verification. `environment.prod.ts`
sets `apiUrl` to the relative path `/packt`, which only resolves when the app is served
behind the Nginx gateway introduced in Chapter 21; Node's `fetch` during a local SSR
render has no host to resolve a relative URL against, so a production build's `/books`
page always server-renders an empty table on its own. `environment.ts` (the development
configuration) uses the absolute `http://localhost:8080/packt`, which Node can reach
directly against a locally running backend:

```bash
npm run build -- --configuration development
npm run serve:ssr:chapter-18 &
./scripts/verify-ssr.sh http://localhost:4000 "Clean Code"
```

The script fails if the `<table>` is missing entirely, and it separately fails if the
`<table>` is present but the expected title never appears (the empty-table-from-a-
dead-backend case). If your server binds to a host other than `localhost`, add it to the
`allowedHosts` array passed to `AngularNodeAppEngine` in `src/server.ts` — it rejects
requests for hosts it doesn't recognize as an SSRF safeguard.

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
| Services | `authentication.spec.ts`, `token.service.spec.ts`, `auth.service.spec.ts`, `book.service.spec.ts`, `author.service.spec.ts` |
| Signal Store | `auth.store.spec.ts`, `author.store.spec.ts` |
| Auth components | `signin-form.spec.ts`, `signup-form.spec.ts` |
| Auth pages | `signin.spec.ts`, `signup.spec.ts` |
| Books components | `book-form.spec.ts`, `book-list.spec.ts`, `author-form.spec.ts`, `author-list-dialog.spec.ts` |
| Books pages | `list.spec.ts` |
| Profile component | `profile-form.spec.ts` |
| Profile page | `profile.spec.ts` |
| Static legal pages | `privacy.spec.ts`, `terms.spec.ts` |
| Layout | `header.spec.ts`, `footer.spec.ts` |
| Utilities | `error.utils.spec.ts` |

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
    ├── app.config.ts                      # HTTP client + interceptor + hydration
    ├── app.routes.ts                      # Public catalog + auth/guest guarded route setup
    ├── app.routes.server.ts               # Per-route render mode config (SSR/Prerender/CSR)
    ├── app.spec.ts
    ├── core/
    │   ├── guards/
    │   │   ├── auth.guard.ts              # authGuard and guestGuard
    │   │   └── auth.guard.spec.ts
    │   ├── interceptors/
    │   │   ├── auth.interceptor.ts       # Bearer + refresh retry strategy
    │   │   └── auth.interceptor.spec.ts
    │   └── services/
    │       ├── authentication.ts          # Legacy helper kept for continuity
    │       ├── authentication.spec.ts
    │       ├── token.service.ts           # SSR-safe token persistence
    │       └── token.service.spec.ts
    ├── features/
    │   ├── auth/
    │   │   ├── auth.routes.ts
    │   │   ├── components/
    │   │   │   ├── signin-form/           # signin-form.ts + .html + .scss + .spec.ts
    │   │   │   └── signup-form/           # signup-form.ts + .html + .scss + .spec.ts
    │   │   ├── pages/
    │   │   │   ├── signin/                # signin.ts + .html + .scss + .spec.ts
    │   │   │   └── signup/                # signup.ts + .html + .scss + .spec.ts
    │   │   ├── services/
    │   │   │   ├── auth.service.ts        # API integration for auth and profile
    │   │   │   └── auth.service.spec.ts
    │   │   └── store/
    │   │       ├── auth.state.ts
    │   │       ├── auth.events.ts
    │   │       ├── auth.store.ts
    │   │       └── auth.store.spec.ts
    │   ├── books/
    │   │   ├── books.routes.ts
    │   │   ├── components/
    │   │   │   ├── author-form/           # author-form.ts + .html + .scss + .spec.ts
    │   │   │   ├── author-list-dialog/    # author-list-dialog.ts + .html + .scss + .spec.ts
    │   │   │   ├── book-form/             # book-form.ts + .html + .scss + .spec.ts
    │   │   │   └── book-list/             # book-list.ts + .html + .scss + .spec.ts
    │   │   ├── pages/
    │   │   │   └── list/                  # list.ts + .html + .scss + .spec.ts
    │   │   ├── services/
    │   │   │   ├── author.service.ts      # API integration for authors
    │   │   │   ├── author.service.spec.ts
    │   │   │   ├── book.service.ts        # API integration for books
    │   │   │   └── book.service.spec.ts
    │   │   └── store/
    │   │       ├── author-store/
    │   │       │   ├── author.state.ts
    │   │       │   ├── author.events.ts
    │   │       │   ├── author.store.ts
    │   │       │   └── author.store.spec.ts
    │   │       └── book-store/
    │   │           ├── book.state.ts
    │   │           ├── book.events.ts
    │   │           └── book.store.ts
    │   └── profile/
    │       ├── components/
    │       │   └── profile-form/          # profile-form.ts + .html + .scss + .spec.ts
    │       └── pages/
    │           └── profile/               # profile.ts + .html + .scss + .spec.ts
    ├── pages/
    │   ├── privacy/                       # privacy.ts + .spec.ts
    │   └── terms/                         # terms.ts + .spec.ts
    └── shared/
        ├── layout/
        │   ├── header/                    # header.ts + .html + .scss + .spec.ts
        │   └── footer/                    # footer.ts + .html + .scss + .spec.ts
        ├── models/
        │   ├── auth.ts
        │   ├── author.ts
        │   ├── book.ts
        │   └── paginated.ts
        ├── utils/
        │   ├── error-message.ts
        │   └── error.utils.spec.ts
        └── validators/
            └── custom-validators.ts
```

## Key Implementation Highlights

### 1) Per-Route Rendering Pipeline

The server route config uses all three Angular rendering modes in one app: SSR for the public catalog, pre-rendering for legal pages, and CSR for authenticated routes.

### 2) Public Browsing, Authenticated Management

Authentication enforcement for catalog browsing moved from route-level blocking to component-level behavior, a common production pattern where reading is public and write actions require login.

### 3) Real Footer Destinations with Prerendered Legal Pages

The new Privacy and Terms routes make footer navigation meaningful while also serving as examples of static pre-rendered content.

### 4) Hydration-Aware Bootstrapping

Angular hydration reuses server-rendered DOM nodes, reducing client bootstrap work and improving perceived startup performance.

### 5) SSR-Safe Token Storage Access

`TokenService` wraps localStorage reads and writes with `isPlatformBrowser` guards so server rendering never touches browser-only APIs.

### 6) Deferred Paginator for Better Initial Load

The book list paginator is loaded with `@defer (on viewport)`, reducing initial bundle pressure while preserving full pagination functionality.

### 7) API-Driven Books and Authors Still Intact

Books and authors continue to use Signal Store events/reducers/effects for API-backed CRUD, search, and pagination from the previous chapter.

## Next Steps

Potential enhancements for the next chapter or iteration:

- Add real-time catalog updates with Server-Sent Events (SSE)
- Push live inserts and price changes to connected clients without manual refresh
- Add resilient reconnection and transient network handling for event streams
- Preserve SSR and hydration performance while layering in live updates
