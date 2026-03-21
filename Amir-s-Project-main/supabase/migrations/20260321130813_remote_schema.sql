drop extension if exists "pg_net";

create sequence "public"."audit_logs_id_seq";

create sequence "public"."biblios_id_seq";

create sequence "public"."circulation_rules_id_seq";

create sequence "public"."engagement_id_seq";

create sequence "public"."fines_id_seq";

create sequence "public"."holds_id_seq";

create sequence "public"."items_id_seq";

create sequence "public"."loans_id_seq";

create sequence "public"."reading_history_id_seq";

create sequence "public"."suggestions_id_seq";

create sequence "public"."transactions_id_seq";


  create table "public"."audit_logs" (
    "id" bigint not null default nextval('public.audit_logs_id_seq'::regclass),
    "admin_id" uuid not null,
    "action_type" text not null,
    "details" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."audit_logs" enable row level security;


  create table "public"."biblios" (
    "id" integer not null default nextval('public.biblios_id_seq'::regclass),
    "isbn" character varying(13),
    "title" text not null,
    "author" text,
    "publisher" text,
    "cover_url" text,
    "description" text
      );


alter table "public"."biblios" enable row level security;


  create table "public"."circulation_rules" (
    "id" integer not null default nextval('public.circulation_rules_id_seq'::regclass),
    "patron_role" character varying(20) not null,
    "max_borrow_limit" integer default 5,
    "loan_period_days" integer default 14,
    "renewal_limit" integer default 2,
    "fine_per_day" numeric(10,2) default 0.50,
    "max_fine_amount" numeric(10,2) default 20.00,
    "grace_period_days" integer
      );


alter table "public"."circulation_rules" enable row level security;


  create table "public"."engagement" (
    "id" bigint not null default nextval('public.engagement_id_seq'::regclass),
    "user_id" uuid not null,
    "biblio_id" bigint not null,
    "type" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."engagement" enable row level security;


  create table "public"."fines" (
    "id" bigint not null default nextval('public.fines_id_seq'::regclass),
    "user_id" uuid not null,
    "amount" numeric(10,2) not null,
    "status" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."fines" enable row level security;


  create table "public"."global_settings" (
    "id" integer not null default 1,
    "maintenance_mode" boolean not null default false,
    "allow_self_registration" boolean not null default true
      );


alter table "public"."global_settings" enable row level security;


  create table "public"."holds" (
    "id" bigint not null default nextval('public.holds_id_seq'::regclass),
    "user_id" uuid not null,
    "biblio_id" bigint not null,
    "status" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."holds" enable row level security;


  create table "public"."items" (
    "id" integer not null default nextval('public.items_id_seq'::regclass),
    "biblio_id" integer,
    "barcode" character varying(50) not null,
    "status" character varying(20) default 'Available'::character varying
      );


alter table "public"."items" enable row level security;


  create table "public"."loans" (
    "id" bigint not null default nextval('public.loans_id_seq'::regclass),
    "user_id" uuid not null,
    "biblio_id" bigint not null,
    "borrowed_at" timestamp with time zone not null default now(),
    "due_date" timestamp with time zone not null,
    "renewals_used" integer not null default 0,
    "status" text not null default 'CheckedOut'::text
      );


alter table "public"."loans" enable row level security;


  create table "public"."reading_history" (
    "id" bigint not null default nextval('public.reading_history_id_seq'::regclass),
    "user_id" uuid not null,
    "biblio_id" bigint not null,
    "borrowed_at" timestamp with time zone not null default now(),
    "returned_at" timestamp with time zone
      );


alter table "public"."reading_history" enable row level security;


  create table "public"."suggestions" (
    "id" bigint not null default nextval('public.suggestions_id_seq'::regclass),
    "user_id" uuid not null,
    "title" text not null,
    "author" text,
    "reason" text,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."suggestions" enable row level security;


  create table "public"."transactions" (
    "id" integer not null default nextval('public.transactions_id_seq'::regclass),
    "item_id" integer,
    "patron_id" uuid,
    "issue_date" timestamp with time zone default now(),
    "due_date" timestamp with time zone not null,
    "return_date" timestamp with time zone,
    "fine_paid" numeric(10,2) default 0.00
      );


alter table "public"."transactions" enable row level security;


  create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" character varying(100),
    "role" character varying(20) not null,
    "email" character varying(100),
    "password_hash" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."users" enable row level security;

alter sequence "public"."audit_logs_id_seq" owned by "public"."audit_logs"."id";

alter sequence "public"."biblios_id_seq" owned by "public"."biblios"."id";

alter sequence "public"."circulation_rules_id_seq" owned by "public"."circulation_rules"."id";

alter sequence "public"."engagement_id_seq" owned by "public"."engagement"."id";

alter sequence "public"."fines_id_seq" owned by "public"."fines"."id";

alter sequence "public"."holds_id_seq" owned by "public"."holds"."id";

alter sequence "public"."items_id_seq" owned by "public"."items"."id";

alter sequence "public"."loans_id_seq" owned by "public"."loans"."id";

alter sequence "public"."reading_history_id_seq" owned by "public"."reading_history"."id";

alter sequence "public"."suggestions_id_seq" owned by "public"."suggestions"."id";

alter sequence "public"."transactions_id_seq" owned by "public"."transactions"."id";

CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id);

CREATE INDEX biblios_author_idx ON public.biblios USING gin (to_tsvector('simple'::regconfig, COALESCE(author, ''::text)));

CREATE UNIQUE INDEX biblios_isbn_key ON public.biblios USING btree (isbn);

CREATE UNIQUE INDEX biblios_pkey ON public.biblios USING btree (id);

CREATE INDEX biblios_title_idx ON public.biblios USING gin (to_tsvector('simple'::regconfig, title));

CREATE UNIQUE INDEX circulation_rules_pkey ON public.circulation_rules USING btree (id);

CREATE UNIQUE INDEX engagement_pkey ON public.engagement USING btree (id);

CREATE UNIQUE INDEX fines_pkey ON public.fines USING btree (id);

CREATE UNIQUE INDEX global_settings_pkey ON public.global_settings USING btree (id);

CREATE UNIQUE INDEX holds_pkey ON public.holds USING btree (id);

CREATE INDEX idx_fines_status ON public.fines USING btree (status);

CREATE INDEX idx_fines_user ON public.fines USING btree (user_id);

CREATE INDEX idx_history_biblio ON public.reading_history USING btree (biblio_id);

CREATE INDEX idx_history_user ON public.reading_history USING btree (user_id);

CREATE INDEX idx_holds_biblio ON public.holds USING btree (biblio_id);

CREATE INDEX idx_holds_user ON public.holds USING btree (user_id);

CREATE INDEX idx_loans_biblio ON public.loans USING btree (biblio_id);

CREATE INDEX idx_loans_status ON public.loans USING btree (status);

CREATE INDEX idx_loans_user ON public.loans USING btree (user_id);

CREATE INDEX idx_suggestions_user ON public.suggestions USING btree (user_id);

CREATE UNIQUE INDEX items_barcode_key ON public.items USING btree (barcode);

CREATE INDEX items_biblio_id_idx ON public.items USING btree (biblio_id);

CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);

CREATE UNIQUE INDEX loans_pkey ON public.loans USING btree (id);

CREATE UNIQUE INDEX reading_history_pkey ON public.reading_history USING btree (id);

CREATE UNIQUE INDEX suggestions_pkey ON public.suggestions USING btree (id);

CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."biblios" add constraint "biblios_pkey" PRIMARY KEY using index "biblios_pkey";

alter table "public"."circulation_rules" add constraint "circulation_rules_pkey" PRIMARY KEY using index "circulation_rules_pkey";

alter table "public"."engagement" add constraint "engagement_pkey" PRIMARY KEY using index "engagement_pkey";

alter table "public"."fines" add constraint "fines_pkey" PRIMARY KEY using index "fines_pkey";

alter table "public"."global_settings" add constraint "global_settings_pkey" PRIMARY KEY using index "global_settings_pkey";

alter table "public"."holds" add constraint "holds_pkey" PRIMARY KEY using index "holds_pkey";

alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";

alter table "public"."loans" add constraint "loans_pkey" PRIMARY KEY using index "loans_pkey";

alter table "public"."reading_history" add constraint "reading_history_pkey" PRIMARY KEY using index "reading_history_pkey";

alter table "public"."suggestions" add constraint "suggestions_pkey" PRIMARY KEY using index "suggestions_pkey";

alter table "public"."transactions" add constraint "transactions_pkey" PRIMARY KEY using index "transactions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_admin_id_fkey";

alter table "public"."biblios" add constraint "biblios_isbn_key" UNIQUE using index "biblios_isbn_key";

alter table "public"."engagement" add constraint "engagement_biblio_id_fkey" FOREIGN KEY (biblio_id) REFERENCES public.biblios(id) ON DELETE CASCADE not valid;

alter table "public"."engagement" validate constraint "engagement_biblio_id_fkey";

alter table "public"."engagement" add constraint "engagement_type_check" CHECK ((type = 'Reservation'::text)) not valid;

alter table "public"."engagement" validate constraint "engagement_type_check";

alter table "public"."engagement" add constraint "engagement_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."engagement" validate constraint "engagement_user_id_fkey";

alter table "public"."fines" add constraint "fines_status_check" CHECK ((status = ANY (ARRAY['Unpaid'::text, 'Paid'::text, 'Waived'::text]))) not valid;

alter table "public"."fines" validate constraint "fines_status_check";

alter table "public"."fines" add constraint "fines_user_fk" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."fines" validate constraint "fines_user_fk";

alter table "public"."global_settings" add constraint "global_settings_id_check" CHECK ((id = 1)) not valid;

alter table "public"."global_settings" validate constraint "global_settings_id_check";

alter table "public"."holds" add constraint "holds_biblio_id_fkey" FOREIGN KEY (biblio_id) REFERENCES public.biblios(id) ON DELETE CASCADE not valid;

alter table "public"."holds" validate constraint "holds_biblio_id_fkey";

alter table "public"."holds" add constraint "holds_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'ready'::text, 'collected'::text]))) not valid;

alter table "public"."holds" validate constraint "holds_status_check";

alter table "public"."holds" add constraint "holds_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."holds" validate constraint "holds_user_id_fkey";

alter table "public"."items" add constraint "items_barcode_key" UNIQUE using index "items_barcode_key";

alter table "public"."items" add constraint "items_biblio_id_fkey" FOREIGN KEY (biblio_id) REFERENCES public.biblios(id) ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "items_biblio_id_fkey";

alter table "public"."items" add constraint "items_status_check" CHECK (((status)::text = ANY ((ARRAY['Available'::character varying, 'Checked Out'::character varying, 'Damaged'::character varying, 'Lost'::character varying])::text[]))) not valid;

alter table "public"."items" validate constraint "items_status_check";

alter table "public"."loans" add constraint "loans_biblio_id_fkey" FOREIGN KEY (biblio_id) REFERENCES public.biblios(id) ON DELETE CASCADE not valid;

alter table "public"."loans" validate constraint "loans_biblio_id_fkey";

alter table "public"."loans" add constraint "loans_status_check" CHECK ((status = ANY (ARRAY['CheckedOut'::text, 'Returned'::text]))) not valid;

alter table "public"."loans" validate constraint "loans_status_check";

alter table "public"."loans" add constraint "loans_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."loans" validate constraint "loans_user_id_fkey";

alter table "public"."reading_history" add constraint "reading_history_biblio_id_fkey" FOREIGN KEY (biblio_id) REFERENCES public.biblios(id) ON DELETE CASCADE not valid;

alter table "public"."reading_history" validate constraint "reading_history_biblio_id_fkey";

alter table "public"."reading_history" add constraint "reading_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."reading_history" validate constraint "reading_history_user_id_fkey";

alter table "public"."suggestions" add constraint "suggestions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'accepted'::text, 'rejected'::text]))) not valid;

alter table "public"."suggestions" validate constraint "suggestions_status_check";

alter table "public"."suggestions" add constraint "suggestions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."suggestions" validate constraint "suggestions_user_id_fkey";

alter table "public"."transactions" add constraint "transactions_item_id_fkey" FOREIGN KEY (item_id) REFERENCES public.items(id) not valid;

alter table "public"."transactions" validate constraint "transactions_item_id_fkey";

alter table "public"."transactions" add constraint "transactions_patron_id_fkey" FOREIGN KEY (patron_id) REFERENCES public.users(id) not valid;

alter table "public"."transactions" validate constraint "transactions_patron_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_role_check" CHECK (((role)::text = ANY ((ARRAY['Admin'::character varying, 'Librarian'::character varying, 'Patron'::character varying])::text[]))) not valid;

alter table "public"."users" validate constraint "users_role_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
begin
  insert into public.users (id, role)
  values (new.id, 'Patron')
  on conflict (id) do nothing;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'Admin'
  );
$function$
;

grant delete on table "public"."audit_logs" to "anon";

grant insert on table "public"."audit_logs" to "anon";

grant references on table "public"."audit_logs" to "anon";

grant select on table "public"."audit_logs" to "anon";

grant trigger on table "public"."audit_logs" to "anon";

grant truncate on table "public"."audit_logs" to "anon";

grant update on table "public"."audit_logs" to "anon";

grant delete on table "public"."audit_logs" to "authenticated";

grant insert on table "public"."audit_logs" to "authenticated";

grant references on table "public"."audit_logs" to "authenticated";

grant select on table "public"."audit_logs" to "authenticated";

grant trigger on table "public"."audit_logs" to "authenticated";

grant truncate on table "public"."audit_logs" to "authenticated";

grant update on table "public"."audit_logs" to "authenticated";

grant delete on table "public"."audit_logs" to "service_role";

grant insert on table "public"."audit_logs" to "service_role";

grant references on table "public"."audit_logs" to "service_role";

grant select on table "public"."audit_logs" to "service_role";

grant trigger on table "public"."audit_logs" to "service_role";

grant truncate on table "public"."audit_logs" to "service_role";

grant update on table "public"."audit_logs" to "service_role";

grant delete on table "public"."biblios" to "anon";

grant insert on table "public"."biblios" to "anon";

grant references on table "public"."biblios" to "anon";

grant select on table "public"."biblios" to "anon";

grant trigger on table "public"."biblios" to "anon";

grant truncate on table "public"."biblios" to "anon";

grant update on table "public"."biblios" to "anon";

grant delete on table "public"."biblios" to "authenticated";

grant insert on table "public"."biblios" to "authenticated";

grant references on table "public"."biblios" to "authenticated";

grant select on table "public"."biblios" to "authenticated";

grant trigger on table "public"."biblios" to "authenticated";

grant truncate on table "public"."biblios" to "authenticated";

grant update on table "public"."biblios" to "authenticated";

grant delete on table "public"."biblios" to "service_role";

grant insert on table "public"."biblios" to "service_role";

grant references on table "public"."biblios" to "service_role";

grant select on table "public"."biblios" to "service_role";

grant trigger on table "public"."biblios" to "service_role";

grant truncate on table "public"."biblios" to "service_role";

grant update on table "public"."biblios" to "service_role";

grant delete on table "public"."circulation_rules" to "anon";

grant insert on table "public"."circulation_rules" to "anon";

grant references on table "public"."circulation_rules" to "anon";

grant select on table "public"."circulation_rules" to "anon";

grant trigger on table "public"."circulation_rules" to "anon";

grant truncate on table "public"."circulation_rules" to "anon";

grant update on table "public"."circulation_rules" to "anon";

grant delete on table "public"."circulation_rules" to "authenticated";

grant insert on table "public"."circulation_rules" to "authenticated";

grant references on table "public"."circulation_rules" to "authenticated";

grant select on table "public"."circulation_rules" to "authenticated";

grant trigger on table "public"."circulation_rules" to "authenticated";

grant truncate on table "public"."circulation_rules" to "authenticated";

grant update on table "public"."circulation_rules" to "authenticated";

grant delete on table "public"."circulation_rules" to "service_role";

grant insert on table "public"."circulation_rules" to "service_role";

grant references on table "public"."circulation_rules" to "service_role";

grant select on table "public"."circulation_rules" to "service_role";

grant trigger on table "public"."circulation_rules" to "service_role";

grant truncate on table "public"."circulation_rules" to "service_role";

grant update on table "public"."circulation_rules" to "service_role";

grant delete on table "public"."engagement" to "anon";

grant insert on table "public"."engagement" to "anon";

grant references on table "public"."engagement" to "anon";

grant select on table "public"."engagement" to "anon";

grant trigger on table "public"."engagement" to "anon";

grant truncate on table "public"."engagement" to "anon";

grant update on table "public"."engagement" to "anon";

grant delete on table "public"."engagement" to "authenticated";

grant insert on table "public"."engagement" to "authenticated";

grant references on table "public"."engagement" to "authenticated";

grant select on table "public"."engagement" to "authenticated";

grant trigger on table "public"."engagement" to "authenticated";

grant truncate on table "public"."engagement" to "authenticated";

grant update on table "public"."engagement" to "authenticated";

grant delete on table "public"."engagement" to "service_role";

grant insert on table "public"."engagement" to "service_role";

grant references on table "public"."engagement" to "service_role";

grant select on table "public"."engagement" to "service_role";

grant trigger on table "public"."engagement" to "service_role";

grant truncate on table "public"."engagement" to "service_role";

grant update on table "public"."engagement" to "service_role";

grant delete on table "public"."fines" to "anon";

grant insert on table "public"."fines" to "anon";

grant references on table "public"."fines" to "anon";

grant select on table "public"."fines" to "anon";

grant trigger on table "public"."fines" to "anon";

grant truncate on table "public"."fines" to "anon";

grant update on table "public"."fines" to "anon";

grant delete on table "public"."fines" to "authenticated";

grant insert on table "public"."fines" to "authenticated";

grant references on table "public"."fines" to "authenticated";

grant select on table "public"."fines" to "authenticated";

grant trigger on table "public"."fines" to "authenticated";

grant truncate on table "public"."fines" to "authenticated";

grant update on table "public"."fines" to "authenticated";

grant delete on table "public"."fines" to "service_role";

grant insert on table "public"."fines" to "service_role";

grant references on table "public"."fines" to "service_role";

grant select on table "public"."fines" to "service_role";

grant trigger on table "public"."fines" to "service_role";

grant truncate on table "public"."fines" to "service_role";

grant update on table "public"."fines" to "service_role";

grant delete on table "public"."global_settings" to "anon";

grant insert on table "public"."global_settings" to "anon";

grant references on table "public"."global_settings" to "anon";

grant select on table "public"."global_settings" to "anon";

grant trigger on table "public"."global_settings" to "anon";

grant truncate on table "public"."global_settings" to "anon";

grant update on table "public"."global_settings" to "anon";

grant delete on table "public"."global_settings" to "authenticated";

grant insert on table "public"."global_settings" to "authenticated";

grant references on table "public"."global_settings" to "authenticated";

grant select on table "public"."global_settings" to "authenticated";

grant trigger on table "public"."global_settings" to "authenticated";

grant truncate on table "public"."global_settings" to "authenticated";

grant update on table "public"."global_settings" to "authenticated";

grant delete on table "public"."global_settings" to "service_role";

grant insert on table "public"."global_settings" to "service_role";

grant references on table "public"."global_settings" to "service_role";

grant select on table "public"."global_settings" to "service_role";

grant trigger on table "public"."global_settings" to "service_role";

grant truncate on table "public"."global_settings" to "service_role";

grant update on table "public"."global_settings" to "service_role";

grant delete on table "public"."holds" to "anon";

grant insert on table "public"."holds" to "anon";

grant references on table "public"."holds" to "anon";

grant select on table "public"."holds" to "anon";

grant trigger on table "public"."holds" to "anon";

grant truncate on table "public"."holds" to "anon";

grant update on table "public"."holds" to "anon";

grant delete on table "public"."holds" to "authenticated";

grant insert on table "public"."holds" to "authenticated";

grant references on table "public"."holds" to "authenticated";

grant select on table "public"."holds" to "authenticated";

grant trigger on table "public"."holds" to "authenticated";

grant truncate on table "public"."holds" to "authenticated";

grant update on table "public"."holds" to "authenticated";

grant delete on table "public"."holds" to "service_role";

grant insert on table "public"."holds" to "service_role";

grant references on table "public"."holds" to "service_role";

grant select on table "public"."holds" to "service_role";

grant trigger on table "public"."holds" to "service_role";

grant truncate on table "public"."holds" to "service_role";

grant update on table "public"."holds" to "service_role";

grant delete on table "public"."items" to "anon";

grant insert on table "public"."items" to "anon";

grant references on table "public"."items" to "anon";

grant select on table "public"."items" to "anon";

grant trigger on table "public"."items" to "anon";

grant truncate on table "public"."items" to "anon";

grant update on table "public"."items" to "anon";

grant delete on table "public"."items" to "authenticated";

grant insert on table "public"."items" to "authenticated";

grant references on table "public"."items" to "authenticated";

grant select on table "public"."items" to "authenticated";

grant trigger on table "public"."items" to "authenticated";

grant truncate on table "public"."items" to "authenticated";

grant update on table "public"."items" to "authenticated";

grant delete on table "public"."items" to "service_role";

grant insert on table "public"."items" to "service_role";

grant references on table "public"."items" to "service_role";

grant select on table "public"."items" to "service_role";

grant trigger on table "public"."items" to "service_role";

grant truncate on table "public"."items" to "service_role";

grant update on table "public"."items" to "service_role";

grant delete on table "public"."loans" to "anon";

grant insert on table "public"."loans" to "anon";

grant references on table "public"."loans" to "anon";

grant select on table "public"."loans" to "anon";

grant trigger on table "public"."loans" to "anon";

grant truncate on table "public"."loans" to "anon";

grant update on table "public"."loans" to "anon";

grant delete on table "public"."loans" to "authenticated";

grant insert on table "public"."loans" to "authenticated";

grant references on table "public"."loans" to "authenticated";

grant select on table "public"."loans" to "authenticated";

grant trigger on table "public"."loans" to "authenticated";

grant truncate on table "public"."loans" to "authenticated";

grant update on table "public"."loans" to "authenticated";

grant delete on table "public"."loans" to "service_role";

grant insert on table "public"."loans" to "service_role";

grant references on table "public"."loans" to "service_role";

grant select on table "public"."loans" to "service_role";

grant trigger on table "public"."loans" to "service_role";

grant truncate on table "public"."loans" to "service_role";

grant update on table "public"."loans" to "service_role";

grant delete on table "public"."reading_history" to "anon";

grant insert on table "public"."reading_history" to "anon";

grant references on table "public"."reading_history" to "anon";

grant select on table "public"."reading_history" to "anon";

grant trigger on table "public"."reading_history" to "anon";

grant truncate on table "public"."reading_history" to "anon";

grant update on table "public"."reading_history" to "anon";

grant delete on table "public"."reading_history" to "authenticated";

grant insert on table "public"."reading_history" to "authenticated";

grant references on table "public"."reading_history" to "authenticated";

grant select on table "public"."reading_history" to "authenticated";

grant trigger on table "public"."reading_history" to "authenticated";

grant truncate on table "public"."reading_history" to "authenticated";

grant update on table "public"."reading_history" to "authenticated";

grant delete on table "public"."reading_history" to "service_role";

grant insert on table "public"."reading_history" to "service_role";

grant references on table "public"."reading_history" to "service_role";

grant select on table "public"."reading_history" to "service_role";

grant trigger on table "public"."reading_history" to "service_role";

grant truncate on table "public"."reading_history" to "service_role";

grant update on table "public"."reading_history" to "service_role";

grant delete on table "public"."suggestions" to "anon";

grant insert on table "public"."suggestions" to "anon";

grant references on table "public"."suggestions" to "anon";

grant select on table "public"."suggestions" to "anon";

grant trigger on table "public"."suggestions" to "anon";

grant truncate on table "public"."suggestions" to "anon";

grant update on table "public"."suggestions" to "anon";

grant delete on table "public"."suggestions" to "authenticated";

grant insert on table "public"."suggestions" to "authenticated";

grant references on table "public"."suggestions" to "authenticated";

grant select on table "public"."suggestions" to "authenticated";

grant trigger on table "public"."suggestions" to "authenticated";

grant truncate on table "public"."suggestions" to "authenticated";

grant update on table "public"."suggestions" to "authenticated";

grant delete on table "public"."suggestions" to "service_role";

grant insert on table "public"."suggestions" to "service_role";

grant references on table "public"."suggestions" to "service_role";

grant select on table "public"."suggestions" to "service_role";

grant trigger on table "public"."suggestions" to "service_role";

grant truncate on table "public"."suggestions" to "service_role";

grant update on table "public"."suggestions" to "service_role";

grant delete on table "public"."transactions" to "anon";

grant insert on table "public"."transactions" to "anon";

grant references on table "public"."transactions" to "anon";

grant select on table "public"."transactions" to "anon";

grant trigger on table "public"."transactions" to "anon";

grant truncate on table "public"."transactions" to "anon";

grant update on table "public"."transactions" to "anon";

grant delete on table "public"."transactions" to "authenticated";

grant insert on table "public"."transactions" to "authenticated";

grant references on table "public"."transactions" to "authenticated";

grant select on table "public"."transactions" to "authenticated";

grant trigger on table "public"."transactions" to "authenticated";

grant truncate on table "public"."transactions" to "authenticated";

grant update on table "public"."transactions" to "authenticated";

grant delete on table "public"."transactions" to "service_role";

grant insert on table "public"."transactions" to "service_role";

grant references on table "public"."transactions" to "service_role";

grant select on table "public"."transactions" to "service_role";

grant trigger on table "public"."transactions" to "service_role";

grant truncate on table "public"."transactions" to "service_role";

grant update on table "public"."transactions" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "biblios_delete"
  on "public"."biblios"
  as permissive
  for delete
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "biblios_insert"
  on "public"."biblios"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "biblios_read"
  on "public"."biblios"
  as permissive
  for select
  to authenticated
using (true);



  create policy "biblios_update"
  on "public"."biblios"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))))
with check ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "fines_read"
  on "public"."fines"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "fines_write"
  on "public"."fines"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))))
with check ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "items_read"
  on "public"."items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "items_write"
  on "public"."items"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))))
with check ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "loans_read"
  on "public"."loans"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "loans_write"
  on "public"."loans"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))))
with check ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "suggestions_insert"
  on "public"."suggestions"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "suggestions_read"
  on "public"."suggestions"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'Librarian'::text))))));



  create policy "users_admin_all"
  on "public"."users"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "users_read"
  on "public"."users"
  as permissive
  for select
  to authenticated
using (((id = auth.uid()) OR public.is_admin()));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


