# 🐱 Purrfect Cat Sitting — Availability Calendar

A website for your cat-sitting business. Customers visit to see which dates you're available and know when to reach out to book. You manage everything yourself with a simple PIN — no separate admin panel, no extra login, just tap "Cat sitter? Sign in" and your calendar becomes editable.

Built with **Angular 19** and **Supabase** (free tier). Hosted on **GitHub Pages**.

---

## Table of contents

1. [How the website works](#how-the-website-works)
2. [How you manage availability (admin guide)](#how-you-manage-availability-admin-guide)
3. [First-time setup](#first-time-setup)
4. [Deploying to GitHub Pages](#deploying-to-github-pages)
5. [Making changes to the site](#making-changes-to-the-site)
6. [Project structure](#project-structure)
7. [How the data flows (technical)](#how-the-data-flows-technical)
8. [Future improvements](#future-improvements)

---

## How the website works

### What customers see

When a customer visits your site they land on a single page with a monthly calendar. Dates that you've marked available are highlighted **green with a 🐾 paw print**. Dates with no marking are simply not available. Customers can navigate forward and backward through months using the arrow buttons to check upcoming availability.

There is no booking form built in yet — the idea is that customers contact you directly once they find a date that works (e.g. via email or phone, which you can add to the footer). The calendar is purely informational for now.

### What you see as the cat sitter

The calendar looks identical to customers *until* you sign in. Once signed in with your PIN, every future date becomes clickable:

- **Click an empty date** → it turns green and gets a 🐾, marking it available
- **Click a green date** → it goes back to unmarked (unavailable)
- A small spinner shows on the cell while the change saves
- Changes sync to Supabase instantly and appear on every device — your phone, laptop, tablet — within seconds, without a page refresh

### What gets stored

Only dates that are **available** (or **booked**) are stored in the database. A date with no entry is simply treated as unavailable. Each stored row contains the date (`YYYY-MM-DD`), a status (`available` or `booked`), an optional note, and a timestamp.

---

## How you manage availability (admin guide)

### Signing in

1. Open the website on any device (phone, laptop, etc.)
2. Click **"Cat sitter? Sign in"** in the top-right corner of the header
3. Enter your PIN in the popup that appears
4. The header will change to show a green **"Admin mode"** bar — you're in

### Marking dates available

With admin mode on, simply **click any future date** on the calendar. It will immediately turn green with a 🐾 to show it's available. A small spinner will briefly appear on the cell while it saves to the database.

### Removing availability

Click a green date again and it goes back to unmarked (unavailable). Same one-click toggle.

### Signing out

Click **"Sign out"** in the green admin bar in the header. The calendar goes back to the customer view.

### Using it from different devices

Because availability is stored in Supabase (not just your browser), you can manage dates from your phone one day and your laptop another — everything stays in sync. If you mark a date available on your phone, a customer on their laptop will see it update within a few seconds automatically, no page refresh needed.

### Changing your PIN

Open `src/environments/environment.ts` and `src/environments/environment.prod.ts` and change the `adminPin` value. Then redeploy with `npm run deploy`. The default PIN is `1234` — **change this before sharing the site**.

---

## First-time setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (download the LTS version)
- A free [Supabase](https://supabase.com) account
- A [GitHub](https://github.com) account (for hosting)

---

### Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (it's free)
2. Click **New project**
3. Give it a name like `cat-sitter`, set a database password, choose a region close to you, click **Create project**
4. Wait about 1 minute for it to spin up

---

### Step 2 — Create the availability table

In your Supabase dashboard, go to **SQL Editor** (left sidebar) and paste and run this:

```sql
create table availability (
  date_key   text primary key,
  status     text not null default 'available',
  note       text,
  updated_at timestamptz not null default now()
);

-- Enable row level security
alter table availability enable row level security;

-- Anyone can read (public calendar)
create policy "Public can read availability"
  on availability for select
  using (true);

-- Anyone can write (PIN in the app controls who actually does this)
create policy "Anyone can write availability"
  on availability for all
  using (true)
  with check (true);
```

Click **Run**. You should see "Success. No rows returned."

> **About the write policy:** The "anyone can write" policy is intentional for this MVP. Your PIN in the Angular app is what prevents random visitors from making changes — they never see the edit controls without it. If you want stricter database-level security later, you can switch to Supabase Auth and lock the write policy to authenticated users only.

---

### Step 3 — Enable Realtime on the table

This is what makes changes appear on all devices instantly without a page refresh.

1. In your Supabase dashboard, go to **Database → Replication** (left sidebar)
2. Under **Source** → **Tables**, find the `availability` table
3. Toggle it **on**

---

### Step 4 — Get your API credentials

Go to **Project Settings → API** (left sidebar, bottom). You need two things:

- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon public** key — a long string starting with `eyJ...`

---

### Step 5 — Add your credentials to the app

Open these two files in a text editor and fill in your values:

**`src/environments/environment.ts`** (used when running locally)
**`src/environments/environment.prod.ts`** (used when deployed)

```ts
export const environment = {
  production: false,
  supabase: {
    url: 'https://YOUR_PROJECT_ID.supabase.co',  // ← paste your Project URL
    anonKey: 'eyJ...'                             // ← paste your anon key
  },
  adminPin: '1234'  // ← CHANGE THIS to your own PIN before deploying!
};
```

Set the same values in both files. The only difference between the two files is `production: true` in the prod one.

---

### Step 6 — Install dependencies and run locally

```bash
# In a terminal, navigate to the project folder
cd cat-sitter

# Install all dependencies
npm install

# Start the local dev server
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. You should see the calendar. Try signing in with your PIN and clicking some dates to test that Supabase is connected.

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

```
cat-sitter/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── calendar/
│   │   │   │   ├── calendar.component.ts       # Calendar grid logic
│   │   │   │   ├── calendar.component.html     # Calendar template
│   │   │   │   └── calendar.component.scss     # Calendar styles
│   │   │   └── admin-toggle/
│   │   │       ├── admin-toggle.component.ts   # PIN login / logout logic
│   │   │       ├── admin-toggle.component.html # Login modal + admin bar
│   │   │       └── admin-toggle.component.scss # Styles
│   │   ├── services/
│   │   │   ├── availability.service.ts         # Core business logic
│   │   │   └── supabase.service.ts             # Supabase client + queries
│   │   ├── app.component.ts                    # Root component
│   │   ├── app.component.html                  # Page layout (header, main, footer)
│   │   └── app.component.scss                  # Page layout styles
│   ├── environments/
│   │   ├── environment.ts                      # Dev config (credentials go here)
│   │   └── environment.prod.ts                 # Prod config (same credentials)
│   ├── styles.scss                             # Global styles (reset, fonts)
│   ├── index.html                              # HTML entry point
│   └── main.ts                                 # Angular bootstrap
├── angular.json                                # Angular CLI config
├── package.json                                # Dependencies and scripts
└── tsconfig.json                               # TypeScript config
```

---

## How the data flows (technical)

1. **App starts** → `AvailabilityService` calls `SupabaseService.fetchAll()` which runs `SELECT * FROM availability`. The results are stored in an Angular signal (`_days`).

2. **Calendar renders** → The `calendarDays` computed signal builds a 42-cell grid (6 weeks) from the current month. Each cell checks the `_days` signal to determine its status (available, booked, or none).

3. **Admin clicks a date** → `toggleAvailable(dateKey)` runs an **optimistic update** first (the UI changes immediately), then calls `supabase.upsert()` or `supabase.remove()`. If the database call fails, the signal is reset to the last good state.

4. **Realtime sync** → On startup, `SupabaseService.subscribeToChanges()` opens a websocket to Supabase Realtime. Any `INSERT`, `UPDATE`, or `DELETE` on the `availability` table triggers a full re-fetch, so all open tabs and devices stay in sync automatically.

5. **PIN auth** → The PIN is checked entirely in the browser against `environment.adminPin`. No server call is made. A successful PIN check sets an `_isAdmin` signal to `true`, which unlocks the edit controls in the calendar template.

---

## Future improvements

These features aren't built yet but would be natural next steps:

- **Contact form** — let customers request a booking directly from the site
- **Booked status** — mark a confirmed booking differently from just "available", so customers know a date is taken
- **Notes on dates** — add a short note to a date (e.g. "available AM only") visible on hover
- **Email notifications** — get an email when someone enquires about a date (via Supabase Edge Functions + Resend)
- **Stricter admin security** — replace the PIN with proper Supabase Auth (email + password) so the credentials aren't in the compiled JS
- **Custom domain** — point a domain like `www.purrfectcatsitting.com` to your GitHub Pages site
