# Chapter 17 - API-Driven Books and Authors with NgRx Signal Store

This chapter extends the bookstore app by replacing mock book data with a fully API-driven books and authors feature on Angular 22:

- Full CRUD operations for books and authors via HTTP API
- Paginated and searchable book and author lists
- Dedicated NgRx Signal Stores for books and authors with events, reducers, computed state, and side effects
- Author management dialog with create, edit, and delete support
- Book list wired to edit and delete store actions
- Book form pre-populated with existing data including author selection

It builds on the authentication, guards, interceptors, and profile management from the previous chapter while adding a production-style feature store pattern for domain data.

## What You'll Learn

This chapter project showcases:

- NgRx Signal Store for books and authors with events, reducers, computed state, and side effects
- Paginated API fetching with `page` and `size` parameters for both books and authors
- Search by title (books) and search by name (authors)
- Full CRUD event flows: `createSubmitted`, `updateSubmitted`, `deleteConfirmed` wired to API effects
- Smart/dumb component pattern: `List` page orchestrates store dispatches; `BookList`, `BookForm`, and `AuthorListDialog` are presentational
- Book form pre-populates all fields including author selection from `author.id` when opened in edit mode
- Author management via a dedicated `AuthorListDialog` with inline create, edit, and delete
- Auth Signal Store, guards, interceptors, and profile management carried forward from chapter 16

## Project Features

### Authentication and Authorization

- Auth Signal Store includes:
  - Typed auth state (`user`, `accessToken`, `refreshToken`, `loading`, `error`)
  - Page events (`signinSubmitted`, `signupSubmitted`, `logoutClicked`)
  - API events (signin/signup/logout/refresh success and failure)
  - Computed state (`isAuthenticated`, `currentUser`, `userDisplayName`)
- Route guards:
  - `authGuard` protects private routes (`/books`, `/profile`)
  - `guestGuard` prevents signed-in users from visiting `/auth/*`
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
- `BookList` component emits `editBookEvent` and `deleteBookEvent` outputs wired to the page
- `AuthorListDialog` provides full author CRUD in a Material dialog
- `BookForm` patches `authorId` directly from `book.author.id` when opened in edit mode

### SSR Compatibility

This chapter runs in **Client-Side Rendering (CSR) mode** — all routes use `RenderMode.Client` in `app.routes.server.ts`. As a result, `TokenService` accesses `localStorage` directly without platform guards. SSR-safe storage is a natural next step for a production hardening iteration.

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
npm run serve:ssr:chapter-17
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
| Services | `authentication.spec.ts`, `token.service.spec.ts`, `auth.service.spec.ts`, `book.service.spec.ts`, `author.service.spec.ts` |
| Signal Store | `auth.store.spec.ts`, `author.store.spec.ts` |
| Auth components | `signin-form.spec.ts`, `signup-form.spec.ts` |
| Auth pages | `signin.spec.ts`, `signup.spec.ts` |
| Books components | `book-form.spec.ts`, `book-list.spec.ts`, `author-form.spec.ts`, `author-list-dialog.spec.ts` |
| Books pages | `list.spec.ts` |
| Profile component | `profile-form.spec.ts` |
| Profile page | `profile.spec.ts` |
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
    ├── app.routes.ts                      # Route setup with auth and guest guards
    ├── app.routes.server.ts               # SSR prerender route config
    ├── app.spec.ts
    ├── core/
    │   ├── guards/
    │   │   ├── auth.guard.ts              # authGuard and guestGuard
    │   │   └── auth.guard.spec.ts
    │   ├── interceptors/
    │   │   ├── auth.interceptors.ts       # Bearer + refresh retry strategy
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

### 1) Signal Store + Event-Driven Auth State

The auth store coordinates page events, API events, token updates, and navigation side effects while exposing computed auth state for components.

### 2) Signal Store + Event-Driven Books and Authors

`BookStore` and `AuthorStore` follow the same event-driven pattern: page events trigger reducers that set loading state, event handlers perform API calls, and API events carry results back to reducers. Computed signals (`hasBooks`, `isSearching`, `bookCount`) derive from store state.

### 3) Interceptor-Based Refresh Flow

The interceptor retries unauthorized requests after successful refresh and synchronizes refreshed tokens back into store state.

### 4) Guarded Routing

The app separates public auth pages and private app pages via functional guards tied to reactive auth state.

### 5) SSR-Safe Storage Access

Token persistence logic is guarded with platform checks so server rendering does not attempt to touch browser-only APIs.

### 6) Profile Feature as Smart and Dumb Pair

The profile page handles API orchestration and notifications; the profile form remains a reusable presentational component.

### 7) Edit and Delete Wired End-to-End

`BookList` emits typed `editBookEvent` and `deleteBookEvent` outputs. The `List` page handles these by opening the `BookForm` dialog (pre-populated with `author.id`) or calling `confirmDelete`, both dispatching to `BookStore`.

## Next Steps

Potential enhancements for the next chapter or iteration:

- Introduce per-route rendering strategies (SSR/Prerender/CSR)
- Make the catalog publicly browseable while keeping management actions auth-aware
- Add Privacy and Terms pages as pre-rendered static routes
- Harden token persistence for SSR/hydration with platform guards
- Defer non-critical UI blocks (for example, paginator) to improve initial load performance
