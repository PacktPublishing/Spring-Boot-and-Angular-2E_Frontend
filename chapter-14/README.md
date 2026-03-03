# Chapter 14 - Angular Reactive Forms

This project demonstrates advanced form handling in Angular using reactive forms to build comprehensive authentication and book management components for the Packt Bookstore application. Building upon the foundation from Chapter 12, this chapter introduces reactive forms, custom validators, dialog-based forms, and a complete auth feature module.

## What's New Compared to Chapter 12

### Auth Feature Module (New)

- **Sign-In Form**: Reactive form with email/password fields, "Remember Me" checkbox, and password visibility toggle
- **Sign-Up Form**: Multi-section reactive form with personal info, password confirmation (cross-field validation), optional address fields, and terms agreement
- **Auth Pages**: Smart/dumb component architecture — smart pages compose dumb form components and handle events
- **Auth Routes**: Lazy-loaded routes for `/auth/signin` and `/auth/signup`

### Book & Author Forms (New)

- **Book Form Dialog**: Material Dialog-based reactive form for creating and editing books, with fields for title, ISBN (pattern-validated), author, price, genre (select from 15 options), publish date (datepicker), description, page count, and cover image URL
- **Author Form Dialog**: Material Dialog-based reactive form for adding/editing authors with name and nationality fields
- **Edit Mode Support**: Both dialog forms support pre-filling via `MAT_DIALOG_DATA` injection for edit scenarios

### Custom Validators (New)

- **`noNumbersValidator()`**: Rejects values containing digits — used on name fields in signup
- **`passwordMatchValidator()`**: Cross-field validator ensuring password and confirm-password fields match within a nested `FormGroup`

### New Models

- **`SigninRequest`**, **`SignupRequest`**, **`UserProfile`**: Auth-related interfaces
- **`Author`**: Author model with `id`, `name`, and `nationality`
- **`Book` model updated**: Added optional `id` field

### Navigation & Layout Updates

- **Header**: Store title now links to `/books` via `routerLink`; added a sign-in icon button linking to `/auth/signin`
- **Book List Page**: Added "Add New Book" button that opens the `BookForm` dialog; supports opening in edit mode from the list

## What You'll Learn

This chapter project showcases:

- **Angular Reactive Forms**: Using `FormBuilder`, `FormGroup`, and `FormControl` for complex form management
- **Custom Validators**: Implementing `noNumbersValidator()` and cross-field `passwordMatchValidator()`
- **Nested Form Groups**: Organizing related controls (e.g., password/confirmPassword) into sub-groups with group-level validation
- **Signal-Based Reactivity**: Converting form `statusChanges` to signals via `toSignal()` for reactive submit-button state
- **Material Dialog Forms**: Opening form components in `MatDialog` with data injection for create/edit flows
- **Angular Material Forms**: Professional form UI with `MatFormField`, `MatInput`, `MatSelect`, `MatDatepicker`, `MatCheckbox`, and error messages
- **Smart/Dumb Component Pattern**: Pages (smart) compose form components (dumb) that emit typed events via `output()` signals
- **AI-Assisted Development**: Using GitHub Copilot's agent mode to establish and scale form patterns across the application

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
