# Chapter 15 - Angular State Management with Signals and Stores

This chapter demonstrates state management in Angular 21 using signals and NgRx Signal Store to manage authentication state for the Packt Bookstore. Building on the reactive forms foundation from Chapter 14, this chapter adds centralized auth state management with event-driven architecture, dialog-based book and author forms, and advanced form patterns with custom validators.

## What You'll Learn

This chapter project showcases:

- **NgRx Signal Store**: Centralized authentication state management with signals for reactive, performant state updates
- **State Architecture**: Organizing application state with clear separation of concerns (state, events, reducers, effects)
- **Store Events**: Event-driven architecture (`eventGroup`) for type-safe state mutations
- **Computed Signals**: Derived state such as `isAuthenticated` and `userDisplayName`
- **Store Reducers**: Handling state changes for signin, signup, and logout flows
- **Store Effects**: Side effects management (API calls, navigation) with `withEventHandlers`
- **Form-Store Integration**: Connecting reactive forms with auth store for signin and signup workflows
- **Dialog-Based Forms**: Book and author forms rendered inside Angular Material dialogs
- **Custom Validators**: Reusable validators (`noNumbersValidator`, `passwordMatchValidator`)
- **Mock Auth Service**: Simulated authentication service for development and testing
- **Signal-Based Reactivity**: `toSignal` for form validity tracking and reactive UI updates
- **Angular Material UI**: Comprehensive use of Material components (cards, toolbars, dialogs, tables, spinners)

## Project Features

- **NgRx Signal Store (Auth)**:
  - Type-safe `AuthState` with user, tokens, loading, and error signals
  - Event groups for page actions (`signinSubmitted`, `signupSubmitted`, `logoutClicked`) and API responses (`signinSuccess`, `signinFailure`, `signupSuccess`, `signupFailure`)
  - Computed signals: `isAuthenticated`, `currentUser`, `userDisplayName`
  - Effects for async signin/signup API calls and post-success navigation
- **Authentication Pages**:
  - Signin page with Material card layout, error display, and loading spinner
  - Signup page with Material card layout, error display, and loading spinner
  - Smart/dumb component pattern: pages dispatch store events, forms handle presentation
- **Dialog-Based Book Form**: Create and edit books via Material dialog
  - Mode determined by `MAT_DIALOG_DATA` injection
  - ISBN regex validation, URL pattern validation, date picker
  - Genre selection from predefined list
- **Dialog-Based Author Form**: Create and edit authors via Material dialog
  - Name and nationality fields with validation
- **Book List Page**: Displays books in a Material table with edit/delete actions
  - Opens BookForm dialog for create and edit operations
  - Uses mock data array (no book store yet)
- **Custom Validators**:
  - `noNumbersValidator()` — prevents digits in name fields
  - `passwordMatchValidator()` — cross-field validation for password confirmation
- **Comprehensive Testing**:
  - Auth store testing (state mutations, computed signals, effects)
  - Signin/signup form and page component tests
  - Book form, book list, and author form component tests
  - Layout component tests (header, footer)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Getting Started

### Prerequisites

- Node.js (v24.2.0 or higher)
- Angular CLI v21.1.4
- VS Code with Angular Language Service extension (recommended)

### Installation

1. Install dependencies:

```bash
npm install
```

1. Install Angular Material (if not already installed):

```bash
ng add @angular/material
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

This chapter includes comprehensive unit tests for all store and form components using Vitest. To execute the test suite, use:

```bash
npm test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

To run tests with coverage reporting:

```bash
npm run test:run
```

To run specific test files:

```bash
npm run test:run -- auth.store.spec.ts
npm run test:run -- book-form.spec.ts
npm run test:run -- signin-form.spec.ts
```

### Test Coverage

The project includes comprehensive unit tests covering:

- **Auth Store**: Initial state, reducers for signin/signup/logout, computed signals (`isAuthenticated`, `userDisplayName`), effects for API calls and navigation
- **Signin Form**: Form structure, validation (email, password), error messages, form submission
- **Signup Form**: Multi-section form, custom validators (`noNumbers`, `passwordMatch`), field validation, signal-based validity
- **Signin/Signup Pages**: Store integration, event dispatching, error/loading display
- **Book Form**: Dialog-based create/edit modes, ISBN pattern validation, URL validation, genre selection, date picker
- **Book List**: Input binding, table rendering, edit/delete action emission
- **Author Form**: Dialog-based create/edit, name/nationality validation
- **Layout Components**: Header (auth state display, logout), footer (static rendering)

Key test files:

- `auth.store.spec.ts` — Auth store testing (state mutations, computed signals, effects)
- `signin-form.spec.ts` — Signin form validation and submission
- `signup-form.spec.ts` — Signup form with custom validators
- `signin.spec.ts` / `signup.spec.ts` — Page component integration with store
- `book-form.spec.ts` — Dialog-based book form in create and edit modes
- `book-list.spec.ts` — Book list table rendering and actions
- `author-form.spec.ts` — Author form validation

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

## Project Structure

The application follows Angular best practices with a clear separation of concerns, focusing on auth state management and book catalog display:

```text
src/app/
├── core/                         # Core services
│   └── services/
│       └── authentication.ts     # Core authentication service
├── features/                     # Feature modules
│   ├── auth/                     # Authentication feature
│   │   ├── auth.routes.ts        # Auth routing (lazy-loaded)
│   │   ├── services/
│   │   │   └── auth.service.ts   # Mock auth service (signin/signup)
│   │   ├── store/
│   │   │   ├── auth.state.ts     # AuthState interface & initial state
│   │   │   ├── auth.events.ts    # Event groups (page & API events)
│   │   │   ├── auth.store.ts     # Signal store (reducers, computed, effects)
│   │   │   └── auth.store.spec.ts
│   │   ├── components/
│   │   │   ├── signin-form/      # Dumb: email/password form
│   │   │   └── signup-form/      # Dumb: multi-section signup form
│   │   └── pages/
│   │       ├── signin/           # Smart: dispatches signinSubmitted
│   │       └── signup/           # Smart: dispatches signupSubmitted
│   └── books/                    # Book management feature
│       ├── books.routes.ts       # Book routing (lazy-loaded)
│       ├── components/
│       │   ├── book-form/        # Dialog: create/edit book
│       │   ├── book-list/        # Dumb: table display with actions
│       │   └── author-form/      # Dialog: create/edit author
│       └── pages/
│           └── list/             # Smart: mock data, opens dialogs
└── shared/
    ├── layout/
    │   ├── header/               # Material toolbar with auth state
    │   └── footer/               # Static footer
    ├── models/
    │   ├── auth.ts               # SigninRequest, SignupRequest, UserInfo, etc.
    │   ├── book.ts               # Book interface
    │   └── author.ts             # Author interface
    └── validators/
        └── custom-validators.ts  # noNumbersValidator, passwordMatchValidator
```

## Key Implementation Highlights

### Auth Signal Store

The `AuthStore` manages all authentication state using NgRx Signal Store with event-driven architecture:

```typescript
export const AuthStore = signalStore(
  { providedIn: 'root' },

  // Initialize state
  withState(initialAuthState),

  // Reducers handle state changes
  withReducer(
    on(authPageEvents.signinSubmitted, () => ({
      loading: true,
      error: null,
    })),

    on(authApiEvents.signinSuccess, (event) => ({
      user: event.payload.user,
      accessToken: event.payload.accessToken,
      refreshToken: event.payload.refreshToken,
      loading: false,
      error: null,
    })),

    on(authApiEvents.signinFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    on(authPageEvents.logoutClicked, () => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
    })),
  ),

  // Computed signals for derived state
  withComputed((store) => ({
    isAuthenticated: computed(() => store.accessToken() !== null),
    currentUser: computed(() => store.user()),
    userDisplayName: computed(() => {
      const user = store.user();
      return user ? `${user.firstName} ${user.lastName}` : '';
    }),
  })),

  // Effects handle async operations
  withEventHandlers((store, events, authService, router) => ({
    signin$: events.on(authPageEvents.signinSubmitted).pipe(
      exhaustMap((event) =>
        authService.signin(event.payload).pipe(
          map((response) => authApiEvents.signinSuccess(response)),
          catchError((error) =>
            of(authApiEvents.signinFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  })),

  // Methods for navigation side effects
  withMethods((store, events, router) => {
    events.on(authApiEvents.signinSuccess).subscribe(() => router.navigate(['/books']));
    events.on(authApiEvents.signupSuccess).subscribe(() => router.navigate(['/auth/signin']));
    return {};
  }),
);
```

### Event Groups

Type-safe events split into page actions and API responses:

```typescript
export const authPageEvents = eventGroup({
  source: 'Auth Page',
  events: {
    signinSubmitted: type<SigninRequest>(),
    signupSubmitted: type<SignupRequest>(),
    logoutClicked: type<void>(),
  },
});

export const authApiEvents = eventGroup({
  source: 'Auth API',
  events: {
    signinSuccess: type<{ user: UserInfo; accessToken: string; refreshToken: string }>(),
    signinFailure: type<{ error: string }>(),
    signupSuccess: type<void>(),
    signupFailure: type<{ error: string }>(),
  },
});
```

### Dialog-Based Book Form

The `BookForm` component is rendered inside a Material dialog, with create/edit mode determined by injected data:

```typescript
export class BookForm {
  private dialogRef = inject(MatDialogRef<BookForm>);
  private data: BookDialogData | null = inject(MAT_DIALOG_DATA, { optional: true }) ?? null;

  bookForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(ISBN_PATTERN)]],
    authorName: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    genre: ['', [Validators.required]],
    published: this.fb.control<Date | null>(null, [Validators.required]),
    description: [''],
    pageCount: this.fb.control<number | null>(null, [Validators.min(1)]),
    coverImageUrl: ['', [Validators.pattern(URL_PATTERN)]],
  });

  get isEditMode(): boolean {
    return this.data !== null;
  }
}
```

### Custom Validators

Reusable validators for form fields:

```typescript
export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) return null;
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { noNumbers: { value: control.value } } : null;
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
```

### Mock Auth Service

Simulated authentication for development:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  signin(credentials: SigninRequest): Observable<{ user: UserInfo; accessToken: string; refreshToken: string }> {
    if (credentials.email === 'user@bookstore.com' && credentials.password === 'SecurePass123!') {
      return of({ user: this.mockUser, accessToken: '...', refreshToken: '...' }).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid email or password'));
  }

  signup(data: SignupRequest): Observable<void> {
    if (data.email === 'user@bookstore.com') {
      return throwError(() => new Error('Email already exists'));
    }
    return of(void 0).pipe(delay(500));
  }
}
```

## Key Learning Points

- **Signal Store Architecture**: Understanding `signalStore`, `withState`, `withReducer`, `withComputed`, `withMethods`, and `withEventHandlers`
- **Event-Driven Architecture**: Using `eventGroup` to define type-safe page and API events
- **Computed Signals**: Creating derived state (`isAuthenticated`, `userDisplayName`) for efficient reactive updates
- **Effects Management**: Handling async operations (signin/signup API calls) and navigation side effects
- **Form-Store Integration**: Smart components dispatch store events, dumb form components emit outputs
- **Dialog Components**: Using `MAT_DIALOG_DATA` and `MatDialogRef` for dialog-based create/edit forms
- **Custom Validators**: Building reusable `ValidatorFn` functions for cross-field and pattern validation
- **Mock Services**: Simulating backend APIs with `Observable` streams and artificial delays
- **Signal-Based Form Tracking**: Using `toSignal` with `statusChanges` for reactive form validity
- **Material Design**: Leveraging Angular Material cards, toolbars, dialogs, tables, spinners, and form fields
- **Type Safety**: Maintaining strong typing across store state, events, forms, and services
- **Comprehensive Testing**: Unit testing stores, forms, dialogs, and page components

## Chapter Summary

This chapter provided comprehensive coverage of Angular state management using NgRx Signal Store and reactive patterns. Key accomplishments include:

- **Auth Signal Store**: Implemented `signalStore` with `withState`, `withReducer`, `withComputed`, `withEventHandlers`, and `withMethods` for complete auth state management
- **Event-Driven State Mutations**: Created type-safe event groups for page actions (`signinSubmitted`, `signupSubmitted`, `logoutClicked`) and API responses (`signinSuccess`, `signinFailure`, etc.)
- **Computed Signals**: Built derived signals (`isAuthenticated`, `currentUser`, `userDisplayName`) with automatic reactivity
- **Effects Management**: Integrated async signin/signup API calls with `exhaustMap` and navigation side effects
- **Smart/Dumb Component Pattern**: Signin and signup pages dispatch store events while form components handle pure presentation
- **Material Card Layout**: Auth pages use `mat-card` with header, content (error display + form + spinner), and actions (navigation links)
- **Dialog-Based Book Form**: Created `BookForm` as a Material dialog with create/edit mode detection via `MAT_DIALOG_DATA`
- **Dialog-Based Author Form**: Created `AuthorForm` dialog for managing author data
- **Custom Validators**: Implemented `noNumbersValidator` and `passwordMatchValidator` as reusable `ValidatorFn` functions
- **Mock Auth Service**: Built a simulated authentication service with hardcoded credentials and artificial delays
- **Book List Page**: Displayed books in a Material table with dialog-based create/edit actions using mock data
- **Comprehensive Testing**: Developed unit tests across auth store, form components, page components, dialog forms, and layout components

The auth store with event-driven architecture demonstrates enterprise-level state management patterns with clear separation between state, events, reducers, effects, and computed signals.

## Next Steps

Building on this state management and store patterns foundation, you're prepared for:

- **Book Signal Store**: Extending the store pattern to manage book data with API integration
- **HTTP Interceptors**: Advanced HTTP configuration and request/response interceptors
- **Route Guards**: Protecting routes with auth guards using `isAuthenticated` from the store
- **Real Backend Integration**: Replacing the mock auth service with actual HTTP calls
- **Error Handling**: Comprehensive error handling across services and stores
- **Performance Optimization**: Change detection optimization and lazy loading strategies
- **Integration Testing**: End-to-end testing of complete workflows involving store, forms, and routing

In the next chapter, we will explore advanced concepts in HTTP communication, interceptors, and guard patterns to complete the comprehensive application architecture.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
