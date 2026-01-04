# Ecommerce App

Early execution scaffold for the single-store commerce platform. The repository now includes:

- Fastify API skeleton with health, auth, catalog, inventory, and Growth Studio routes.
- RBAC-aware middleware hook and request context enrichment for request IDs and bearer token decoding.
- Prisma schema aligned to core domain tables (users/roles/audit logs, products/variants/images, inventory ledger, promotions).
- TypeScript toolchain with dev/build scripts.

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Provide environment variables (see `.env.example`)
3. Run the API in dev mode
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000/health` to verify readiness.

## Next steps
- Wire the Prisma client and migrations for the provided schema.
- Implement real auth (password verification, refresh token storage, MFA for staff).
- Replace stubbed handlers with service modules that enforce transactional boundaries for checkout, inventory ledger, and Growth Studio analytics.
- Add CI/CD workflows and linting as outlined in `docs/platform_spec.md`.
