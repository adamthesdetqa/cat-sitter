# 🐱 Purrfect Cat Sitting — Availability Calendar

A website for your cat-sitting business. Customers visit to see which dates you're available and can register to request a booking. You manage everything yourself as an Admin—approving requests, marking dates as unavailable, or opening up new dates on your calendar.

Built with **Angular 19** on the frontend, and a **Node.js/Express** backend using **Firebase Firestore** for the database (wrapped in a Firebase Cloud Function).
---

## Table of contents

1. [How the website works](#how-the-website-works)
2. [How you manage availability (admin guide)](#how-you-manage-availability-admin-guide)
3. [First-time setup](#first-time-setup)
4. [Project structure](#project-structure)

---

## How the website works

### What customers see

When a customer visits your site they land on a single page with a monthly calendar. Dates that you've marked available are highlighted **green with a 🐾 paw print**. Dates with no marking are simply not available.

If a customer wants to book you, they click **"Sign in"** in the top right to register for an account or log in. Once logged in, they can click on any green "Available" date to request a booking. The date will turn yellow, indicating it is **Requested**.

### What you see as the cat sitter (Admin)

When you sign in with your Admin account, you have full control over the calendar:

- **Click an empty date** → it turns green and gets a 🐾, marking it available.
- **Click a green date** → it goes back to unmarked (unavailable).
- **Click a yellow "Requested" date** → it turns orange/brown, marking it as **Booked**.
- **Click a "Booked" date** → it returns to available.

---

## How you manage availability (admin guide)

### Signing in
1. Open the website.
2. Click **"Sign in"** in the top-right corner of the header.
3. Enter your Admin email and password.
4. The header will change to show a green **"Admin mode"** bar.

### Managing Dates
With admin mode on, simply click any future date on the calendar to cycle its status:
**Available -> Unavailable**
If a user has requested a date, you can click it to approve the booking:
**Requested -> Booked**

---

## First-time setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) package manager
- A [Firebase](https://firebase.google.com) account and project

### Get your Firebase Credentials

Because this project uses Firebase Firestore, your local Node.js server needs permission to access your Firebase project database.

1. Go to your [Firebase Console](https://console.firebase.google.com/) -> **Project Settings** (the gear icon) -> **Service Accounts**.
2. Click **"Generate new private key"**.
3. Save the downloaded `.json` file into the `backend/` folder and name it `serviceAccountKey.json`.
   *(You can view `backend/serviceAccountKey.example.json` to see what it should look like).*

### Running the Local Development Environment

You can run both the frontend and the backend simultaneously using our `dev` script:

```bash
pnpm install
cd backend && npm install && cd ..
pnpm run dev
```

- The **Frontend** will be available at [http://localhost:4200](http://localhost:4200) and automatically proxy API requests to the backend.
- The **Backend API** runs at `http://localhost:3000`.

### Admin Setup

By default, all users are given the `user` role. To grant admin privileges:
1. Register an account on your local frontend.
2. Log into the Firebase Console and go to your Firestore Database.
3. Find your user in the `users` collection and change the `role` field from `user` to `admin`.
4. Log out and log back in on the frontend to activate Admin mode.
---

## Project structure

* `backend/` - Node.js / Express Backend (Cloud Function)
  * `src/middleware/` - JWT Authentication middleware
  * `src/routes/` - API Routes (auth, availability)
  * `src/db.js` - Firebase Admin / Firestore initialization
  * `src/index.js` - Express App entry point / Firebase Cloud Function wrapper
* `src/` - Angular Frontend
  * `app/components/` - Calendar, AdminToggle
  * `app/services/` - AuthService, AvailabilityService
* `firebase.json` - Deployment configuration for Firebase Hosting and Functions
* `FIREBASE.md` - Context for agents and developers on the Firebase migration
