# PRD.md

## Product Requirements Document

### Product
Library Management System (LMS)

### Scope
A role-based web application for Admin, Librarian, and Patron users to manage catalog, circulation, reservations, suggestions, and fines with auditable state changes.

### Roles and Access
- Admin: user/role management, circulation settings, analytics/reporting views, audit review
- Librarian: add books, issue/return workflows, catalog maintenance, reservations and suggestions operations
- Patron: search, reserve, view loans/history, submit suggestions, view/pay fines

### Functional Requirements (Implemented)
- Authentication:
  - Supabase email/password sign-in
  - session-aware role resolution from public.users
  - password recovery/update mode in login flow
- Catalog and circulation:
  - search by title/author/isbn
  - reservation holds with server-side circulation-rule validation
  - current loans, server-routed renewal flow, return status handling
- Financials:
  - fine visibility and totals
  - checkout endpoint to initiate payment
  - signed webhook endpoint to finalize payment and mark fines as paid
  - idempotent webhook processing via event IDs in audit logs
- Patron API boundary:
  - suggestions submit/list via role-gated API routes
  - reservation create/cancel via role-gated API routes
- Admin settings:
  - read/update circulation_rules and global_settings
  - admin users API for role records
- Librarian add-book:
  - atomic biblio+item creation via database RPC
  - duplicate ISBN/barcode error normalization

### Data Model (Current Schema)
- users(id, role, created_at)
- biblios(id, title, author, isbn, description, cover_url, publisher, created_at, updated_at)
- items(id, biblio_id, barcode, status, created_at, updated_at)
- loans(id, user_id, biblio_id, borrowed_at, due_date, renewals_used, status, created_at, updated_at)
- fines(id, user_id, amount, status, created_at, updated_at)
- holds(id, user_id, biblio_id, status, created_at, updated_at)
- suggestions(id, user_id, title, author, reason, status, created_at, updated_at)
- circulation_rules(...)
- global_settings(...)
- audit_logs(id, actor, action, details, admin_id, action_type, created_at)
- reading_history(...)

### Status Values (Authoritative)
- loans.status: CheckedOut, Returned, Overdue
- fines.status: Unpaid, Paid, Waived
- holds.status: pending, ready, completed, cancelled, expired
- suggestions.status: pending, approved, rejected
- items.status: available, checked_out, reserved, lost, damaged

### Non-Functional Requirements
- Security:
  - RLS enabled and forced on core public tables
  - role-gated server routes for privileged operations
  - payment webhook signature verification
- Reliability:
  - idempotent payment event handling
  - transactional add-book path through RPC
- Observability:
  - audit entries for financial and administrative state changes

### Known Gaps / Next Requirements
- Add end-to-end test automation for multi-role browser journeys
- Expand analytics/reporting depth beyond summary tables
- Add explicit notifications channel if product requires in-app/email delivery
