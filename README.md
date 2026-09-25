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

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker engine with `docker compose`
- A [GitHub](https://github.com) account (for hosting)

### Step 1 — Database Setup

### Running the Local Development Environment

We use Docker Compose to run the PostgreSQL database, the Node.js/Express backend, and the Angular frontend together seamlessly.

1. **Start the environment**
   Simply run the start script in your terminal:
   ```bash
   ./start-dev.sh
   ```
   *(Or run `docker compose up` manually.)*

2. **Access the application**
   Once all services have started and dependencies are installed:
   - **Frontend** is available at [http://localhost:4200](http://localhost:4200)
   - **Backend API** is available at [http://localhost:3000](http://localhost:3000)
   - **Database** is accessible on `localhost:5432`

3. **Admin Setup**
   By default, all users are given the `user` role. To grant admin privileges, connect to your local Postgres database and update the user. For example, if you register an account `your@email.com` in the app, you can give it admin rights:
   ```bash
   # In a new terminal, run:
   docker compose exec db psql -U postgres -d catsitter -c "UPDATE \"Users\" SET role = 'admin' WHERE email = 'your@email.com';"
   ```

*(For more backend details, refer to `BACKEND.md`)*

---

## Deploying to GitHub Pages

GitHub Pages hosts the site for free at `https://YOUR_USERNAME.github.io/cat-sitter/`.

### First deployment

```bash
# 1. Initialise git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cat-sitter.git
git push -u origin main
```

If your GitHub repo is named something other than `cat-sitter`, update the base href in `package.json`:

```json
"build:prod": "ng build --configuration production --base-href /YOUR_REPO_NAME/"
```

```bash
# 2. Build and deploy to GitHub Pages
npm run deploy
```

This builds the Angular app for production and pushes the output to a `gh-pages` branch automatically.

```
# 3. Enable GitHub Pages in your repo settings:
#    Settings → Pages → Source: Deploy from branch → gh-pages → / (root) → Save
```

Your site will be live at `https://YOUR_USERNAME.github.io/cat-sitter/` within a minute or two.

### Subsequent deployments

Any time you make changes to the code or update your PIN:

```bash
npm run deploy
```

That's it. No other steps needed.

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

* `backend/` - Node.js / Express Backend
  * `src/middleware/` - JWT Authentication middleware
  * `src/models/` - Sequelize Models (User, Availability)
  * `src/routes/` - API Routes (auth, availability)
  * `src/db.js` - Database connection
  * `src/index.js` - Express App entry point
* `src/` - Angular Frontend
  * `app/components/` - Calendar, AdminToggle
  * `app/services/` - AuthService, AvailabilityService

