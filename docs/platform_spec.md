# Single-Store E-Commerce Platform Specification

## 1) Product Requirements Document (PRD)
### Goals
- Launch a production-ready single-store e-commerce platform with unified admin and storefront experiences.
- Drive profitable growth through analytics, automation, and Growth Studio differentiators.
- Ensure operational reliability with strict data correctness, observability, and security controls.

### Personas
- **Customer**: Browses catalog, creates wishlist/cart, checks out as guest or logged-in, tracks orders, leaves reviews.
- **Store Admin**: Owns catalog, pricing, promotions, content, Growth Studio insights, and operational settings.
- **Operations/CS Agent**: Manages orders, refunds, returns, shipments, customer support, and notes.
- **Staff (with RBAC)**: Performs scoped tasks (catalog manager, support agent, marketer) per role permissions.
- **Developer/Integrator**: Extends storefront theme, hooks webhooks, integrates marketing/analytics tools.

### In Scope (MVP unless specified)
- Single store with admin RBAC; staff CRUD and roles.
- Catalog: products with variants, SKUs, prices (cost/sale/compare-at), stock, images, tags, SEO metadata.
- Categories (tree), Collections (manual + rule-based rules engine).
- Inventory: per-variant stock, append-only ledger, low-stock alerts.
- Orders: full lifecycle, payment capture, shipments/tracking, invoices (PDF), partial/full refunds, cancellations, order timeline/notes.
- Customers: profiles, addresses, tags, segments, exports.
- Promotions: coupons (%/fixed/free shipping) with rules (min spend, usage limits, per-customer limits); automatic discounts.
- Reviews with moderation and rating averages.
- CMS-lite: pages, banners, homepage sections, navigation/footer, theme settings.
- Reports/analytics: sales by date/product/category, inventory valuation & low-stock, customer insights (RFM/LTV estimate), CSV exports.
- Growth Studio (MVP subset): profit-first analytics, low-margin alerts, reorder suggestions, bundle/upsell recs, CEO Weekly Digest (email), Marketing Copilot (text generation via pluggable provider stub).
- Observability, security, rate limiting, CSRF (if cookies), validation, background jobs for notifications/reports/webhooks, idempotent payment webhooks.

### Out of Scope (MVP)
- Multi-store/tenant, marketplace features.
- Advanced loyalty points; subscription billing.
- In-store POS; headless multi-channel.

### Non-Functional Requirements
- **Security**: bcrypt/argon2 password hashing, role-based access guards, input validation, CSRF protection for cookie auth, signed URLs for uploads, rate limiting, audit trails for sensitive actions.
- **Data correctness**: Order snapshots immutable post-payment; inventory changes via ledger only; idempotent webhooks with dedupe keys.
- **Performance**: Paginated endpoints, sensible indexes, query caching where safe (catalog, settings), CDN for assets/images, image optimization.
- **Availability/Resilience**: Graceful retries for webhooks/emails, background jobs for heavy tasks, circuit breakers for payment/AI providers.
- **Observability**: Structured logs, request IDs, metrics for throughput/latency/errors, alerts for low-stock, webhook failures.
- **Compliance**: GDPR-friendly data export/delete for customers; privacy-first logging.

### Risks / Mitigations
- **Payment/webhook duplication**: Use idempotency keys and persisted webhook receipts.
- **Data drift (inventory/orders)**: Ledger-only inventory, immutable order snapshots, transactional boundaries.
- **Performance regressions**: Use EXPLAIN-driven indexes; cache catalog; rate-limit search.
- **Operational errors**: RBAC and audit logs; permission-aware UI.
- **AI misuse**: Guardrails + manual approval for Copilot outputs.

### Acceptance Criteria
- Admin can CRUD products/variants, collections, categories, CMS content; set promotions; manage staff/permissions; view audit logs.
- Inventory updates only via ledger movements; low-stock alerts fire when below thresholds.
- Orders progress through lifecycle with payments, shipments, refunds, cancellations, invoices, and timeline entries.
- Customers can browse, filter, search, checkout (guest/login), view account history, wishlist, track orders, receive emails.
- Growth Studio produces profit analytics, low-margin alerts, reorder suggestions, bundle/upsell recommendations, CEO digest, and Copilot text generations (stubbed provider allowed).

## 2) System Architecture
### High-Level Components
- **Frontends**: Storefront (Next.js/React), Admin Panel (React + component library, permission-aware UI), shared design tokens.
- **Backend API**: Node.js (NestJS/Fastify) with REST + limited webhooks; GraphQL optional for storefront; RBAC middleware.
- **Database**: PostgreSQL (primary), Redis for caching/rate limiting, S3-compatible storage for images.
- **Background Workers**: Queue (e.g., BullMQ) for emails, webhooks, reports, Growth Studio computations, digest generation.
- **Third-party Integrations**: Payment gateway (Stripe-like), email provider, optional AI text provider.

### ASCII Architecture Diagram
```
[Storefront SPA] --REST/GraphQL--> [API Gateway/Nest Service] --SQL--> [PostgreSQL]
     |                                         |                ^
     |                                         |                |
[Customer Auth]                          [Cache/Redis]          |
     |                                         |                |
[CDN/Image CDN]                             [BullMQ Workers]----|
                                                 |    |
                                             [Email] [Payments Webhooks]
                                                 |    |
                                           [Growth Studio Jobs]
```

### Module Diagram
```
API Service
├─ Auth & RBAC
├─ Catalog (Products, Variants, Categories, Collections)
├─ Media (Uploads, CDN links)
├─ Inventory (Ledger, Alerts)
├─ Orders & Payments (Checkout, Shipments, Refunds)
├─ Customers & Accounts (Addresses, Segments)
├─ Promotions (Coupons, Auto Discounts)
├─ Reviews & Moderation
├─ CMS (Pages, Banners, Navigation, Theme)
├─ Reports & Analytics
├─ Growth Studio (Profit, Reorder, Bundles, Copilot, Digests, Milestones)
├─ Staff & Audit Logs
└─ Integrations (Webhooks, Email, AI, Payments)
```

## 3) MVP vs Phase-2 Feature Matrix
| Area | MVP | Phase 2 |
| --- | --- | --- |
| Storefront | Catalog browse/filter/search, PDP with variants/reviews, cart, wishlist, guest/login checkout, order tracking, account dashboard | Saved carts across devices, live chat, loyalty program, advanced personalization |
| Admin Catalog | Products/variants CRUD, categories tree, manual + rule-based collections | Bulk import/export via CSV, versioned product drafts |
| Inventory | Ledger movements, low-stock alerts | Multi-location stock, demand forecasting |
| Orders | Full lifecycle, shipments/tracking, invoices PDF, partial refunds, cancellations, timeline/notes | Returns merchandise authorization workflow, exchanges |
| Customers | Profiles, addresses, tags, segments, exports | Customer journeys, marketing automation |
| Promotions | Coupons + rules, automatic discounts | Stacking/priority engine, A/B promos |
| Reviews | Ratings/reviews, moderation | Photo/video reviews, Q&A |
| CMS | Pages, banners, homepage sections, navigation/footer, theme settings | Theme marketplace, visual editor |
| Reports | Sales, inventory valuation, low stock, RFM/LTV estimate, CSV export | Cohort analysis, anomaly detection |
| Growth Studio | Profit analytics, low-margin alerts, reorder suggestions, bundles/upsell recs, CEO digest, Copilot text | Automated campaign launches, predictive CLV, experimentation engine |
| Staff/RBAC | Roles/permissions, permission-aware UI | SSO/SAML, fine-grained data-scoped permissions |
| Security/Obs | bcrypt/argon2, rate limiting, validation, CSRF, audit logs, background jobs, structured logs | WAF integration, SIEM pipelines |

## 4) Database Schema (PostgreSQL)
### Core Tables (selected)
- **users** (id, email, password_hash, role_id, status, last_login_at, created_at)
- **roles** (id, name, permissions jsonb, created_at)
- **audit_logs** (id, actor_user_id, action, entity, entity_id, before jsonb, after jsonb, created_at)
- **customers** (id, email, password_hash, name, phone, marketing_opt_in, tags[], created_at)
- **customer_addresses** (id, customer_id FK, label, name, line1/2, city, state, postal_code, country, is_default, created_at)
- **categories** (id, parent_id FK nullable, name, slug, path ltree, seo jsonb, created_at, UNIQUE(path)) with GIST/GIN on path.
- **collections** (id, name, slug, type enum(manual,rule), rules jsonb, seo jsonb, created_at)
- **products** (id, title, subtitle, description, status, seo jsonb, tags[], created_at, updated_at)
- **product_variants** (id, product_id FK, sku, option_values jsonb, price, compare_at_price, cost_price, barcode, weight, dimensions jsonb, created_at, UNIQUE(sku))
- **product_images** (id, product_id FK, url, alt_text, position)
- **product_variant_images** (variant_id FK, image_id FK, PRIMARY KEY (variant_id, image_id))
- **product_categories** (product_id FK, category_id FK, PRIMARY KEY)
- **product_collections** (product_id FK, collection_id FK, PRIMARY KEY)
- **inventory_items** (id, variant_id FK unique, track_inventory bool, low_stock_threshold, created_at)
- **inventory_movements** (id, inventory_item_id FK, delta int, reason enum(receive,adjustment,sale,refund,return,transfer,reserve,release), reference_type/id, created_at, metadata jsonb)
- **inventory_snapshots** (id, inventory_item_id FK, quantity, created_at)
- **carts** (id, customer_id nullable, session_id, status, currency, created_at, updated_at)
- **cart_items** (id, cart_id FK, variant_id FK, quantity, price_snapshot, created_at)
- **orders** (id, number, customer_id nullable, status enum, currency, subtotal, discount_total, tax_total, shipping_total, total, profit_estimate, placed_at, cancelled_at, created_at)
- **order_items** (id, order_id FK, variant_id FK, product_snapshot jsonb, quantity, unit_price, discount_amount, tax_amount, total, cost_snapshot)
- **order_timeline_events** (id, order_id FK, type, message, metadata jsonb, created_at)
- **shipments** (id, order_id FK, carrier, tracking_number, shipped_at, delivered_at, label_url)
- **payments** (id, order_id FK, provider, status, amount, currency, transaction_id, idempotency_key, created_at, UNIQUE(idempotency_key))
- **refunds** (id, order_id FK, amount, status, reason, payment_id FK, created_at)
- **invoices** (id, order_id FK, pdf_url, issued_at)
- **promotions** (id, code, type enum(percent,fixed,free_shipping,auto), value, usage_limit, per_customer_limit, min_spend, starts_at, ends_at, rules jsonb, created_at)
- **applied_promotions** (id, order_id FK, promotion_id FK, amount, created_at)
- **reviews** (id, product_id FK, customer_id FK nullable, rating, title, body, status enum(pending,approved,rejected), created_at)
- **pages** (id, slug, title, content, seo jsonb, status, created_at, updated_at)
- **banners** (id, title, image_url, link_url, position, active_from, active_to)
- **navigations** (id, name, location enum(header,footer), items jsonb)
- **reports_queue** (id, type, params jsonb, status, result_url, created_at, completed_at)
- **growth_metrics** (id, period, metric jsonb) for cached analytics
- **digests** (id, type, payload jsonb, sent_at)

### Indexing Strategy
- B-tree: foreign keys, created_at, status, order placed_at, payments idempotency_key (unique), sku (unique), slug (unique).
- GIN: tags arrays, JSONB (rules, seo, option_values) where queried; trigram for search on product title/description via pg_trgm.
- Ltree: category path for tree queries.
- Partial indexes: active promotions, approved reviews, in-stock variants.

### Prisma Model Sketch (selected)
```prisma
model User { id String @id @default(cuid()); email String @unique; passwordHash String; role Role @relation(fields:[roleId], references:[id]); roleId String; status UserStatus; lastLoginAt DateTime?; createdAt DateTime @default(now()); }
model Role { id String @id @default(cuid()); name String; permissions Json; users User[]; createdAt DateTime @default(now()); }
model Product { id String @id @default(cuid()); title String; subtitle String?; description String?; status ProductStatus; seo Json?; tags String[]; variants ProductVariant[]; images ProductImage[]; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt; categories ProductCategory[]; collections ProductCollection[]; reviews Review[]; }
model ProductVariant { id String @id @default(cuid()); product Product @relation(fields:[productId], references:[id]); productId String; sku String @unique; optionValues Json; price Decimal; compareAtPrice Decimal?; costPrice Decimal?; barcode String?; weight Decimal?; dimensions Json?; inventoryItem InventoryItem?; images ProductVariantImage[]; }
model InventoryItem { id String @id @default(cuid()); variant ProductVariant @relation(fields:[variantId], references:[id]); variantId String @unique; trackInventory Boolean; lowStockThreshold Int?; movements InventoryMovement[]; }
model InventoryMovement { id String @id @default(cuid()); inventoryItem InventoryItem @relation(fields:[inventoryItemId], references:[id]); inventoryItemId String; delta Int; reason InventoryReason; referenceType String?; referenceId String?; metadata Json?; createdAt DateTime @default(now()); }
model Order { id String @id @default(cuid()); number Int @unique; customer Customer? @relation(fields:[customerId], references:[id]); customerId String?; status OrderStatus; currency String; subtotal Decimal; discountTotal Decimal; taxTotal Decimal; shippingTotal Decimal; total Decimal; profitEstimate Decimal?; placedAt DateTime?; cancelledAt DateTime?; createdAt DateTime @default(now()); items OrderItem[]; payments Payment[]; refunds Refund[]; timeline OrderTimelineEvent[]; shipments Shipment[]; invoices Invoice[]; promotions AppliedPromotion[]; }
model OrderItem { id String @id @default(cuid()); order Order @relation(fields:[orderId], references:[id]); orderId String; variantId String?; productSnapshot Json; quantity Int; unitPrice Decimal; discountAmount Decimal; taxAmount Decimal; total Decimal; costSnapshot Decimal?; }
model Promotion { id String @id @default(cuid()); code String? @unique; type PromotionType; value Decimal?; usageLimit Int?; perCustomerLimit Int?; minSpend Decimal?; startsAt DateTime?; endsAt DateTime?; rules Json?; }
```

## 5) Backend API Design
### Auth & RBAC
- **Auth strategies**: JWT for SPA (short-lived access + refresh), httpOnly cookies optional; OAuth for admin optional; password hashing via argon2/bcrypt; email verification + password reset tokens.
- **RBAC middleware**: Roles table with permissions JSON (e.g., `catalog.read`, `orders.refund`). Middleware checks route metadata; UI hides/disables unauthorized actions. Audit log on sensitive changes (prices, refunds, permissions, settings).

### API Endpoint Sketch (REST)
- **Auth**: POST /auth/login, POST /auth/refresh, POST /auth/logout, POST /auth/password-reset, POST /auth/password-reset/confirm, POST /auth/register (customer), POST /staff/invite.
- **Catalog**: GET /products, POST /products, GET /products/:id, PATCH /products/:id, DELETE /products/:id; variant CRUD `/products/:id/variants`; images upload URLs; categories CRUD `/categories`; collections CRUD `/collections` with rule evaluation endpoint.
- **Inventory**: GET /inventory/items, GET /inventory/:variantId, POST /inventory/:variantId/movements (append-only), GET /inventory/alerts.
- **Cart/Checkout**: POST /cart, GET /cart/:id, POST /cart/:id/items, PATCH /cart/:id/items/:itemId, POST /cart/:id/apply-promo, POST /checkout (creates order + payment intent), POST /payments/webhook (idempotent), POST /orders/:id/cancel, POST /orders/:id/refund, POST /orders/:id/shipments, POST /orders/:id/invoice.
- **Orders**: GET /orders, GET /orders/:id, PATCH /orders/:id (status transitions), timeline events `/orders/:id/timeline`.
- **Customers**: CRUD, addresses CRUD, segments query, exports trigger `/customers/export`.
- **Promotions**: CRUD; rule tester endpoint.
- **Reviews**: POST /products/:id/reviews, moderation endpoints `/reviews/:id/approve|reject`.
- **CMS**: Pages, banners, navigations, homepage sections, theme settings CRUD.
- **Reports**: `/reports/sales`, `/reports/inventory`, `/reports/customers`, `/reports/export` (async job).
- **Growth Studio**: `/growth/profit`, `/growth/reorder-suggestions`, `/growth/bundles`, `/growth/copilot`, `/growth/digest`, `/growth/milestones`.
- **Staff & Audit**: `/staff/users`, `/staff/roles`, `/audit-logs`.

### Webhook & Idempotency Strategy
- Payment webhooks stored in `webhook_events` table with `idempotency_key` (provider event ID). Enforce unique constraint; process in transaction; log retries; respond 200 on duplicates.
- Expose `Idempotency-Key` header for client-initiated mutations (checkout, refunds) persisted per resource; reject conflicting replays.

### Inventory Ledger Design
- All stock changes via `inventory_movements` with signed `delta` and reason; triggers update materialized view `inventory_current` for fast reads.
- Reserve stock on checkout intent; release on expiration/cancel; commit on payment success.
- Low-stock job queries `inventory_current` vs threshold and queues alerts.

### Data Snapshots
- Order item stores product + price + cost snapshot; promotion info stored in `applied_promotions`; prevents retroactive price drift.

### Observability & Resilience
- Structured logs (JSON) with requestId, userId, role; audit logs for sensitive actions.
- Metrics: latency, error rate, queue depth, webhook failures, low-margin counts.
- Background jobs for emails (order confirmations, shipping updates, CEO digest), report generation, Growth Studio computations.

## 6) Implementation Roadmap (Sprints)
1. **Foundation (Week 1-2)**: Project scaffolding (NestJS + Prisma + PostgreSQL), auth (JWT/refresh), RBAC middleware, migrations for users/roles/audit, logging setup, basic CI lint/test.
2. **Catalog & CMS (Week 2-3)**: Products/variants, categories, collections rules engine, images upload service, CMS pages/navigation/theme settings.
3. **Inventory & Pricing (Week 3-4)**: Inventory ledger, low-stock alerts job, pricing fields, promotions engine (coupons + auto discounts).
4. **Checkout & Orders (Week 4-5)**: Cart, checkout flow, payments intent, order lifecycle, shipments/tracking, invoices PDF, refunds/cancellations, order timeline.
5. **Customers & Reviews (Week 5-6)**: Customer accounts, addresses, segments/exports, reviews moderation, wishlist, order tracking UI.
6. **Growth Studio (Week 6-7)**: Profit analytics, low-margin alerts, reorder suggestions, bundles/upsell, CEO digest job, Marketing Copilot provider stub.
7. **Reports & Analytics (Week 7-8)**: Sales reports, inventory valuation, RFM/LTV estimate, CSV exports, caching/materialized views.
8. **Hardening (Week 8-9)**: Security review, rate limits, CSRF, SEO/perf (caching, pagination), observability dashboards, load testing, disaster recovery runbook.
9. **Launch Prep (Week 9-10)**: Content/theming, staff training, smoke tests, rollback/runbooks, monitoring alerts.

## 7) Best Practices & Pitfalls to Avoid
- Use append-only logs for inventory and audit; never mutate historical records post-payment.
- Enforce unique SKU and idempotency keys; guard against duplicate payment events.
- Validate and sanitize all inputs; use server-side filtering/pagination to avoid heavy queries.
- Separate read/write DB roles if scaling; apply indexes from EXPLAIN; use connection pooling.
- For Growth Studio AI, sandbox outputs with user confirmation and PII stripping.
- Optimize images (WebP/AVIF), serve via CDN; pre-render SEO pages; use caching for catalog reads.
- Permission-aware UI to hide/disable unauthorized actions; log all sensitive changes.
- Background jobs for long-running tasks (PDF invoices, exports, digests); make jobs idempotent.
- Implement feature flags for new Growth Studio experiments; provide manual overrides.

## 8) Execution Blueprint (Technical Architecture Plan)

### Deployment & Environments
- **Environments**: `dev` (feature flags on), `staging` (data seeds + smoke tests), `prod` (blue/green deploys). Each has isolated PostgreSQL, Redis, object storage buckets, and secrets.
- **CI/CD**: GitHub Actions with stages for lint, tests, type-check, migration dry-run, and preview deployments. Require green status + migration approval gate for `main`.
- **Runtime**: Containerized services (Docker) orchestrated via Kubernetes or ECS. Separate deployments for `api`, `worker`, and optional `storefront` SSR server. Horizontal Pod Autoscaler based on CPU + queue depth.
- **Secrets & Config**: Managed via SSM/Secrets Manager; 12-factor env vars; rotate keys (JWT, DB, webhook secrets); enforce TLS everywhere.

### Service Layout & Key Components
- **API Service (NestJS + Fastify)**: Modules per domain (Auth, Catalog, Inventory, Orders, Customers, Promotions, CMS, Growth, Reports, Staff). Shared infrastructure modules for database, cache, file uploads, observability, and RBAC guards.
- **Worker Service (BullMQ)**: Processes queues `emails`, `reports`, `webhooks`, `growth`, `digests`. Jobs are idempotent and persisted. Retry with exponential backoff and DLQ for manual review.
- **Storefront**: Next.js app with ISR/SSG for catalog pages, server actions for mutations (cart/checkout), client-side hydration for wishlist/cart drawer. Uses public REST/GraphQL endpoints.
- **Admin Panel**: React (Vite) with component library (e.g., Chakra/AntD) and RBAC-aware navigation. Uses `react-query`/`tanstack` for data fetching, optimistic UI only where safe (non-financial ops).

### Reference Directory Structure (monorepo-friendly)
```
apps/
  api/ (NestJS)
  worker/ (BullMQ workers)
  admin/ (React admin)
  storefront/ (Next.js)
packages/
  ui/ (design system tokens/components)
  shared/ (types, DTOs, API client SDK)
  config/ (eslint, tsconfig, commit hooks)
infra/
  terraform/ (VPC, RDS, Redis, buckets, CDN)
  k8s/ (deployments, ingress, secrets, HPA)
```

### API Contract Examples (happy-path payloads)
- **Create Product**: `POST /products` body `{ title, subtitle?, description?, tags?, seo?, variants: [{ sku, optionValues, price, compareAtPrice?, costPrice?, weight?, dimensions? }], images: [{ url, altText }] }`. Response 201 with product + variants.
- **Inventory Movement**: `POST /inventory/:variantId/movements` body `{ delta: int, reason, referenceType?, referenceId?, metadata? }` returning updated on-hand/reserved snapshot.
- **Checkout**: `POST /checkout` body `{ cartId, customerId?, email, shippingAddress, billingAddress?, shippingMethod, paymentMethod, promotions? }` creating order draft + payment intent id with idempotency key in headers.
- **Payment Webhook**: `POST /payments/webhook` body `{ eventId, type, data }` processed transactionally: upsert webhook event, lock order row, transition status, append timeline event, enqueue email.
- **Growth Reorder Suggestions**: `GET /growth/reorder` query `{ period=30d }` returns `{ variantId, velocity, daysOfCover, recommendedReorderQty }` computed from sales velocity vs stock.

### Security & Compliance Controls
- Enforce **RBAC** at route metadata + policy level (e.g., `@Permissions('orders.refund')`); enforce staff MFA for admin login.
- **Input validation** via DTOs + Zod; centralized error formatter; block list for dangerous HTML, sanitize rich text for CMS fields.
- **File uploads**: pre-signed URLs, validate MIME/size, AV scanning hook, store in private bucket with CDN public URLs via signed proxies if needed.
- **Auditing**: Wrap sensitive service methods with audit decorator capturing `before/after` snapshots and actor; store immutable logs.
- **PII/GDPR**: Data access scoped; export/delete tooling; avoid PII in logs; encrypt at rest (RDS, S3) and in transit.

### Data & Consistency Patterns
- **Transactional boundaries**: Use database transactions for checkout → order creation → inventory reserve; rollback on failure. Use `SELECT ... FOR UPDATE` on inventory rows when reserving.
- **Ledger-first inventory**: Insert movement rows then refresh `inventory_current` materialized view. Prohibit direct updates to quantity columns.
- **Order immutability**: After payment success, lock order financial fields; further changes via refunds/adjustments with timeline entries.
- **Idempotency**: Persist `idempotency_key` per mutation; on replay, return stored response if params match, else 409 conflict.

### Observability & Operations
- **Logging**: JSON logs with correlation ids; log key business events (payment succeeded, refund issued, stock below threshold, role changed).
- **Metrics**: RED (rate, errors, duration) per endpoint; queue depth + job failure rate; stockout/low-margin counters; webhook latency.
- **Tracing**: OpenTelemetry with exporters to chosen APM (e.g., Tempo/Jaeger). Instrument DB queries and external calls.
- **Runbooks**: Payment webhook replay, inventory reconciliation script (compare `inventory_movements` vs `inventory_current`), cache flush procedure, feature-flag rollback.
- **Backups/DR**: Automated DB snapshots, PITR; bucket versioning; rehearse restore twice before launch.

### Execution Backlog (Engineer-ready Epics)
1) **Auth & Platform Core**: User/staff models, RBAC guard, JWT/refresh, rate limiting, audit logger, health checks.
2) **Catalog + Media**: Product/variant CRUD, category tree with ltree, collections engine, image upload presigns, search indexes.
3) **Inventory**: Inventory items + ledger endpoints, materialized view + low-stock job, admin alerts UI.
4) **Checkout & Orders**: Cart service, promotions application, checkout workflow, payment intent client, idempotent webhook handler, shipments + invoices PDF.
5) **Customers & Reviews**: Account area, addresses, wishlist, segments exporter, review submission + moderation queue.
6) **Growth Studio**: Profit analytics pipeline, low-margin alerts, reorder velocity calc, bundle recommendations (co-purchase), CEO digest email job, Marketing Copilot provider interface + stub.
7) **CMS & Navigation**: Pages/banners/navigation CRUD, homepage sections manager, theme settings, preview mode for storefront.
8) **Reports & Exports**: Sales/inventory/customer reports APIs, CSV exporter jobs, admin downloads with signed URLs.
9) **Hardening & Launch**: Security review, rate limits tuned, caching strategies, load tests, failover drills, observability dashboards, playbooks.

