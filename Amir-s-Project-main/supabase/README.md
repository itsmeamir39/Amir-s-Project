# Supabase (Project-local)

This folder contains versioned database artifacts for the app.

## Files

- `migrations/202603210001_init_schema_and_rls.sql`
  - schema
  - constraints
  - indexes
  - default seed rows
  - row-level security (RLS) policies
- `POLICY_CHECKLIST.md`
  - role-based test matrix

## Apply migrations

```bash
supabase db reset
```

or for linked projects:

```bash
supabase db push
```

## Regenerate TypeScript types from real schema

After migrations are applied against your actual project DB, regenerate and commit types:

```bash
supabase gen types typescript --linked --schema public > types/database.types.ts
```

Then update any exports/imports that still reference older type files.
