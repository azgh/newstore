# Architecture

## Final Recommendation

Use a single Next.js codebase with Payload embedded inside it, then connect Stripe for checkout and payment events.

This gives you:

- a premium custom storefront
- one codebase for AI-assisted development
- a real admin panel for products and content
- less backend overhead than Medusa

## High-Level Architecture

```txt
Customer
  -> Next.js storefront
      -> Payload local API / database
      -> Stripe Checkout
          -> Stripe webhook
              -> update order/payment records in Payload
```

## Responsibility Split

### Next.js

- storefront UI
- server-rendered product and collection pages
- cart state
- checkout entry points
- SEO pages and marketing pages

### Payload

- product content model
- categories / collections
- homepage content blocks
- media library
- editorial pages
- order records
- admin dashboard

### Stripe

- hosted checkout
- payment processing
- payment confirmation
- webhook events
- refunds and billing primitives

## Data Model Suggestion

Start with these collections:

- `products`
- `categories`
- `orders`
- `pages`
- `media`
- `site-settings`

Suggested product fields:

- `title`
- `slug`
- `subtitle`
- `description`
- `price`
- `compareAtPrice`
- `stripeProductId`
- `stripePriceId`
- `images`
- `category`
- `status`
- `featured`
- `inventory`

## Why Not Pure Stripe As Backend

Pure Stripe-first is clever for an early storefront, but it becomes limiting once you need:

- richer product content
- merchandising control
- editorial flexibility
- custom product modeling
- stronger admin workflows

Payload fills that gap well without adding the full weight of a dedicated commerce backend.

## Deployment Suggestion

- Frontend and Payload app: Vercel
- Database: Neon Postgres or Supabase Postgres
- Media: S3 / Cloudflare R2 / Payload-supported storage
- Payments: Stripe

## Technical Notes

- Prefer Payload with Postgres for long-term stability.
- Use Stripe Checkout first, not custom on-site card forms.
- Add webhooks early so order state stays reliable.
- Keep cart logic simple in MVP.

