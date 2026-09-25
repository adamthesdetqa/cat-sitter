# AI Agent Guide for Cat Sitter App

Welcome! You are an AI agent working on the Cat Sitter App. This document provides crucial context about the application's architecture and the skills needed to work on it successfully.

## Architecture

This application consists of a decoupled frontend and backend:

### Frontend
*   **Framework:** Angular (v19)
*   **Language:** TypeScript
*   **Styling:** SCSS
*   **State Management:** Angular Signals (using `signal` and `computed` from `@angular/core`)
*   **HTTP Client:** `@angular/common/http`

### Backend
*   **Framework:** Node.js with Express.js
*   **Language:** JavaScript (CommonJS)
*   **Database:** PostgreSQL
*   **ORM:** Sequelize
*   **Authentication:** JSON Web Tokens (JWT) using `jsonwebtoken` and `bcrypt` for password hashing.

## Key Files and Directories

*   `backend/`: Contains the entire Node.js Express server.
    *   `src/index.js`: Entry point. Connects to DB and registers routes.
    *   `src/db.js`: Sequelize configuration.
    *   `src/models/`: Sequelize models (`User`, `Availability`).
    *   `src/routes/`: Express routers (`auth.js`, `availability.js`).
    *   `src/middleware/auth.js`: JWT verification and role-based authorization middlewares.
*   `src/app/services/`: Angular services.
    *   `auth.service.ts`: Handles user registration, login, logout, and token management.
    *   `availability.service.ts`: Fetches calendar data and handles booking requests/status toggles.
*   `src/app/components/`: Angular components.
    *   `calendar/`: Renders the grid and handles click events.
    *   `admin-toggle/`: The authentication modal (login/register) and header display.

## How to Run the App

You will need to run the frontend and backend in separate terminal sessions or processes.

### 1. Start the Backend
`cd backend`
`npm install`
`node src/index.js`
*Note: The backend expects a PostgreSQL database named `catsitter` to be running. It uses the `DATABASE_URL` environment variable (defaults to `postgres://postgres:postgres@localhost:5432/catsitter`).*

### 2. Start the Frontend
`npm install`
`ng serve`

## Relevant AI Skills

When working on this project, you will frequently need to utilize the following skills:

*   **Angular (v19):** Understanding Standalone components, the new Control Flow syntax (e.g., `@if`, `@for`), and Signals for reactivity.
*   **Node.js / Express:** Building RESTful APIs and middleware.
*   **Sequelize (ORM):** Defining models, relationships, and querying PostgreSQL databases.
*   **JWT Authentication:** Understanding how tokens are generated on the server, passed via HTTP headers, and verified.
*   **CSS / SCSS:** Modifying styles, understanding specificity, and responsive design.

## Important Notes

*   **Database Migrations:** Currently, the backend uses `sequelize.sync({ alter: true })` in development. Do not use this in production.
*   **Admin Access:** To test admin functionality, create a user via the UI, then manually update their role to `'admin'` directly in the PostgreSQL database.
