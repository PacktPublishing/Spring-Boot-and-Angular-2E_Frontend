# Chapter 14 - Angular Reactive Forms

This project demonstrates advanced form handling in Angular 21 using reactive forms to build comprehensive authentication components for the Packt Bookstore application. The chapter covers reactive forms, complex validation patterns, and advanced form patterns for real-world applications.

## What You'll Learn

This chapter project showcases:

- **Angular Reactive Forms**: Using `FormBuilder`, `FormGroup`, `FormArray`, and `FormControl` for complex form management
- **Advanced Validation**: Custom validators, cross-field validation, and asynchronous validation patterns
- **Nested Form Groups**: Organizing complex forms with grouped controls for address and password fields
- **Dynamic Form Arrays**: Managing dynamic lists of user preferences (favorite genres)
- **Signal-Based Reactivity**: Converting form state to signals for reactive UI updates
- **Custom Validators**: Implementing business logic validators like age verification and password matching
- **Angular Material Forms**: Professional form UI with Material Design components and proper error handling
- **Form State Management**: Tracking form validity, touched state, and user interactions
- **AI-Assisted Development**: Using GitHub Copilot's agent mode to establish and scale form patterns

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

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

This chapter includes comprehensive unit tests for all form components using Vitest. To execute the test suite, use:

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
npm run test:run -- book-create.spec.ts
```
