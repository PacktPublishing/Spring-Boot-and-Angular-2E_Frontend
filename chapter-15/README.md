# Chapter 14 - Angular State Management with Signals and Stores

This project demonstrates state management in Angular 20 using signals and NgRx signal store to manage application state for the Packt Bookstore. Building on the reactive forms foundation from Chapter 13, this chapter adds state management for book data, complex form workflows for both creating and editing books, and centralized application state management.

## What You'll Learn

This chapter project showcases:

- **NgRx Signal Store**: Centralized state management with signals for reactive, performant state updates
- **State Architecture**: Organizing application state with clear separation of concerns
- **Store Events**: Event-driven architecture for state mutations with type-safe events
- **Computed Signals**: Derived state for filtering, searching, and sorting
- **Store Reducers**: Handling state changes based on events
- **Store Effects**: Side effects management (API calls, async operations) with signal store effects
- **Form Integration**: Connecting reactive forms with store state for create and edit workflows
- **Unified Form Component**: Single component handling both create and edit modes based on route parameters
- **Book Service**: API integration layer for fetching and managing book data
- **Signal-Based Reactivity**: Advanced reactive patterns with Angular signals throughout the store
- **State Persistence**: Managing and retrieving book data from the store
- **Advanced Form Patterns**: Building on Chapter 13's reactive forms with state management integration

## Project Features

- **NgRx Signal Store**: Centralized state management for all book-related data
  - Type-safe state with signals
  - Event-driven architecture for state mutations
  - Computed signals for derived state (filtered books, selected book, etc.)
- **Unified Book Form Component**: Multi-purpose form for creating and editing books
  - Create mode: Add new books to the store
  - Edit mode: Modify existing books with data pre-loaded from store
  - Route parameter detection for mode determination
  - Automatic form population in edit mode
  - Date handling between form and store
- **Book Service**: HTTP integration layer for API communication
  - Fetch books from backend
  - Create new books
  - Update existing books
  - Delete books
- **State Management Architecture**:
  - **BookState**: Central state model with books, filters, and UI state
  - **Book Events**: Type-safe event dispatching for all state mutations
  - **Store Methods**: Public API for business logic operations
  - **Computed State**: Derived signals for books list, filtered results, and selections
- **Advanced Form Features**:
  - Nested form groups for organized data structure
  - Required field validation with error messaging
  - ISBN validation (10 or 13 digit format)
  - Price validation with minimum value constraints
  - Published date handling with Material date picker
  - Form reset and state synchronization
- **Comprehensive Testing**:
  - Store testing with mocked events and state
  - Form component testing in both create and edit modes
  - State mutation testing with events
  - Computed signal testing

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## Getting Started

### Prerequisites

- Node.js (v24.2.0 or higher)
- Angular CLI v20.0.3
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
npm run test:run -- book-form.spec.ts
npm run test:run -- book.store.spec.ts
```

### Test Coverage

The project includes comprehensive unit tests with 70+ test cases covering:

- **Store State Management**: Initial state, state mutations, computed signals
- **Store Events**: Event dispatching and handling for CRUD operations
- **Store Reducers**: State changes based on events (load, add, update, delete)
- **Store Effects**: Async operations and side effects management
- **Form Component Initialization**: Form structure, controls, and initial state in both modes
- **Create Mode**: Form submission, data validation, store integration for new books
- **Edit Mode**: Loading book data, form population, update operations, navigation
- **Field Validation**: Required fields, format validation, length constraints
- **Form Submission**: Data handling, store updates, and navigation
- **Error Messages**: User-friendly validation feedback for all fields
- **Date Handling**: Converting between form Date objects and store string format
- **Signal Reactivity**: Form state signals and reactive updates
- **Computed State**: Filtering, searching, and derived state in the store

Key test files:

- `book.store.spec.ts` - Store testing (state mutations, computed signals, effects)
- `book-form.spec.ts` - Form component testing (both create and edit modes, 56 tests)

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

## Project Structure

The application follows Angular best practices with a clear separation of concerns, focusing on state management and book management:

```text
src/app/
├── core/                    # Core services (authentication, etc.)
│   └── services/
├── features/               # Feature modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Reusable auth components
│   │   │   ├── login/     # Login form component
│   │   │   └── signup/    # Complex signup form component
│   │   └── pages/         # Auth page containers
│   │       ├── login-page/
│   │       └── signup-page/
│   └── books/             # Book management feature
│       ├── components/    # Book-related components
│       │   ├── book-form/ # Unified form for create/edit books
│       │   └── book-list/ # Book listing component
│       ├── pages/        # Book page containers
│       │   └── list/
│       ├── services/     # Book API service
│       │   └── book.service.ts
│       └── store/        # State management
│           ├── book.store.ts      # Signal store
│           ├── book.state.ts      # State interface
│           ├── book.events.ts     # Event definitions
│           └── book.store.spec.ts # Store tests
└── shared/               # Shared utilities and components
    ├── layout/          # Layout components (header, footer)
    └── models/         # Shared interfaces and types (auth, book)
```

## Key Form Implementation Highlights

### Unified Book Form Component

The `book-form` component now serves dual purposes for creating and editing books:

```typescript
// Route parameter detection for mode determination
ngOnInit() {
  this.bookId = this.route.snapshot.paramMap.get('id');
  this.isEditMode = !!this.bookId;

  this.initializeForm();

  if (this.isEditMode && this.bookId) {
    this.loadBookData(this.bookId);
  }
}

// Loading book data from store in edit mode
private loadBookData(id: string) {
  const book = this.store.books().find(b => b.id === id);
  
  if (book) {
    this.bookForm.patchValue({
      title: book.title,
      authorName: book.authorName,
      // ... other fields
    });
  }
}

// Form submission handles both create and edit
onSubmit() {
  if (this.bookForm.invalid) return;

  const bookData = this.bookForm.value;

  if (this.isEditMode && this.bookId) {
    this.store.updateBook({ id: this.bookId, ...bookData });
  } else {
    this.store.addBook(bookData);
  }

  this.router.navigate(['/books']);
}
```

### State Management Architecture

The book store manages all book-related state with a clean, type-safe API:

```typescript
export const BookStore = signalStore(
  { providedIn: 'root' },

  // State initialization
  withState(initialBookState),

  // Reducers for state mutations
  withReducer(
    on(bookApiEvents.loadSuccess, (event) => ({
      books: event.payload.books,
      loading: false,
    })),
    on(bookApiEvents.addSuccess, (event) => (state) => ({
      ...state,
      books: [...state.books, event.payload.book],
    })),
    // ... more reducers
  ),

  // Computed signals for derived state
  withComputed((store) => ({
    filteredBooks: computed(() => {
      let books = store.books();
      
      // Apply filtering logic
      const searchTerm = store.searchTerm().toLowerCase();
      if (searchTerm) {
        books = books.filter(b => 
          b.title.toLowerCase().includes(searchTerm)
        );
      }

      return books;
    }),

    selectedBook: computed(() => {
      const id = store.selectedBookId();
      return store.books().find(b => b.id === id) ?? null;
    }),
  })),

  // Store methods as public API
  withMethods((store) => ({
    loadBooks: () => {
      // Dispatch event to trigger effects
    },
    addBook: (book: Omit<Book, 'id'>) => {
      // Dispatch event and effects handle API call
    },
    updateBook: (book: Book) => {
      // Dispatch event and effects handle API call
    },
  }))
);
```

### Form Validation

The form includes comprehensive validation patterns:

```typescript
bookForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(3)]],
  authorName: ['', [Validators.required, Validators.minLength(3)]],
  genre: ['', Validators.required],
  price: [null, [Validators.required, Validators.min(0)]],
  published: ['', Validators.required],
  isbn: ['', [Validators.required, Validators.minLength(10)]],
});
```

### Book Service Integration

The book service handles API communication:

```typescript
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/books');
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>('/api/books', book);
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`/api/books/${book.id}`, book);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`/api/books/${id}`);
  }
}
```

## Key Learning Points

- **Signal Store Architecture**: Understanding `signalStore`, `withState`, `withReducer`, `withComputed`, and `withMethods`
- **State Design Patterns**: Organizing application state with clear models and interfaces
- **Event-Driven Architecture**: Using events for state mutations and side effects
- **Computed Signals**: Creating derived state for efficient reactive updates
- **Effects Management**: Handling async operations (API calls) in store effects
- **Form-Store Integration**: Connecting reactive forms with centralized state
- **Dual-Mode Components**: Building versatile components for multiple use cases (create/edit)
- **Route Parameter Handling**: Using route parameters to determine component behavior
- **Data Transformation**: Converting between form and store formats (dates, etc.)
- **Service Layer Integration**: Connecting store with HTTP service for API communication
- **Type Safety**: Maintaining strong typing across store, events, and forms
- **Comprehensive Testing**: Unit testing stores, computed signals, and form integration

## Chapter Summary

This chapter provided comprehensive coverage of Angular state management using NgRx signal store and reactive patterns. Key accomplishments include:

- **Signal Store Fundamentals**: Implemented `signalStore` with state initialization, reducers, computed signals, and public methods
- **State Architecture**: Designed clean state models with clear separation between state, events, and business logic
- **Event-Driven State Mutations**: Created type-safe events for all state changes (load, add, update, delete)
- **Computed Signals**: Built derived state for filtering, searching, and selection with automatic reactivity
- **Effects Management**: Integrated async operations (API calls) with store effects for side effect handling
- **Unified Component Design**: Migrated from separate create/edit components to a single versatile form component
- **Form-Store Integration**: Connected reactive forms with centralized state for seamless data flow
- **Route Parameter Handling**: Implemented mode detection and data loading based on URL parameters
- **Type Safety**: Maintained strong typing across store, events, forms, and services
- **Book Service Layer**: Created HTTP service for API communication with proper error handling
- **Comprehensive Testing**: Developed 70+ unit tests covering store mutations, computed signals, form modes, and integration scenarios
- **Data Transformation**: Implemented proper conversion between form Date objects and store string formats
- **Business Logic Encapsulation**: Centralized book management logic in the store with clean public API

The comprehensive book store with unified form component demonstrates enterprise-level state management patterns with real-time reactivity, efficient computed signals, and proper separation of concerns that provide a scalable foundation for complex application features.

## Next Steps

Building on this state management and store patterns foundation, you're prepared for:

- **HTTP Interceptors**: Advanced HTTP configuration and request/response interceptors
- **Route Guards**: Protecting routes with auth guards and data loading guards
- **Form State Persistence**: Saving and restoring form state across navigation
- **Advanced Signals**: Signal effects and advanced reactivity patterns
- **Performance Optimization**: Change detection optimization and lazy loading strategies
- **Error Handling**: Comprehensive error handling across services and stores
- **Integration Testing**: End-to-end testing of complete workflows involving store, forms, and routing

In the next chapter, we will explore advanced concepts in HTTP communication, interceptors, and guard patterns to complete the comprehensive application architecture.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
