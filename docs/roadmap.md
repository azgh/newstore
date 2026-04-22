# Roadmap

## Phase 1: Foundation

Estimated time: 2 to 4 days

- Create GitHub repository
- Scaffold Next.js + Payload app
- Configure Postgres
- Configure local development environment
- Create initial Payload collections
- Set up shared design tokens

## Phase 2: Storefront UI

Estimated time: 4 to 7 days

- Build layout system
- Build homepage
- Build collection page
- Build product detail page
- Build responsive header, footer, and mobile nav
- Add loading and empty states

## Phase 3: Commerce Flow

Estimated time: 3 to 5 days

- Add cart state
- Create Stripe products and prices mapping
- Add checkout session creation
- Add success page
- Add webhook handling
- Save order/payment result in Payload

## Phase 4: Admin and Content

Estimated time: 2 to 4 days

- Finalize product schema
- Add media workflows
- Add site settings
- Add content blocks for homepage
- Add basic legal pages

## Phase 5: Launch Readiness

Estimated time: 2 to 3 days

- SEO defaults
- Analytics
- Error handling
- Performance pass
- QA on mobile and desktop
- Production deployment

## Total Estimate

For a focused MVP:

- Fast path: about 2 weeks
- More polished path: about 3 to 4 weeks

## Cost Expectation

### Development Cost

Payload is cheaper to build initially than Medusa because the project stays more unified.

### Infrastructure Cost

Typical early-stage stack:

- Vercel
- Postgres
- Stripe fees
- object storage if needed

This is generally lower complexity and lower cost than running a Medusa backend plus its supporting services.

