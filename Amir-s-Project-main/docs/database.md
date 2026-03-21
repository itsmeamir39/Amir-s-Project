# Database Documentation

This directory contains database migration and seeding info for the project.

## Supabase
- `supabase/config.toml` – Supabase CLI project configuration.
- `supabase/migrations/` – SQL migration scripts.
- `supabase/seed/` – seed scripts/data to initialize the database.

## Types
- `types/supabase.ts` – Supabase type definitions for app and generated DB schema.

## Usage
1. Install and configure Supabase CLI.
2. Run migrations:
   ```bash
   supabase db push
   ```
3. Run seed scripts from `supabase/seed`.
