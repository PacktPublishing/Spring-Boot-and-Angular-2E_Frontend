# Chapter 10 - Angular Frontend Foundation

This project demonstrates the foundational concepts of Angular 20 by building the frontend for the Packt Bookstore application. The chapter covers Angular's core concepts, modern features, and best practices for creating maintainable and scalable applications.

## What You'll Learn

This chapter project showcases:

- **Angular Core Concepts**: Components, directives, template syntax, and data bindings
- **Modern Angular Features**: Standalone components and signals for simplified architecture and improved reactivity
- **Project Structure**: Recommended folder organization separating shared utilities, core services, and feature-specific logic
- **Component Architecture**: Creating both dumb (presentation) and smart (container) components using signal-based `input()` and `output()` functions
- **Type Safety**: Defining and using a shared Book interface for strongly-typed component inputs
- **UI Enhancement**: Integration with Angular Material for modern, accessible, and consistent user experience
- **GenAI-Assisted Development**: Using GitHub Copilot's "Ask", "Edit", and "Agent" modes for accelerated development

## Project Features

- Clean component communication with signal-based inputs and outputs
- Angular Material integration with themes and animations
- Material Design components: `mat-toolbar`, `mat-icon`, `mat-table`
- Structured folder organization for scalability
- Type-safe book listing functionality

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

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

## Project Structure

The application follows Angular best practices with a clear separation of concerns:

```text
src/app/
├── core/                    # Core services (authentication, etc.)
│   └── services/
├── features/               # Feature modules
│   └── books/             # Book-related components and routes
│       ├── components/    # Dumb/presentation components
│       └── pages/        # Smart/container components
└── shared/               # Shared utilities and components
    ├── layout/          # Layout components (header, footer)
    └── models/         # Shared interfaces and types
```

## Key Learning Points

- **Standalone Components**: Modern Angular approach eliminating the need for NgModules
- **Signals**: Reactive state management with improved change detection
- **Component Communication**: Using `input()` and `output()` for clean data flow
- **Material Design**: Professional UI with Angular Material components
- **Type Safety**: Leveraging TypeScript interfaces for better development experience
- **GenAI Integration**: Using GitHub Copilot for accelerated development workflows

## Next Steps

This foundation prepares you for:

- Advanced state management
- HTTP services and API integration
- Routing and navigation
- Forms and validation
- Testing strategies

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
