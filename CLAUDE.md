# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full-stack app for tracking "active" (unbilled) vs. "billed" customers, each with on-site/leave dates and a per-customer to-do checklist. Postgres + Express backend, React + TypeScript (Vite) frontend.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite frontend dev server
- `node server.cjs` or `nodemon server.cjs` — start the Express backend (port 3000 by default, `PORT` env var to override)
- `npm run build` — type-check (`tsc -b`) and build the frontend
- `npx tsc -b --noEmit` — type-check only, without building
- `npm run lint` — ESLint
- `npm run migrate -- up` / `npm run migrate -- down` — apply/roll back DB migrations (node-pg-migrate)
- `npm run migrate -- create <name>` — scaffold a new timestamped migration file in `migrations/`
- `node db/seed.cjs` — recreate `active_customers`/`billed_customers` from scratch and insert a couple of test rows

There is no automated test suite. Verify backend changes against the running server with curl/Postman, verify DB changes directly in `psql`, and verify the frontend by running it in the browser.

## Setup order

1. `CREATE DATABASE billingquest;` in `psql` (or set `DATABASE_URL` in `.env` if not using the default local, no-auth connection)
2. `node db/seed.cjs`
3. `npm run migrate -- up`
4. Start the backend and frontend dev servers

`db/seed.cjs` predates the migrations system: it creates `active_customers`/`billed_customers` with a hardcoded, minimal schema (no `to_do` history, no `active_customer_todos` table) and doesn't touch `pgmigrations`. Migrations must run after seeding or the schema will be missing columns/tables that the app expects.

## Backend architecture

- `db/client.cjs` exports a single shared `pg.Client` instance (not a pool). `server.cjs` calls `client.connect()` once before `app.listen`; every `db/*.cjs` module imports and reuses that same client. There's no per-request connection handling.
- Each resource gets one `db/*.cjs` module exporting plain async functions (`get*`, `post*`, `update*`, `delete*`) that run parameterized queries directly. `server.cjs` is a single flat file that requires these modules and wires each function straight into an Express route — there are no router files or controller layers.
- Schema changes go through `node-pg-migrate` (`migrations/`), not through `db/seed.cjs` or hand-edited DDL.
- To-dos are a separate `active_customer_todos` table (own `id`, `active_customer_id` FK with `ON DELETE CASCADE`), not a column on `active_customers` — deleting an active customer cascades to its to-dos automatically. Todo routes are nested: `/active-customers/:id/todos` and `/active-customers/:id/todos/:todoId`.
- Moving a customer from active to billed (`moveActiveCustomerToBilled` in `db/active-customers.cjs`) is a single `BEGIN`/`COMMIT`/`ROLLBACK` transaction — it inserts into `billed_customers` and deletes from `active_customers` as one atomic operation, not two independent REST calls, so a customer can never end up duplicated or lost between the two tables.
- `getActiveCustomers` returns to-do counts inline via a `LEFT JOIN` + `GROUP BY` against `active_customer_todos` (`total_todos`, `completed_todos` cast to `::int`), rather than the frontend fetching each customer's to-dos separately.

## Frontend architecture

- Routing uses `react-router-dom`'s `BrowserRouter` (set up in `main.tsx`), with `NavLink` in `App.tsx` for the header nav (gets an auto-applied `active` class for the current route — styled in `App.css`).
- Every create/edit/move action is its own component (`AddActiveCustomer`, `EditActiveCustomer`, `MoveToBilled`) rendered as a floating modal (`.modal-overlay` / `.modal-content` in `App.css`) conditionally shown over `ActiveCustomers.tsx` via boolean state + a `selectedCustomer` state value. Each modal component takes the relevant `customer`, an `onClose`, and a callback to refetch the parent's list (e.g. `onCustomerAdded`, `onUpdated`, `onMoved`) — there's no shared global state, each modal talks directly to its own `fetch` calls.
- `ActiveCustomerTodos.tsx` is a self-contained nested component (rendered inside `EditActiveCustomer`'s modal) that manages its own fetch/add/toggle/delete calls against `/active-customers/:id/todos` — it does not report changes up to `ActiveCustomers.tsx` live; the parent's to-do counts only refresh when the Edit modal is closed.
- The Vite dev server proxies specific paths to the Express backend on port 3000 (see `vite.config.ts`) rather than using CORS — any new top-level backend route needs a matching proxy entry added, or it will 404 when hit from the frontend dev server.
