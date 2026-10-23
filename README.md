# Employee Management

A client-side employee-management dashboard built with **Angular 22**. It provides authentication, role-based access control, employee CRUD operations, searchable employee views, data visualisation, and a persistent light/dark theme.

> This is a front-end demonstration application. Employee records, accounts, and permissions are stored in the browser, so it must not be used as-is for production authentication or sensitive data.

## Features

- **Authentication and registration** — users can create an account and sign in. A session lasts for 10 minutes and is checked when the application starts.
- **Role-based access control** — the built-in administrator can manage each user's Add, Edit, and Delete permissions. New users have view-only access by default.
- **Employee CRUD** — authorised users can add, edit, and delete employee records. Deletion requires confirmation.
- **Employee table** — supports name/ID search, sortable ID and age columns, loading/error states, pagination, and selectable page sizes.
- **Employee directory** — presents a searchable master-detail view; selecting an employee updates the detail panel and URL.
- **Analytics** — department and age-distribution charts are generated from the current employee data.
- **Theme switching** — light and dark modes are saved between visits.
- **Help and About pages** — in-app guidance, screenshots, application notes, and feature documentation.

## Default administrator

The app creates this account automatically on first use:

| Username | Password |
| --- | --- |
| `admin` | `admin123` |

Use it to open **Access Management** and grant permissions to registered users.

## Technology

| Technology | Purpose |
| --- | --- |
| Angular 22 | Standalone component application framework |
| TypeScript | Typed application code and domain models |
| Angular Router | Page navigation, nested routes, and route protection |
| Angular Reactive Forms | Login, sign-up, and employee form validation |
| Angular signals | Local reactive state and derived UI state |
| RxJS | Mock asynchronous employee-page requests and lifecycle-safe subscriptions |
| ECharts + ngx-echarts | Interactive employee analytics charts |
| Browser `localStorage` / `sessionStorage` | Demo persistence for employees, accounts, theme, and session |

## Angular features implemented

### Standalone components and application configuration

Every UI feature is a standalone component that declares only the Angular directives and child components it needs. `app.config.ts` configures the router, `HttpClient`, ECharts, browser error listeners, and an application initializer. The initializer validates any existing session and loads employee data before the app is ready.

### Routing, nested routes, and guards

Routes are declared in `src/app/app.routes.ts`. The protected application shell (`EmployeeLayoutComponent`) contains the sidebar/header and a child `RouterOutlet`. The employee list has a second nested outlet for `/employees/list/:employeeId`, allowing an employee detail panel to be addressable by URL.

`authGuard` redirects unauthenticated visitors to login. `adminGuard` prevents non-admin users from visiting Access Management and redirects them to the employee table. This demonstrates functional guards with Angular's `inject()` API.

### Dependency injection and services

Services are registered with `providedIn: 'root'` and injected where needed:

- `EmployeeService` is the single source of truth for employee data and CRUD operations.
- `AuthService` manages accounts, the demo session, roles, and permissions.
- `MockEmployeeApiService` models an asynchronous server endpoint for table paging, searching, and sorting.
- `ThemeService` manages the active theme and updates the document root.

Keeping this work in services separates shared business logic from presentation components.

### Signals, computed state, and effects

`EmployeeService` stores employee data in a writable signal and exposes it read-only. Pages consume that signal directly, so employee-list, detail, and analytics views update when data changes. Components also use signals for table state such as the current page, loading state, sort order, and displayed rows.

`computed()` derives values such as chart options, table pagination metadata, and dark-mode status without manually synchronising duplicate state. `ThemeService` uses an `effect()` to apply the selected theme to the document whenever its signal changes.

### Reactive forms and validation

Login, sign-up, and employee editing use `ReactiveFormsModule` and `FormBuilder`. Validation covers required fields, username and password length, email format, password confirmation, valid employee values, and duplicate employee IDs. Invalid forms mark controls as touched so users receive useful feedback before submission.

### Modern template control flow and component communication

Templates use Angular's built-in `@if` and `@for` control-flow blocks for conditional UI and efficient list rendering with tracking. Reusable UI components accept data through signal-based `input()` APIs or `@Input`, and send user actions upward with outputs/events. Examples include the shared table, search input, checkbox, chart, modal, header, and theme-toggle components.

### HTTP, RxJS, and subscription cleanup

On the first run, `EmployeeService` loads seed employees from `src/assets/employees.json` with `HttpClient`. The table queries `MockEmployeeApiService`, which returns an RxJS `Observable` after a small delay to simulate server behavior. It performs filtering, sorting, validation of page bounds, and slicing before returning a page response. `takeUntilDestroyed()` ensures subscriptions are cleaned up when the corresponding component is destroyed.

### Persistent theme and demo data

Employee data, registered users, permissions, and the selected theme use `localStorage`, so they survive browser refreshes. The active login and timestamp use `sessionStorage`, which keeps the demonstration session scoped to the browser session. Clear site storage to reset the application to its seeded state.

## Project structure

```text
src/
├── app/
│   ├── components/       # Feature pages and reusable UI components
│   ├── guards/           # Authentication and admin route guards
│   ├── interfaces/       # TypeScript models for employees, forms, and tables
│   ├── services/         # Data, authentication, theme, and mock API services
│   ├── app.config.ts     # Application-wide providers and initialization
│   └── app.routes.ts     # Route tree
└── assets/
    ├── employees.json    # First-run employee seed data
    ├── icons.svg         # Reusable SVG icon symbols
    └── help/             # Help-page screenshots
```

## Run locally

### Prerequisites

- Node.js compatible with Angular 22
- npm (the project is configured for npm 11)

### Install and start

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The development server reloads after source changes.

### Available commands

```bash
npm start       # Start the local development server
npm run build   # Create an optimized production build in dist/
npm test        # Run unit tests with Vitest
```

## Data and security note

The local storage-based authentication and permission model is deliberately simple for a front-end project. A production version should replace it with a backend API, server-side authorization, securely stored password hashes, HTTPS, token/session protection, input validation on the server, and appropriate audit logging.
