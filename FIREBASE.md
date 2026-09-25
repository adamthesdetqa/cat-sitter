# Firebase Architecture & Agent Context

This document explains the recent migration of the Cat Sitter App to the Firebase ecosystem. **This overrides previous documentation mentioning PostgreSQL or Sequelize.**

## What Changed?

1. **Database Migration (PostgreSQL -> Firestore)**
   - The application previously used PostgreSQL with the Sequelize ORM.
   - It now uses **Firebase Firestore** (a NoSQL database) via the `firebase-admin` SDK.
   - The `backend/src/models` directory (which contained Sequelize definitions) has been completely removed.
   - Database connections and initialization are now handled in `backend/src/db.js` using `admin.initializeApp()`.
   - The backend routes (`backend/src/routes/auth.js` and `backend/src/routes/availability.js`) now read and write directly to Firestore collections (`users` and `availability`).

2. **Backend Hosting (Node.js -> Firebase Cloud Functions)**
   - The Express application has been wrapped in a Firebase Cloud Function.
   - In `backend/src/index.js`, the Express app is exported as a Cloud Function: `exports.api = functions.https.onRequest(app)`.
   - `index.js` still contains a local development listener `if (require.main === module)` to allow running the backend locally via `node backend/src/index.js` without the full Firebase emulator suite.
   - The backend package now requires Node v20 (`engines` in `package.json`).

3. **Frontend Hosting (GitHub Pages -> Firebase Hosting)**
   - A `firebase.json` file now exists at the root of the project.
   - The Angular frontend builds to `dist/cat-sitter/browser`, which is deployed to Firebase Hosting.
   - The `firebase.json` configuration includes rewrite rules to forward all requests starting with `/api/**` to the Firebase Cloud Function (`api`), avoiding CORS issues and ensuring a single unified domain in production.

## Key Files for AI Agents to Know:
- `firebase.json`: The core Firebase configuration for deployment (Hosting and Functions).
- `backend/package.json`: Contains `firebase-admin` and `firebase-functions` dependencies.
- `backend/src/index.js`: The entry point for the Cloud Function wrapper.
- `backend/src/db.js`: The Firestore initialization.

## How to Deploy
1. Build the Angular app: `npm run build`
2. Deploy both the frontend and the cloud function: `npx firebase-tools deploy`
