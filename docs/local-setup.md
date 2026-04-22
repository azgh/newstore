# Local Setup

## What This Uses

- Docker for PostgreSQL
- Next.js for the storefront
- Payload inside the same Next.js app

## Start the Database

From the project root:

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:

- database: `atelier_store`
- user: `postgres`
- password: `postgres`

## Start the App

From the `web` folder:

```bash
pnpm dev
```

Then open:

- storefront: `http://localhost:3000`
- admin: `http://localhost:3000/admin`

## First Admin User

On first boot, Payload will guide you through creating the first admin user in the browser.

## Stripe Later

When you are ready to connect checkout:

- add `STRIPE_SECRET_KEY`
- add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- add `STRIPE_WEBHOOK_SECRET`

The local env file already includes placeholders for these values.

Recommended local webhook command:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
