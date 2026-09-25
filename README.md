# 🐱 Purrfect Cat Sitting — Availability Calendar

A website for your cat-sitting business. Customers visit to see which dates you're available and can register to request a booking. You manage everything yourself as an Admin—approving requests, marking dates as unavailable, or opening up new dates on your calendar.

Built with **Angular 19** on the frontend, and a **Node.js/Express** backend using **PostgreSQL** (via Sequelize) for the database.

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

- Node.js 18 or newer
- PostgreSQL installed and running locally
- Angular CLI

### Step 1 — Database Setup

Ensure PostgreSQL is running, then create the database and user:

`sudo -u postgres psql`
`CREATE DATABASE catsitter;`
`ALTER USER postgres PASSWORD 'your_password';`
`\q`

### Step 2 — Backend Setup

1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   `npm install`
3. Create a `.env` file in the `backend` folder:
   `DATABASE_URL=postgres://postgres:your_password@localhost:5432/catsitter`
   `JWT_SECRET=supersecretkey123`
   `PORT=3000`
4. Start the server (this will automatically sync the database tables):
   `node src/index.js`
   `# or use nodemon for development: npx nodemon src/index.js`

### Step 3 — Frontend Setup

1. Open a new terminal and navigate to the root folder.
2. Install dependencies:
   `npm install`
3. Ensure `src/environments/environment.ts` points to your local backend:
   `export const environment = { production: false, apiUrl: 'http://localhost:3000/api' };`
4. Start the Angular dev server:
   `ng serve`
5. Open `http://localhost:4200` in your browser.

### Step 4 — Creating the Admin Account

1. On the frontend, click "Sign in" and toggle to the "Register" form.
2. Create an account with your email, password, and name.
3. Open your database (using a tool like DBeaver, pgAdmin, or psql).
4. Run the following SQL to make yourself an admin:
   `UPDATE "Users" SET role = 'admin' WHERE email = 'your@email.com';`
5. Log out and log back in on the frontend to activate Admin mode.

---

## Project structure

* `backend/` - Node.js / Express Backend
  * `src/middleware/` - JWT Authentication middleware
  * `src/models/` - Sequelize Models (User, Availability)
  * `src/routes/` - API Routes (auth, availability)
  * `src/db.js` - Database connection
  * `src/index.js` - Express App entry point
* `src/` - Angular Frontend
  * `app/components/` - Calendar, AdminToggle
  * `app/services/` - AuthService, AvailabilityService

