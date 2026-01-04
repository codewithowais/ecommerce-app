# Ecommerce App

Early execution scaffold for the single-store commerce platform. The repository now includes:

- Fastify API skeleton with health, auth, catalog, inventory, orders, customers, content, promotions, reviews, reporting, Growth Studio, storefront, and webhook routes.
- RBAC-aware middleware hook and request context enrichment for request IDs and bearer token decoding.
- Prisma schema aligned to core domain tables (users/roles/audit logs, products/variants/images, categories/collections, inventory ledger, promotions, carts/wishlists, customers, orders/payments/shipments, CMS pages/navigation/banners).
- TypeScript toolchain with dev/build scripts.

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set values for your environment. Key variables:
   - `PORT`, `HOST`, `LOG_LEVEL`
   - `DATABASE_URL` (PostgreSQL), `JWT_SECRET`
   - `REDIS_URL` (rate limiting, queues), `RATE_LIMIT_PER_MINUTE`, `SESSION_REDIS_PREFIX`
   - `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`, `COOKIE_SECRET` (if cookie auth)
   - `PAYMENT_WEBHOOK_SECRET`, `PAYMENT_WEBHOOK_TOLERANCE_MS`, `PAYMENT_PROVIDER_KEY`
   - `SMTP_*` and `EMAIL_FROM` for notifications
   - `FILE_STORAGE_*` and `FILE_STORAGE_PUBLIC_URL` for image uploads (S3/MinIO compatible)
   - `FRONTEND_URL`, `ADMIN_URL`, `CORS_ALLOWED_ORIGINS` for CORS/links
3. Run the API in dev mode
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000/health` to verify readiness.

### Manual smoke checks (stubs)
- Health: `curl http://localhost:3000/health`
- Storefront catalog: `curl "http://localhost:3000/storefront/catalog?search=tee"`
- Checkout: `curl -X POST http://localhost:3000/storefront/checkout -H 'Content-Type: application/json' -d '{"email":"test@example.com","items":[{"sku":"SKU-1","quantity":1,"price":1999}],"shippingAddress":{"line1":"123 Example"},"paymentMethod":"card"}'`
- Payment webhook (expects signature + idempotency header): `curl -X POST http://localhost:3000/webhooks/payments -H 'x-signature: replace-me' -H 'idempotency-key: test-key'`

### Domain coverage quick-reference
- Catalog: products with variants, images, categories (tree), collections (manual/rule-based)
- Inventory: append-only ledger per variant with low-stock thresholds
- Orders: lifecycle statuses, payments, refunds, shipments, invoices, timelines
- Customers: profiles, addresses, segments, exports, wishlists, carts
- Content: pages, banners, navigation entries
- Growth & Promotions: coupons/automatic discounts, Growth Studio analytics stubs

## Available feature stubs
- **Auth**: login + refresh token issuance
- **Catalog**: product CRUD shell with RBAC guard
- **Inventory**: append-only movement endpoint and low-stock alert placeholder
- **Orders**: lifecycle hooks for creation, status transitions, refunds, and timelines
- **Customers**: profile CRUD and segments
- **Promotions**: coupons/automatic discounts with validation stub
- **Reviews**: submission and moderation endpoints
- **Content/CMS**: pages, navigation, theme settings
- **Reports & Analytics**: sales, inventory, and customer reports
- **Growth Studio**: profit/reorder/copilot scaffolding
- **Staff & Audit**: roles, users, audit feed

## Next steps
- Wire the Prisma client and migrations for the provided schema.
- Implement real auth (password verification, refresh token storage, MFA for staff).
- Replace stubbed handlers with service modules that enforce transactional boundaries for checkout, inventory ledger, and Growth Studio analytics.
- Add CI/CD workflows and linting as outlined in `docs/platform_spec.md`.
