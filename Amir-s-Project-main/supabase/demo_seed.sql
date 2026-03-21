-- Optional demo seed for a database that already has schema applied.
-- This script assumes these auth users already exist in auth.users:
--   admin@library.local, librarian@library.local, patron@library.local
--
-- Run after supabase/full_schema_seed.sql.
-- Safe to re-run.

-- 1) Ensure public.users role rows exist for known auth users.
insert into public.users (id, role)
select au.id, 'Admin'
from auth.users au
where lower(au.email) = 'admin@library.local'
on conflict (id) do update set role = excluded.role;

insert into public.users (id, role)
select au.id, 'Librarian'
from auth.users au
where lower(au.email) = 'librarian@library.local'
on conflict (id) do update set role = excluded.role;

insert into public.users (id, role)
select au.id, 'Patron'
from auth.users au
where lower(au.email) = 'patron@library.local'
on conflict (id) do update set role = excluded.role;

-- 2) Seed sample transactions for the demo patron.
with
patron as (
  select id from auth.users where lower(email) = 'patron@library.local' limit 1
),
book_clean_code as (
  select id from public.biblios where isbn = '9780132350884' limit 1
),
book_ddia as (
  select id from public.biblios where isbn = '9781449373320' limit 1
),
book_refactoring as (
  select id from public.biblios where isbn = '9780134757599' limit 1
)
insert into public.loans (user_id, biblio_id, borrowed_at, due_date, renewals_used, status)
select p.id, b.id, now() - interval '7 days', now() + interval '7 days', 1, 'CheckedOut'
from patron p
cross join book_clean_code b
where not exists (
  select 1
  from public.loans l
  where l.user_id = p.id and l.biblio_id = b.id and l.status = 'CheckedOut'
);

with
patron as (
  select id from auth.users where lower(email) = 'patron@library.local' limit 1
),
book_ddia as (
  select id from public.biblios where isbn = '9781449373320' limit 1
)
insert into public.loans (user_id, biblio_id, borrowed_at, due_date, renewals_used, status)
select p.id, b.id, now() - interval '30 days', now() - interval '5 days', 0, 'Overdue'
from patron p
cross join book_ddia b
where not exists (
  select 1
  from public.loans l
  where l.user_id = p.id and l.biblio_id = b.id and l.status = 'Overdue'
);

with
patron as (
  select id from auth.users where lower(email) = 'patron@library.local' limit 1
),
book_refactoring as (
  select id from public.biblios where isbn = '9780134757599' limit 1
)
insert into public.holds (user_id, biblio_id, status)
select p.id, b.id, 'pending'
from patron p
cross join book_refactoring b
where not exists (
  select 1
  from public.holds h
  where h.user_id = p.id and h.biblio_id = b.id and h.status = 'pending'
);

with patron as (
  select id from auth.users where lower(email) = 'patron@library.local' limit 1
)
insert into public.fines (user_id, amount, status)
select p.id, 4.50, 'Unpaid'
from patron p
where not exists (
  select 1 from public.fines f where f.user_id = p.id and f.amount = 4.50 and f.status = 'Unpaid'
);

with patron as (
  select id from auth.users where lower(email) = 'patron@library.local' limit 1
)
insert into public.fines (user_id, amount, status)
select p.id, 2.00, 'Paid'
from patron p
where not exists (
  select 1 from public.fines f where f.user_id = p.id and f.amount = 2.00 and f.status = 'Paid'
);

with patron as (
  select id from auth.users where lower(email) = 'patron@library.local' limit 1
)
insert into public.suggestions (user_id, title, author, reason, status)
select p.id, 'The Pragmatic Programmer', 'Andy Hunt; Dave Thomas', 'Classic software engineering reference.', 'pending'
from patron p
where not exists (
  select 1
  from public.suggestions s
  where s.user_id = p.id and s.title = 'The Pragmatic Programmer'
);

-- 3) Seed sample admin/librarian audit log events when users exist.
with
admin_user as (
  select id from auth.users where lower(email) = 'admin@library.local' limit 1
),
librarian_user as (
  select id from auth.users where lower(email) = 'librarian@library.local' limit 1
)
insert into public.audit_logs (actor, action, details, admin_id, action_type)
select 'seed-script', 'SEED_APPLIED', 'Demo seed script applied', a.id, 'demo_seed_v1'
from admin_user a
where not exists (
  select 1 from public.audit_logs al where al.action_type = 'demo_seed_v1'
);

with librarian_user as (
  select id from auth.users where lower(email) = 'librarian@library.local' limit 1
)
insert into public.audit_logs (actor, action, details, admin_id, action_type)
select 'librarian', 'CATALOG_REVIEW', 'Demo catalog reviewed', l.id, 'demo_catalog_review_v1'
from librarian_user l
where not exists (
  select 1 from public.audit_logs al where al.action_type = 'demo_catalog_review_v1'
);
