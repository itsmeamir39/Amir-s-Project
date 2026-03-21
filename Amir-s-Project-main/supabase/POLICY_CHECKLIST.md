# RLS Policy Test Checklist

Use this checklist after applying migrations.

## Setup

1. Create 3 auth users and matching rows in `public.users`:
   - one `Admin`
   - one `Librarian`
   - one `Patron`
2. Use separate sessions/tokens for each role.
3. Verify each table has RLS enabled:
   - `select relname, relrowsecurity, relforcerowsecurity from pg_class where relname in ('users','loans','fines','holds','engagement','suggestions','circulation_rules','global_settings','audit_logs','items','biblios','reading_history');`

## users

1. Patron can `select` own row, cannot select others.
2. Admin can `select/insert/update/delete` any row.
3. Patron cannot update role.
4. Patron can only self-insert with role `Patron`.

## biblios

1. Authenticated users can `select` biblios.
2. Admin/Librarian can `insert/update/delete`.
3. Patron cannot `insert/update/delete`.

## items

1. Authenticated users can `select` items.
2. Admin/Librarian can `insert/update/delete`.
3. Patron cannot `insert/update/delete`.

## loans

1. Patron can `select` only own loans.
2. Admin/Librarian can `select` all loans.
3. Only Admin/Librarian can `insert/update/delete` loans.

## fines

1. Patron can `select` only own fines.
2. Admin/Librarian can `select` all fines.
3. Admin/Librarian can `insert/update/delete` fines (delete: admin only).
4. Patron can only update own fine status for own rows (used by payment flow).

## holds

1. Patron can `select/insert/update` own holds.
2. Patron cannot modify another user's holds.
3. Admin/Librarian can `select/insert/update/delete` all holds.

## engagement

1. Patron can `select/insert` own engagement rows.
2. Patron cannot update/delete engagement rows.
3. Admin/Librarian can `select/insert/update/delete` all engagement rows.

## suggestions

1. Patron can `select/insert/update` own suggestions.
2. Patron cannot read another user's suggestions.
3. Admin/Librarian can `select/insert/update` all suggestions.
4. Delete is admin-only.

## circulation_rules

1. Authenticated users can `select` rules.
2. Only Admin can `insert/update/delete`.

## global_settings

1. Authenticated users can `select` singleton settings row.
2. Only Admin can `insert/update/delete`.

## audit_logs

1. Admin/Librarian can read all logs.
2. Patron can only read rows where `admin_id = auth.uid()`.
3. Patron insert must set `admin_id = auth.uid()`.
4. Staff can insert logs.
5. Delete is admin-only.

## reading_history

1. Patron can `select` only own rows.
2. Admin/Librarian can `select` all rows.
3. Only Admin/Librarian can `insert/update/delete` rows.

## Regression checks for app endpoints

1. `/api/admin/settings` works for Admin; rejects Librarian/Patron.
2. `/api/admin/users` works for Admin; rejects Librarian/Patron.
3. `/api/librarian/books` works for Librarian/Admin; rejects Patron.
4. `/api/payments/webhook`:
   - Patron can update own fine.
   - Patron cannot update another user's fine.
   - Audit log insert succeeds with `admin_id` set to patron id.
