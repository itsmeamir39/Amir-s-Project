# Techstack.md

## Technology Stack (Implemented)

### Application Framework
- Next.js 14 (App Router)
- React 18
- TypeScript (strict mode)

### UI and UX
- Tailwind CSS
- Radix UI primitives + shadcn-style component layer
- Lucide icons
- Sonner toast notifications

### Data and Backend
- Supabase Postgres
- Supabase Auth helpers for Next.js route handlers
- Row Level Security (RLS) policies and role-based access checks

### Validation and Contracts
- Zod for API payload validation
- Shared TypeScript database and domain types in types/

### Query and State Strategy
- TanStack React Query is the adopted client data layer for interactive flows
- Current adopted usage includes patron catalog search, hold state, and reserve mutations
- Hook modules:
  - hooks/useCatalog.ts
  - hooks/useLoans.ts
  - hooks/useFines.ts

### APIs and Services
- Next.js route handlers under app/api/
- Key operational routes:
  - /api/admin/settings
  - /api/admin/users
  - /api/librarian/books
  - /api/payments/checkout
  - /api/payments/webhook

### Financial Processing Architecture
- Checkout endpoint initiates payment intent/context
- Webhook endpoint verifies HMAC signature
- Idempotency enforced using event IDs stored in audit_logs.action_type
- Fine status updates are webhook-driven, not direct client writes

### Database Patterns
- Trigger-based updated_at maintenance
- Transactional RPC for atomic biblio+item creation
- Indexed search and operational tables for circulation and analytics summaries

### Testing and Quality
- Vitest configured for integration-style service and route coverage
- Integration journey coverage targets:
  - auth role/user resolution
  - reserve flow validation + hold insertion
  - renew flow rule enforcement and due-date update
  - pay flow checkout request contract
  - admin settings payload validation

### Deployment
- Frontend and route handlers: Vercel-compatible Next.js deployment
- Backend services: Supabase

### Required Runtime Configuration
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- PAYMENT_WEBHOOK_SECRET (required for signed callback simulation and production webhook verification)
