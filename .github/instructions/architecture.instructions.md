---
applyTo: "**"
---
# Architecture Principles

## Component Structure
Always follow these patterns when creating components:

### Smart Components (Pages)
- Located in `features/{domain}/pages/`
- Handle business logic and data flow
- Manage routing and navigation
- Import and compose dumb components
- Handle form submissions and API calls

### Dumb Components
- Located in `features/{domain}/components/`
- Pure presentation logic
- Receive data via input() signals
- Emit events via output() signals
- No direct API calls or business logic

## Folder Organization
src/
├── app/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── auth.routes.ts
│   │   └── books/
│   │       ├── components/
│   │       ├── pages/
│   │       └── books.routes.ts
│   └── shared/
│       ├── models/
│       ├── components/
│       └── services/

## File Naming
- Components: kebab-case (e.g., `login-form.ts`)
- Pages: kebab-case with page suffix (e.g., `login-page.ts`)
- Models: camelCase interfaces (e.g., `auth.ts`, `book.ts`)
- Routes: feature.routes.ts (e.g., `auth.routes.ts`)