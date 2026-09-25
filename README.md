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
- A [Firebase](https://firebase.google.com) account and project

### Running the Local Development Environment

We can run the Angular frontend and Node.js backend locally. Since we are using Firestore, you will need to either set up a Firebase project and authenticate locally, or use the Firebase Emulators.

1. **Start the backend server**
   Open a terminal and start the Express server (which connects to your Firebase project):
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start the frontend**
   Open a second terminal and serve the Angular app:
   ```bash
   npm install
   npm run start
   ```
   The frontend is available at [http://localhost:4200](http://localhost:4200). It will proxy API requests to `http://localhost:3000`.

3. **Admin Setup**
   By default, all users are given the `user` role. To grant admin privileges, log into the Firebase Console, go to your Firestore Database, find your user in the `users` collection, and change the `role` field from `user` to `admin`.

*(For more backend details, refer to `BACKEND.md` and `FIREBASE.md`)*

---

## Deploying to Firebase

Firebase hosts the frontend (Hosting), backend API (Cloud Functions), and database (Firestore) all in one place.

### First deployment

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Link your Firebase Project**
   Create a new project in the [Firebase Console](https://console.firebase.google.com/), enable **Firestore**, **Hosting**, and **Functions**, then run:
   ```bash
   firebase use --add
   ```

3. **Deploy everything**
   Build the Angular app and deploy both the frontend and the cloud functions:
   ```bash
   npm run build
   firebase deploy
   ```

Your site will be live at your Firebase project's `.web.app` or `.firebaseapp.com` domain.

### Subsequent deployments

Any time you make changes to the code:
```bash
npm run build
firebase deploy
```

---

## Making changes to the site

### Changing the site name / tagline / footer

Open `src/app/app.component.html`. Near the top you'll find:

```html
<h1 class="header__title">Purrfect Cat Sitting</h1>
<p class="header__tagline">Your cats are safe with me</p>
```

And at the bottom:

```html
<p>Have questions? Get in touch to book a date.</p>
```

Edit these freely. After saving, run `npm run deploy` to publish the change.

### Changing colours

The colour palette is defined in the component SCSS files. The main colours used throughout are:

| Colour | Hex | Used for |
|--------|-----|----------|
| Deep teal | `#2C4A43` | Headings, text |
| Sage green | `#4A7C6F` | Buttons, accents |
| Mint | `#C8E6C0` | Available dates background |
| Warm cream | `#F7F4EF` | Page background |
| Terracotta | `#D4956A` | Today indicator, booked dates |
| Off-white | `#E8E0D5` | Borders, today cell |

### Changing your PIN

Edit `adminPin` in both environment files (see Step 5 above), then run `npm run deploy`.

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
