# Spring Boot and Angular 2E - Frontend

This repository contains the Angular frontend code for the "Spring Boot and Angular 2E" book published by Packt Publishing. The project demonstrates modern Angular development practices through a comprehensive bookstore application built progressively across multiple chapters.

## Project Overview

The Packt Bookstore is a modern web application showcasing Angular 21's latest features and best practices. The project is organized by chapters, with each chapter building upon the previous one to create a complete bookstore platform with authentication, book management, and user interactions.

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
- **Advanced Form Patterns**: Building on Chapter 13's reactive forms with state management integration
- **Comprehensive Testing**: Store testing, form component testing, and state mutation validation with Vitest

## Technology Stack

- **Angular 21**: Latest version with standalone components and signals
- **TypeScript**: Strict type checking and modern ES features
- **Angular Material**: Material Design components and theming
- **Reactive Forms**: Form building and validation
- **Angular Router**: Navigation and route protection
- **RxJS**: Reactive programming and state management
- **SCSS**: Advanced styling with CSS preprocessor
- **Vitest**: Modern testing framework for faster unit test execution
- **GitHub Copilot**: AI-assisted development and code generation

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
```

The application will be available at `http://localhost:4200`

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
│   │   ├── auth/             # Form components (Chapter 13)
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

## Learning Path

1. **Start with Chapter 11** to understand Angular fundamentals and project setup
2. **Progress to Chapter 12** to master AI-assisted development workflows and GitHub Copilot integration
3. **Continue to Chapter 14** to learn advanced reactive forms and UI component development
4. **Advance to Chapter 15** to master centralized state management with NgRx signal store and event-driven architecture
5. **Explore the GitHub instructions** to understand AI-assisted development patterns
6. **Experiment with modifications** to reinforce learning concepts

## Contributing

This is an educational project accompanying the "Spring Boot and Angular 2E" book. While primarily for learning purposes, suggestions and improvements are welcome through issues and pull requests.

## License

This project is licensed under the terms specified in the LICENSE file.

## Related Resources

- [Spring Boot and Angular 2E Book](https://www.packtpub.com/)
- [Angular Documentation](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
