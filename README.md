# Store Manager

A small business web app for tracking products, stock, customers, and
sales — built with **Next.js 14 (App Router)** and **Vercel Postgres**,
ready to deploy on Vercel.

## Features

- **Products & stock** — organized by category, with price and stock
  per item, and a configurable low-stock threshold.
- **Low-stock alerts** — the dashboard shows a banner listing every
  product at or below its threshold as soon as it loads. (This is an
  in-app alert, not a push/SMS notification — a real push notification
  would need a native app or browser push permission, which is a
  separate feature you can add later if needed.)
- **Customer list** — name, phone, address, notes.
- **Sales entry** — pick a product (price and current stock shown),
  quantity, optional customer, date. Stock decreases automatically;
  deleting a sale restores the stock.
- **Reports** — daily sales for any date, and monthly sales with a
  day-by-day bar chart, category breakdown, and best-selling products.

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Vercel Postgres** (`@vercel/postgres`) for storage — this is a
  serverless Postgres database that Vercel provisions for you; it's
  the simplest option because it needs zero extra configuration once
  attached to your Vercel project (no separate hosting, no manual
  connection strings).
- **Tailwind CSS** for styling

No ORM (like Prisma) is used — just plain SQL via tagged template
strings, which keeps the project small and easy to read. The database
tables are created automatically the first time the app runs
(see `lib/db.ts`).

## 1. Run it locally (optional but recommended first)

```bash
npm install
```

You need a Postgres database to develop against. The easiest path:

1. Create a free project at [neon.tech](https://neon.tech) or
   [vercel.com](https://vercel.com) (Storage → Postgres) and copy the
   connection string it gives you.
2. Copy `.env.example` to `.env.local` and paste the connection string
   into `POSTGRES_URL`.
3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The tables are
created automatically on first request.

## 2. Deploy to Vercel

### Step 1 — Push this project to GitHub

Create a new GitHub repository and push this folder to it:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(If you'd rather not use the command line, you can also drag-and-drop
this project into GitHub Desktop, or use the Vercel CLI in Step 4
below to deploy directly without GitHub.)

### Step 2 — Import the project into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is
   easiest).
2. Click **Add New → Project**.
3. Select the GitHub repository you just pushed.
4. Vercel auto-detects Next.js — leave the build settings as default
   and click **Deploy**. The first deploy will fail or the app will
   show a database error, and that's expected — you haven't attached
   a database yet. That's the next step.

### Step 3 — Attach Vercel Postgres

1. In your new project on Vercel, go to the **Storage** tab.
2. Click **Create Database → Postgres** (Neon-backed, on Vercel's free
   tier this is enough for a single small store).
3. When asked which project to connect it to, choose this project.
   Vercel will automatically add the `POSTGRES_URL` and related
   environment variables to your project — you don't need to copy
   anything by hand.
4. Go to **Deployments** and redeploy (or just push a new commit) so
   the app picks up the new environment variables.

### Step 4 — (Alternative) Deploy straight from your computer

If you'd rather skip GitHub entirely:

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts (it will ask to link or create a project), then
attach Postgres from the Vercel dashboard as in Step 3, and run
`vercel --prod` to deploy to production.

### Step 5 — Open your app

Vercel gives you a URL like `https://your-project.vercel.app` —
that's the live link you can share with whoever manages the store.
The first time it loads, it will automatically create the database
tables, so there's nothing extra to run.

## Notes on this MVP and what you might add next

- **No login/authentication yet** — anyone with the URL can use the
  app. For a single shop owner this is often fine, but if staff will
  use it too, or you want to keep it private, add authentication
  (Vercel's own [Auth](https://vercel.com/docs) options, or a simple
  password gate using Next.js middleware) before sharing the link
  widely.
- **No profit/cost tracking** — only sale price is tracked, not cost
  price, so there's no margin report. Add a `cost_price` column to
  `products` and a calculation in the reports API if you want that.
- **No CSV/Excel export** — the reports page shows totals on screen;
  exporting to a spreadsheet would be a small addition to the reports
  API (return CSV instead of/alongside JSON).
- **Currency symbol** — set to `$` in the code (`money()` helper in
  each page). Change the symbol string in each page's `money()`
  function, or centralize it in a shared helper, if you'd like it
  localized.
- **Concurrent sales** — stock is decremented with a straightforward
  `UPDATE ... SET stock = stock - qty`, which is safe even with two
  people recording sales at the same time. The stock-availability
  *check* before that happens in a separate step, so in rare cases of
  simultaneous sales of the very last unit, both could pass the check.
  For a single small shop this is unlikely to matter; a stricter
  version would use a SQL transaction with row locking.

## Project structure

```
app/
  page.tsx              Dashboard
  products/page.tsx      Products & stock
  customers/page.tsx     Customer list
  sales/page.tsx          Record a sale
  reports/page.tsx        Daily & monthly reports
  api/
    products/            CRUD for products
    customers/            CRUD for customers
    sales/                 Create/list/delete sales (adjusts stock)
    reports/                Daily & monthly aggregation
lib/db.ts               Postgres connection + auto schema creation
components/Nav.tsx      Sidebar navigation
```
