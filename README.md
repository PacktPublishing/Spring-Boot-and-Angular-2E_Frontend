# Spring Boot and Angular 2E - Frontend

This repository contains the Angular frontend code for the "Spring Boot and Angular 2E" book published by Packt Publishing. The project demonstrates modern Angular development practices through a comprehensive bookstore application built progressively across multiple chapters, culminating in a production-style full-stack deployment.

## Project Overview

The Packt Bookstore is a modern web application showcasing Angular 21's latest features and best practices. The project is organized by chapters, with each chapter building upon the previous one to create a complete bookstore platform with authentication, book management, server-side rendering, real-time notifications, and final containerized deployment behind a single entry point.

## Architecture

This project follows modern Angular architectural patterns:

- **Standalone Components**: Utilizing Angular's standalone component architecture for better tree-shaking and modularity
- **Signal-Based Reactivity**: Leveraging Angular signals with `input()` and `output()` for component communication
- **Feature-Based Structure**: Organized by domain features (auth, books, etc.) with clear separation of concerns
- **Smart/Dumb Component Pattern**: Distinction between container components (pages) and presentation components
- **Reactive Forms**: Comprehensive form handling with validation and error management
- **Angular Material**: Consistent UI/UX with Material Design components
- **Modern Testing**: Unit testing with Vitest for improved performance and developer experience

## Chapter Structure

### Chapter 11 - Angular Frontend Foundation

**Location**: `chapter-11/`

Establishes the foundation of the Angular application:

- Modern Angular v21 setup with standalone components
- Basic project structure and folder organization
- Angular Material integration
- Book listing functionality with signal-based communication
- TypeScript interfaces and type safety
- Modern unit testing with Vitest

### Chapter 12 - AI-Assisted Angular Development

**Location**: `chapter-12/`

Builds upon Chapter 11 to demonstrate AI-powered development workflows:

- GitHub Copilot integration and project instructions
- AI-assisted mock data generation for book collections
- Chat modes for different development scenarios (inline, sidebar, agent)
- AI-enhanced unit testing and coverage improvement with Vitest
- Prompt engineering for effective AI collaboration
- AI-powered code refactoring and optimization techniques

### Chapter 14 - Reactive Forms & UI Components

**Location**: `chapter-14/`

Focuses on advanced reactive forms and UI component development:

- Reactive forms with comprehensive validation
- Form UI components and user experience patterns
- Advanced form patterns and error handling
- Form state management and user feedback
- Material Design form components integration

### Chapter 15 - Angular State Management with Signals and Stores

**Location**: `chapter-15/`

Advances to centralized state management with NgRx signal store:

- **NgRx Signal Store**: Centralized state management with signals for reactive, performant state updates
- **Event-Driven Architecture**: Type-safe event dispatching for state mutations with store events
- **Computed Signals**: Derived state for filtering, searching, and sorting book data
- **Store Effects**: Side effects management (API calls, async operations) with signal store effects
- **Form Integration**: Connecting reactive forms with store state for create and edit workflows
- **Unified Form Component**: Single component handling both create and edit modes based on route parameters
- **Book Service**: API integration layer for fetching and managing book data
- **Advanced Form Patterns**: Building on Chapter 14's reactive forms with state management integration
- **Comprehensive Testing**: Store testing, form component testing, and state mutation validation with Vitest

### Chapter 16 - HTTP Communication, Interceptors, Guards, and Profile Management

**Location**: `chapter-16/`

Extends the bookstore app with production-style authentication flow patterns:

- **Auth Signal Store**: Typed auth state with events, reducers, computed state, and side effects using NgRx Signal Store + NgRx Events
- **Route Guards**: `authGuard` protects private routes (`/books`, `/profile`); `guestGuard` prevents signed-in users from visiting `/auth/*`
- **HTTP Interceptor**: Bearer token injection with automatic 401 refresh-token retry strategy
- **API-Backed Auth Service**: `signin`, `signup`, `logout`, `refreshToken`, `getProfile`, and `updateProfile` calls via `HttpClient`
- **Token Persistence**: `TokenService` stores and retrieves tokens and user data from `localStorage` directly (app runs in CSR mode for this chapter)
- **Profile Feature**: Smart/dumb pair — profile page handles API orchestration; profile form is a reusable presentational component
- **Shared Utilities**: `normalizeApiErrorMessage` for consistent backend error text extraction; `custom-validators.ts` for reusable form validators
- **Comprehensive Unit Tests**: Co-located spec files covering guards, interceptors, services, store, all components and pages, layout, and utilities

### Chapter 17 - API-Driven Books and Authors with NgRx Signal Store

**Location**: `chapter-17/`

Extends the bookstore app by replacing mock book data with a fully API-driven books and authors feature:

- **BookStore**: Dedicated NgRx Signal Store for books with typed state (`books`, `totalElements`, `currentPage`, `searchTerm`, `genreFilter`, `loading`, `error`), page and API event groups, computed signals (`hasBooks`, `isSearching`, `bookCount`), and event handlers for paginated load, title search, create, update, and delete
- **AuthorStore**: Mirrors the BookStore pattern for authors — paginated load, name search, and full CRUD with the same event-driven architecture
- **BookService and AuthorService**: `HttpClient`-backed services for paginated, search, and CRUD endpoints
- **Author Management Dialog**: `AuthorListDialog` provides full author CRUD inline inside a Material dialog
- **Edit and Delete Wired End-to-End**: `BookList` emits typed `editBookEvent` and `deleteBookEvent` outputs; the `List` page dispatches `updateSubmitted` and `deleteConfirmed` to `BookStore`
- **Pre-Populated Edit Form**: `BookForm` patches `authorId` directly from `book.author.id` when opened in edit mode — no deferred effect needed
- **Comprehensive Unit Tests**: Spec files covering both stores, both services, all book and author components, and the list page

### Chapter 18 - Hybrid Rendering, Hydration, and Deferred Loading

**Location**: `chapter-18/`

Resolves the CSR-only workaround introduced in Chapter 16 by applying per-route rendering strategies:

- **Per-Route Render Modes**: Uses all three Angular rendering modes in one app: `RenderMode.Server` for `/books`, `RenderMode.Prerender` for `/privacy` and `/terms`, and `RenderMode.Client` for authenticated routes
- **Public Catalog Pattern**: Moves catalog access control from route-level blocking to component-level behavior, enabling public browsing while keeping management actions auth-aware
- **Legal Static Pages**: Adds Privacy and Terms pages as real footer destinations and pre-rendered static content
- **Hydration-Aware Storage**: Updates `TokenService` with `isPlatformBrowser` guards so server rendering never touches browser-only localStorage APIs
- **Deferred UI Loading**: Adds `@defer (on viewport)` for the book-list paginator to reduce initial bundle work and improve Core Web Vitals
- **Production Rendering Pipeline**: Combines SEO-friendly SSR, instant static pages, and interactive CSR where it fits best

### Chapter 19 - Real-Time Updates with Server-Sent Events

**Location**: `chapter-19/`

Extends the hybrid-rendered bookstore app with a lightweight real-time push channel using Server-Sent Events (SSE):

- **NotificationService**: Wraps the browser `EventSource` API in an RxJS `Observable`, connecting to `/inventory/api/notifications/stream` and emitting typed `BookNotification` values; uses `isPlatformBrowser` to prevent SSE usage during server rendering
- **Named Event Filtering**: Listens to both default (`onmessage`) and named (`NEW_BOOK`) SSE channels, forwarding only `NEW_BOOK` events to the application layer
- **Smart Page Integration**: The `List` page subscribes to `notificationService.connect()` in `ngOnInit`, displays a `MatSnackBar` toast on each incoming notification, and reloads the current page via existing `BookStore` events — no new store infrastructure required
- **Lifecycle Safety**: Uses `takeUntilDestroyed` with `DestroyRef` for automatic subscription cleanup
- **Self-Notification Suppression**: Tracks ISBNs of locally created books in a `Set<string>`; incoming SSE events for those ISBNs are silently ignored once to avoid duplicate toasts for the same user action
- **Existing Flows Preserved**: SSR, pre-rendering, CSR, auth, profile, CRUD, pagination, and interceptor flows from previous chapters remain unchanged

### Chapter 20 - Production Build and Docker Containerization

**Location**: `chapter-20/`

Packages and containerizes the Angular frontend for production deployment:

- **Production Build Pipeline**: Runs `ng build` for AOT compilation, tree-shaking, minification, and environment file swap, generating optimized artifacts organized into chunks, styles, and assets
- **Build Output Structure**: Organizes compiled code into route-based chunks, global CSS bundles, and static resources; compares structure to Spring Boot JAR packaging patterns from Chapter 10
- **Express Proxy Middleware**: Configures `server.ts` with proxy middleware to route SSR-initiated API calls to the backend gateway via the configurable `API_URL` environment variable
- **Multi-Stage Dockerfile**: Implements a multi-stage build process — Stage 1 builds the app; Stage 2 copies only runtime artifacts — adapting the Chapter 10 pattern to Node.js dependencies (`node_modules` vs. JAR bundling)
- **Docker Image Publishing**: Builds, tags, and publishes the container image to Docker Hub for portable deployment across environments
- **Environment-Driven Configuration**: Reads `API_URL` and `PORT` from process environment at startup, enabling the same image to target different backends without rebuilding

### Chapter 21 - Connecting Frontend and Backend in Production

**Location**: `chapter-21/`

Connects the containerized Angular frontend from Chapter 20 with the Spring Boot backend stack into a single production-style deployment:

- **Full-Stack Docker Compose Deployment**: Extends orchestration to include PostgreSQL, MongoDB, Keycloak, Zipkin, Eureka, Inventory Service, User Service, Gateway Server, Angular SSR, and Nginx
- **Nginx Edge Proxy**: Introduces Nginx as the single public entry point, routing browser requests to Angular SSR and API traffic to Spring Cloud Gateway
- **SSE Proxy Support**: Adds dedicated reverse proxy handling for Server-Sent Events so real-time notifications stream correctly through Nginx
- **Single-Command Startup**: Runs the complete Bookstore platform with one `docker compose up -d` command
- **Keycloak Realm Seeding**: Uses a helper realm import file to bootstrap roles, users, and client configuration automatically
- **Operational Helper Scripts**: Documents containerization helper files for clean rebuilds and local environment reset workflows

## Technology Stack

- **Angular 21**: Latest version with standalone components and signals
- **TypeScript**: Strict type checking and modern ES features
- **Angular Material**: Material Design components and theming
- **Reactive Forms**: Form building and validation
- **Angular Router**: Navigation and route protection
- **NgRx Signal Store + NgRx Events**: Reactive state management with event-driven architecture
- **RxJS**: Reactive programming and async workflows
- **SCSS**: Advanced styling with CSS preprocessor
- **Vitest**: Modern testing framework for faster unit test execution
- **GitHub Copilot**: AI-assisted development and code generation
- **Docker & Docker Compose**: Container build and orchestration across frontend, backend, and infrastructure services
- **Nginx**: Reverse proxy for browser traffic, API forwarding, and SSE streaming

## Getting Started

### Prerequisites

- Node.js (v24.2.0 or higher)
- npm (v11.4.2 or higher)
- Angular CLI v21.1.4

### Installation & Running

Each chapter is a complete Angular application. Navigate to the specific chapter directory:

```bash
# For Chapter 11 - Angular Foundation
cd chapter-11
npm install
npm run start

# For Chapter 12 - AI-Assisted Development
cd chapter-12
npm install
npm run start

# For Chapter 14 - Reactive Forms & UI
cd chapter-14
npm install
npm run start

# For Chapter 15 - State management with NgRx signal store
cd chapter-15
npm install
npm run start

# For Chapter 16 - HTTP Communication, Interceptors, Guards, and Profile Management
cd chapter-16
npm install
npm run start

# For Chapter 17 - API-Driven Books and Authors with NgRx Signal Store
cd chapter-17
npm install
npm run start

# For Chapter 18 - Hybrid Rendering, Hydration, and Deferred Loading
cd chapter-18
npm install
npm run start

# For Chapter 19 - Real-Time Updates with Server-Sent Events
cd chapter-19
npm install
npm run start

# For Chapter 20 - Production Build and Docker Containerization
cd chapter-20
npm install
npm run start

# For Chapter 21 - Connecting Frontend and Backend in Production
cd chapter-21
npm install
npm run start
```

The application will be available at `http://localhost:4200`

For the full Chapter 21 deployment, start the containerized platform with:

```bash
cd chapter-21
docker compose up -d
```

The complete stack is then available at `http://localhost`

### Build for Production

```bash
npm run build
```

### Running Tests

Across all chapters we are using vitest for modern testing:

```bash
cd chapter-XX
npm run test          # Interactive mode with file watching
npm run test:run      # Single run
npm run test:ui       # Web UI for test results
npm run test:coverage # Coverage report
```

## Project Structure

```text
src/
├── app/
│   ├── core/                 # Core services and utilities
│   │   └── services/
│   ├── features/             # Feature modules
│   │   ├── auth/             # Auth feature (Chapter 14+)
│   │   │   ├── components/   # Dumb components
│   │   │   ├── pages/        # Smart components (containers)
│   │   │   └── auth.routes.ts
│   │   └── books/            # Books management feature
│   │       ├── components/
│   │       ├── pages/
│   │       └── books.routes.ts
│   └── shared/               # Shared utilities
│       ├── layout/           # Layout components
│       └── models/           # TypeScript interfaces
```

## AI-Assisted Development

Chapter 12 focuses extensively on AI-assisted development workflows, including comprehensive GitHub Copilot integration to ensure consistent code generation and maintain architectural patterns:

### AI Development Techniques Covered in Chapter 12

- **Project Instructions**: Setting up context-aware AI assistance for Angular projects
- **Chat Modes**: Mastering inline, sidebar, and agent modes for different development tasks
- **Mock Data Generation**: AI-assisted creation of realistic book datasets
- **Test Coverage Enhancement**: Using AI to improve unit testing with Vitest
- **Prompt Engineering**: Crafting effective prompts for code generation and problem-solving
- **Code Refactoring**: AI-powered code improvements and optimization

### `.github/instructions/` Directory

Specialized instruction files for specific development areas:

- **`architecture.instructions.md`**: Component structure patterns, smart/dumb component guidelines, and folder organization rules
- **`form.instructions.md`**: Reactive forms patterns, validation strategies, and error handling approaches
- **`angular-material.instructions.md`**: Material Design component usage, theming, and UI consistency guidelines

### Why GitHub Copilot Instructions Are Essential

1. **Consistency**: Ensures all generated code follows the same architectural patterns and coding standards
2. **Context Awareness**: Provides Copilot with deep understanding of the project's specific requirements and constraints
3. **Best Practices**: Enforces Angular best practices and modern development patterns
4. **Productivity**: Reduces the need for manual corrections and refactoring of generated code
5. **Knowledge Transfer**: Documents architectural decisions and patterns for team members and future development

These instruction files act as a "style guide" for AI-assisted development, ensuring that generated code integrates seamlessly with the existing codebase while maintaining high quality and consistency.

## Key Features Demonstrated

- **Modern Angular Patterns**: Standalone components, signals, and reactive programming
- **Form Management**: Complex forms with validation, error handling, and user feedback
- **Reactive Form Patterns**: Advanced form UI components and user experience design
- **State Management**: Centralized state management with NgRx signal store and event-driven architecture
- **Computed Signals**: Derived state for filtering, searching, and sorting
- **Hybrid Rendering**: Per-route SSR, pre-rendering, and CSR strategies in a single Angular app
- **Hydration and Performance**: Browser guards for SSR-safe storage and deferred UI loading for improved startup metrics
- **Containerized Deployment**: Production-style Docker images and orchestration for frontend, backend, and supporting infrastructure
- **Reverse Proxy Architecture**: Single-entry Nginx routing for SSR, APIs, and SSE notifications
- **Material Design**: Consistent UI/UX with Angular Material components
- **Type Safety**: Comprehensive TypeScript usage with interfaces and strict typing
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Code Organization**: Scalable folder structure and separation of concerns

## Development Guidelines

- Follow the established folder structure (`features/shared` pattern)
- Use standalone components throughout the application
- Implement signal-based component communication with `input()` and `output()`
- Prefer reactive forms over template-driven forms
- Use Angular Material components consistently
- Maintain TypeScript interfaces for all data models
- Follow the smart/dumb component pattern

## Scripts

Each chapter includes these npm scripts:

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` or `npm run test` - Run unit tests with Vitest
- `npm run serve:ssr:chapter-X` - Serve server-side rendered application

Chapter 21 additionally includes:

- `docker compose up -d` - Start the complete containerized Bookstore platform
- `docker compose down` - Stop the full platform
- `./containerization/docker-clean-rebuild.sh` - Clean and rebuild the local Docker environment

## Learning Path

1. **Start with Chapter 11** to understand Angular fundamentals and project setup
2. **Progress to Chapter 12** to master AI-assisted development workflows and GitHub Copilot integration
3. **Continue to Chapter 14** to learn advanced reactive forms and UI component development
4. **Advance to Chapter 15** to master centralized state management with NgRx signal store and event-driven architecture
5. **Continue with Chapter 16** to integrate HTTP communication, route guards, an auth interceptor with refresh-token retry, and `localStorage`-based token persistence (CSR mode)
6. **Complete with Chapter 17** to build a fully API-driven books and authors feature with dedicated NgRx Signal Stores, full CRUD event flows, and end-to-end edit and delete wiring
7. **Advance to Chapter 18** to implement hybrid rendering with per-route SSR/Prerender/CSR, hydration-safe token storage, and deferred loading optimizations
8. **Complete with Chapter 19** to add real-time server-to-client push notifications using Server-Sent Events, including self-notification suppression and lifecycle-safe subscriptions
9. **Advance to Chapter 20** to build and containerize the Angular frontend for production, configure Express proxy middleware for backend communication, and publish the Docker image
10. **Finish with Chapter 21** to connect frontend and backend containers behind Nginx, add Docker Compose orchestration for the full stack, and run the entire platform through a single public entry point
11. **Explore the GitHub instructions** to understand AI-assisted development patterns
12. **Experiment with modifications** to reinforce learning concepts

## Contributing

This is an educational project accompanying the "Spring Boot and Angular 2E" book. While primarily for learning purposes, suggestions and improvements are welcome through issues and pull requests.

## License

This project is licensed under the terms specified in the LICENSE file.

## Related Resources

- [Spring Boot and Angular 2E Book](https://www.packtpub.com/)
- [Angular Documentation](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
