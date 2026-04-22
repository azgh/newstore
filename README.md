# newstore

A modern ecommerce project built with Next.js, Payload, and Stripe.

## Recommended Stack

- Next.js
- Payload CMS
- Stripe
- PostgreSQL
- Tailwind CSS
- shadcn/ui

## Product Direction

This project follows a "beautiful storefront + Stripe-powered checkout" approach inspired by Your Next Store, while keeping product, content, and admin management in Payload.

## Core Principles

- Make the storefront feel premium and fast.
- Keep the first version intentionally small.
- Let Stripe handle payments and checkout complexity.
- Let Payload manage products, content, and editorial control.
- Optimize for AI-friendly development in a Next.js codebase.

## Suggested App Structure

For MVP, keep everything in a single Next.js app with embedded Payload:

```txt
.
├─ app/
├─ components/
├─ collections/
├─ blocks/
├─ lib/
├─ payload.config.ts
├─ docs/
└─ public/
```

## MVP Scope

- Home page
- Collection page
- Product detail page
- Cart
- Stripe Checkout
- Order success page
- Payload admin for products and content
- Basic SEO

## Documentation

- [Architecture](./docs/architecture.md)
- [MVP](./docs/mvp.md)
- [Roadmap](./docs/roadmap.md)
- [Local Setup](./docs/local-setup.md)
