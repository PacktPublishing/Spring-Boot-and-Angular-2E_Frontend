# Spring Boot and Angular 2E - Frontend

This repository contains the Angular frontend code for the "Spring Boot and Angular 2E" book published by Packt Publishing. The project demonstrates modern Angular development practices through a comprehensive bookstore application built progressively across multiple chapters.

## 📚 Project Overview

The Packt Bookstore is a modern web application showcasing Angular 20's latest features and best practices. The project is organized by chapters, with each chapter building upon the previous one to create a complete bookstore platform with authentication, book management, and user interactions.

## 🏗️ Architecture

This project follows modern Angular architectural patterns:

- **Standalone Components**: Utilizing Angular's standalone component architecture for better tree-shaking and modularity
- **Signal-Based Reactivity**: Leveraging Angular signals with `input()` and `output()` for component communication
- **Feature-Based Structure**: Organized by domain features (auth, books, etc.) with clear separation of concerns
- **Smart/Dumb Component Pattern**: Distinction between container components (pages) and presentation components
- **Reactive Forms**: Comprehensive form handling with validation and error management
- **Angular Material**: Consistent UI/UX with Material Design components
- **Modern Testing**: Unit testing with Vitest for improved performance and developer experience

## 📖 Chapter Structure

### Chapter 10 - Angular Frontend Foundation

**Location**: `chapter-10/`

Establishes the foundation of the Angular application:

- Modern Angular 20 setup with standalone components
- Basic project structure and folder organization
- Angular Material integration
- Book listing functionality with signal-based communication
- TypeScript interfaces and type safety
- Modern unit testing with Vitest

### Chapter 11 - Authentication & Reactive Forms

**Location**: `chapter-11/`

Builds upon Chapter 10 to add authentication capabilities:

- User authentication system (login/signup)
- Reactive forms with comprehensive validation
- Protected routes and guards
- User session management
- Advanced form patterns and error handling

## 🛠️ Technology Stack

- **Angular 20**: Latest version with standalone components and signals
- **TypeScript**: Strict type checking and modern ES features
- **Angular Material**: Material Design components and theming
- **Reactive Forms**: Form building and validation
- **Angular Router**: Navigation and route protection
- **RxJS**: Reactive programming and state management
- **SCSS**: Advanced styling with CSS preprocessor
- **Vitest**: Modern testing framework for faster unit test execution

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Angular CLI v20.0.3

### Installation & Running

Each chapter is a complete Angular application. Navigate to the specific chapter directory:

```bash
# For Chapter 10
cd chapter-10
npm install
npm start

# For Chapter 11
cd chapter-11
npm install
npm start
```

The application will be available at `http://localhost:4200`

### Build for Production

```bash
npm run build
```

### Running Tests

Testing varies by chapter:

```bash
# Chapter 10 - Uses Vitest for modern, fast testing
cd chapter-10
npm run test          # Interactive mode with file watching
npm run test:run      # Single run
npm run test:ui       # Web UI for test results
npm run test:coverage # Coverage report

# Chapter 11 - Traditional Angular testing (if applicable)
cd chapter-11
npm test
```

## 📁 Project Structure

```text
src/
├── app/
│   ├── core/                 # Core services and utilities
│   │   └── services/
│   ├── features/             # Feature modules
│   │   ├── auth/             # Authentication feature
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

## 🤖 AI-Assisted Development

This project includes comprehensive GitHub Copilot instructions to ensure consistent code generation and maintain architectural patterns:

### `.github/copilot-instructions.md`

The main instruction file that provides GitHub Copilot with context about:

- Project structure and architectural decisions
- Technology stack and frameworks used
- Code style preferences and patterns
- Component organization principles

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
- **Authentication Flow**: Complete user authentication with protected routes
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
- `npm test` or `npm run test` - Run unit tests (Vitest in Chapter 10, standard Angular testing in others)
- `npm run test:ui` - Run tests with web UI (Chapter 10 with Vitest)
- `npm run test:coverage` - Generate test coverage report (Chapter 10)
- `npm run serve:ssr:chapter-X` - Serve server-side rendered application

## Learning Path

1. **Start with Chapter 10** to understand Angular fundamentals and project setup
2. **Progress to Chapter 11** to learn authentication and advanced form handling
3. **Explore the GitHub instructions** to understand AI-assisted development patterns
4. **Experiment with modifications** to reinforce learning concepts

## Contributing

This is an educational project accompanying the "Spring Boot and Angular 2E" book. While primarily for learning purposes, suggestions and improvements are welcome through issues and pull requests.

## License

This project is licensed under the terms specified in the LICENSE file.

## Related Resources

- [Spring Boot and Angular 2E Book](https://www.packtpub.com/)
- [Angular Documentation](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
