# Ecommerce App

Early execution scaffold for the single-store commerce platform. The repository now includes:

- Fastify API skeleton with health, auth, catalog, inventory, orders, customers, content, promotions, reviews, reporting, and Growth Studio routes.
- RBAC-aware middleware hook and request context enrichment for request IDs and bearer token decoding.
- Prisma schema aligned to core domain tables (users/roles/audit logs, products/variants/images, inventory ledger, promotions).
- TypeScript toolchain with dev/build scripts.

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set values for your environment. Key variables:
   - `PORT`, `HOST`, `LOG_LEVEL`
   - `DATABASE_URL` (PostgreSQL), `JWT_SECRET`
   - `REDIS_URL` (rate limiting, queues), `PAYMENT_WEBHOOK_SECRET`, `PAYMENT_PROVIDER_KEY`
   - `SMTP_*` and `EMAIL_FROM` for notifications
   - `FILE_STORAGE_*` for image uploads (S3/MinIO compatible)
   - `FRONTEND_URL` and `ADMIN_URL` for CORS/links
3. Run the API in dev mode
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000/health` to verify readiness.

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
