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
*   **Framework:** Node.js with Express.js (Deployed as a Firebase Cloud Function)
*   **Language:** JavaScript (CommonJS)
*   **Database:** Firebase Firestore (NoSQL)
*   **SDK:** `firebase-admin`
*   **Authentication:** JSON Web Tokens (JWT) using `jsonwebtoken` and `bcrypt` for password hashing.

## Key Files and Directories

*   `backend/`: Contains the Node.js Express server.
    *   `src/index.js`: Entry point. Wraps the Express app as a Cloud Function (`exports.api`).
    *   `src/db.js`: Initializes Firebase Admin SDK and Firestore.
    *   `src/routes/`: Express routers (`auth.js`, `availability.js`) that interact with Firestore.
    *   `src/middleware/auth.js`: JWT verification and role-based authorization middlewares.
*   `src/app/services/`: Angular services.
    *   `auth.service.ts`: Handles user registration, login, logout, and token management.
    *   `availability.service.ts`: Fetches calendar data and handles booking requests/status toggles.
*   `src/app/components/`: Angular components.
    *   `calendar/`: Renders the grid and handles click events.
    *   `admin-toggle/`: The authentication modal (login/register) and header display.

## How to Run the App Locally

Since the app now uses Firestore instead of PostgreSQL, Docker is no longer required. You have two options for local development:

### Option A: Connect to Live Firebase (Recommended)
You can run the backend locally but point it to your live Firebase project database.
1. Download a Service Account Key from your Firebase Console (Project Settings -> Service Accounts -> Generate new private key).
2. Save it locally (e.g., in the `backend/` folder as `serviceAccountKey.json`, make sure it's in `.gitignore`).
3. Set the environment variable before starting the backend:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
   cd backend
   npm start
   ```
4. Run the frontend in another terminal: `npm start`

### Option B: Use Firebase Emulators
To test completely offline without connecting to the cloud:
1. Run `firebase emulators:start` to spin up a local Firestore instance.
2. Ensure your backend code is configured to point to the local emulator.

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
