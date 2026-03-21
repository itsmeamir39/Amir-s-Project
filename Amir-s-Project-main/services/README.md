This folder contains client-side/service-layer functions that wrap data access
and business logic (e.g. Supabase queries, external APIs like Google Books).

Pages/components should prefer calling `services/*` rather than embedding query
logic directly, to keep UI code clean and reusable.

