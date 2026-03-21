# PLAN.md

## Library Management System Implementation Plan

### Current Baseline (March 2026)
- Framework: Next.js 14 App Router + TypeScript strict mode
- Backend: Supabase Postgres + Supabase Auth + RLS
- UI: Tailwind + Radix/shadcn-style components
- Data model in use: users, biblios, items, loans, fines, holds, suggestions, circulation_rules, global_settings, audit_logs, reading_history

### Delivery Phases

#### Phase 1: Foundation and Security
- Completed: Supabase schema migration, indexes, triggers, and core RLS policies
- Completed: Role model (Admin, Librarian, Patron) and route protection middleware
- Completed: Shared types and service-layer wrappers for Supabase data access

#### Phase 2: Core Product Flows
- Completed: Login, role routing, and password recovery/update mode
- Completed: Catalog search and reservations/holds
- Completed: Patron books, history, reservations, suggestions, and fines/payments views
- Completed: Admin and librarian dashboard modules, users, settings, add-book

#### Phase 3: Financial and Transaction Hardening
- Completed: Payment checkout route and signed webhook processing
- Completed: Idempotency tracking via audit_logs action_type event markers
- Completed: Atomic add-book flow via create_biblio_with_item RPC

#### Phase 4: UI Consistency and Navigation
- Completed: React Router leftovers migrated to Next.js navigation
- Completed: Sidebar option parity and overflow/visibility fixes
- Completed: Catch-all module pages replaced with live table/summary views

#### Phase 5: Quality, Consistency, Launch Readiness (P2)
- Completed: Adopted React Query hooks in patron search flow (catalog + hold state + reserve mutation)
- Completed: Hook wrappers updated for nullable clients and server-backed payment flow
- Completed: Added integration test harness with Vitest and critical journey coverage skeleton
- Completed: Documentation reconciled with actual schema, statuses, and payment architecture
- Remaining before launch:
  - Run test suite in CI/runtime environment where Node/npm is available
  - Add browser E2E smoke tests for role journeys
  - Verify production env vars for webhook signature and Supabase keys

### Launch Readiness Checklist
- [x] RLS enabled and forced on core tables
- [x] Role-gated admin/librarian API routes
- [x] Checkout + webhook verification path
- [x] Audit logging for sensitive operations
- [x] Client-side error surfaces show backend messages
- [ ] CI test execution green
- [ ] Production secrets validated
- [ ] Manual UAT signoff across Admin/Librarian/Patron
