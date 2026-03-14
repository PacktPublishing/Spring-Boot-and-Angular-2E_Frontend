# Chapter 16 - HTTP Communication, Interceptors, Guards, and Profile Management

This chapter extends the bookstore app with production-style authentication flow patterns on Angular 21:

- API-driven authentication and profile endpoints
- Route protection with guards
- Centralized auth state with NgRx Signal Store
- HTTP interceptor-based bearer token attachment and refresh retry
- SSR-safe token persistence

It builds on the forms and component architecture from previous chapters while moving auth behavior closer to real backend integration.

## What You'll Learn

This chapter project showcases:

- NgRx Signal Store for auth state with events, reducers, computed state, and side effects
- Functional route guards for authenticated and guest-only routes
- Functional HTTP interceptor for auth header injection and 401 refresh token handling
- Token persistence with browser-safe local storage access in SSR contexts
- API-based signin, signup, logout, refresh token, and profile update flows
- Smart/dumb component structure for auth and profile pages
- Shared error parsing utility for consistent UI messaging
- Angular Material dialogs and forms for books and authors

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
- Shared utility `extractErrorMessage` standardizes backend error text extraction

### Books and Authors (Material Dialog Patterns)

- Book list page with create and edit dialog interactions
- Book form with validation for ISBN, URL, numeric constraints, required fields, and dates
- Author form with required and minimum length validation

### SSR Compatibility

- SSR route config uses prerender mode
- `TokenService` guards local storage access using platform checks
- Prevents server crashes from browser-only globals such as local storage on Node.js

## Tech Stack

- Angular 21 (standalone APIs)
- Angular Material
- NgRx Signal Store plus NgRx Events
- RxJS
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
npm run serve:ssr:chapter-16
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
src/app/
├── app.config.ts                      # HTTP client + interceptor + hydration
├── app.routes.ts                      # Route setup with auth and guest guards
├── app.routes.server.ts               # SSR prerender route config
├── core/
│   ├── guards/
│   │   └── auth.guard.ts              # authGuard and guestGuard
│   ├── interceptors/
│   │   └── auth.interceptors.ts       # Bearer + refresh retry strategy
│   └── services/
│       ├── authentication.ts          # Legacy helper kept for continuity
│       └── token.service.ts           # SSR-safe token persistence
├── features/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── components/
│   │   │   ├── signin-form/
│   │   │   └── signup-form/
│   │   ├── pages/
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── services/
│   │   │   └── auth.service.ts        # API integration for auth and profile
│   │   └── store/
│   │       ├── auth.state.ts
│   │       ├── auth.events.ts
│   │       └── auth.store.ts
│   ├── books/
│   │   ├── books.routes.ts
│   │   ├── components/
│   │   │   ├── author-form/
│   │   │   ├── book-form/
│   │   │   └── book-list/
│   │   └── pages/
│   │       └── list/
│   └── profile/
│       ├── components/
│       │   └── profile-form/
│       └── pages/
│           └── profile/
└── shared/
    ├── layout/
    │   ├── header/
    │   └── footer/
    ├── models/
    │   ├── auth.ts
    │   ├── author.ts
    │   └── book.ts
    ├── utils/
    │   └── error-message.ts
    └── validators/
        └── custom-validators.ts
```

## Key Implementation Highlights

### 1) Signal Store + Event-Driven Auth State

The store coordinates page events, API events, token updates, and navigation side effects while exposing computed auth state for components.

### 2) Interceptor-Based Refresh Flow

The interceptor retries unauthorized requests after successful refresh and synchronizes refreshed tokens back into store state.

### 3) Guarded Routing

The app separates public auth pages and private app pages via functional guards tied to reactive auth state.

### 4) SSR-Safe Storage Access

Token persistence logic is guarded with platform checks so server rendering does not attempt to touch browser-only APIs.

### 5) Profile Feature as Smart and Dumb Pair

The profile page handles API orchestration and notifications; the profile form remains a reusable presentational component.

## Next Steps

Potential enhancements for the next chapter or iteration:

- Move books from mock array to API-backed state and store
- Add refresh token expiry handling and forced re-auth UX
- Add end-to-end auth and profile workflow tests
- Introduce optimistic updates and cache strategies for profile and book data

For Angular CLI references, see https://angular.dev/tools/cli.
