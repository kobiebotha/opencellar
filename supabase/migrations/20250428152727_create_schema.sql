create type "public"."drink_reason" as enum ('gifted', 'missing', 'drank from cellar', 'sold');

create type "public"."wine_type" as enum ('red', 'white', 'dessert');

create table "public"."bins" (
    "id" uuid not null default gen_random_uuid(),
    "storage_location_id" uuid not null,
    "name" text not null
);


create table "public"."drink_log" (
    "id" uuid not null default gen_random_uuid(),
    "wine_id" uuid not null,
    "drank_at" timestamp with time zone default now(),
    "reason" drink_reason not null
);


create table "public"."storage_locations" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null
);


create table "public"."wines" (
    "id" uuid not null default gen_random_uuid(),
    "bin_id" uuid not null,
    "count" integer not null,
    "name" text not null,
    "vintage" integer not null,
    "drink_between" daterange not null
);


CREATE UNIQUE INDEX bins_pkey ON public.bins USING btree (id);

CREATE UNIQUE INDEX drink_log_pkey ON public.drink_log USING btree (id);

CREATE UNIQUE INDEX storage_locations_pkey ON public.storage_locations USING btree (id);

CREATE UNIQUE INDEX wines_pkey ON public.wines USING btree (id);

alter table "public"."bins" add constraint "bins_pkey" PRIMARY KEY using index "bins_pkey";

alter table "public"."drink_log" add constraint "drink_log_pkey" PRIMARY KEY using index "drink_log_pkey";

alter table "public"."storage_locations" add constraint "storage_locations_pkey" PRIMARY KEY using index "storage_locations_pkey";

alter table "public"."wines" add constraint "wines_pkey" PRIMARY KEY using index "wines_pkey";

alter table "public"."bins" add constraint "bins_storage_location_id_fkey" FOREIGN KEY (storage_location_id) REFERENCES storage_locations(id) not valid;

alter table "public"."bins" validate constraint "bins_storage_location_id_fkey";

alter table "public"."drink_log" add constraint "drink_log_wine_id_fkey" FOREIGN KEY (wine_id) REFERENCES wines(id) not valid;

alter table "public"."drink_log" validate constraint "drink_log_wine_id_fkey";

alter table "public"."storage_locations" add constraint "storage_locations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."storage_locations" validate constraint "storage_locations_user_id_fkey";

alter table "public"."wines" add constraint "wines_bin_id_fkey" FOREIGN KEY (bin_id) REFERENCES bins(id) not valid;

alter table "public"."wines" validate constraint "wines_bin_id_fkey";

grant delete on table "public"."bins" to "anon";

grant insert on table "public"."bins" to "anon";

grant references on table "public"."bins" to "anon";

grant select on table "public"."bins" to "anon";

grant trigger on table "public"."bins" to "anon";

grant truncate on table "public"."bins" to "anon";

grant update on table "public"."bins" to "anon";

grant delete on table "public"."bins" to "authenticated";

grant insert on table "public"."bins" to "authenticated";

grant references on table "public"."bins" to "authenticated";

grant select on table "public"."bins" to "authenticated";

grant trigger on table "public"."bins" to "authenticated";

grant truncate on table "public"."bins" to "authenticated";

grant update on table "public"."bins" to "authenticated";

grant delete on table "public"."bins" to "service_role";

grant insert on table "public"."bins" to "service_role";

grant references on table "public"."bins" to "service_role";

grant select on table "public"."bins" to "service_role";

grant trigger on table "public"."bins" to "service_role";

grant truncate on table "public"."bins" to "service_role";

grant update on table "public"."bins" to "service_role";

grant delete on table "public"."drink_log" to "anon";

grant insert on table "public"."drink_log" to "anon";

grant references on table "public"."drink_log" to "anon";

grant select on table "public"."drink_log" to "anon";

grant trigger on table "public"."drink_log" to "anon";

grant truncate on table "public"."drink_log" to "anon";

grant update on table "public"."drink_log" to "anon";

grant delete on table "public"."drink_log" to "authenticated";

grant insert on table "public"."drink_log" to "authenticated";

grant references on table "public"."drink_log" to "authenticated";

grant select on table "public"."drink_log" to "authenticated";

grant trigger on table "public"."drink_log" to "authenticated";

grant truncate on table "public"."drink_log" to "authenticated";

grant update on table "public"."drink_log" to "authenticated";

grant delete on table "public"."drink_log" to "service_role";

grant insert on table "public"."drink_log" to "service_role";

grant references on table "public"."drink_log" to "service_role";

grant select on table "public"."drink_log" to "service_role";

grant trigger on table "public"."drink_log" to "service_role";

grant truncate on table "public"."drink_log" to "service_role";

grant update on table "public"."drink_log" to "service_role";

grant delete on table "public"."storage_locations" to "anon";

grant insert on table "public"."storage_locations" to "anon";

grant references on table "public"."storage_locations" to "anon";

grant select on table "public"."storage_locations" to "anon";

grant trigger on table "public"."storage_locations" to "anon";

grant truncate on table "public"."storage_locations" to "anon";

grant update on table "public"."storage_locations" to "anon";

grant delete on table "public"."storage_locations" to "authenticated";

grant insert on table "public"."storage_locations" to "authenticated";

grant references on table "public"."storage_locations" to "authenticated";

grant select on table "public"."storage_locations" to "authenticated";

grant trigger on table "public"."storage_locations" to "authenticated";

grant truncate on table "public"."storage_locations" to "authenticated";

grant update on table "public"."storage_locations" to "authenticated";

grant delete on table "public"."storage_locations" to "service_role";

grant insert on table "public"."storage_locations" to "service_role";

grant references on table "public"."storage_locations" to "service_role";

grant select on table "public"."storage_locations" to "service_role";

grant trigger on table "public"."storage_locations" to "service_role";

grant truncate on table "public"."storage_locations" to "service_role";

grant update on table "public"."storage_locations" to "service_role";

grant delete on table "public"."wines" to "anon";

grant insert on table "public"."wines" to "anon";

grant references on table "public"."wines" to "anon";

grant select on table "public"."wines" to "anon";

grant trigger on table "public"."wines" to "anon";

grant truncate on table "public"."wines" to "anon";

grant update on table "public"."wines" to "anon";

grant delete on table "public"."wines" to "authenticated";

grant insert on table "public"."wines" to "authenticated";

grant references on table "public"."wines" to "authenticated";

grant select on table "public"."wines" to "authenticated";

grant trigger on table "public"."wines" to "authenticated";

grant truncate on table "public"."wines" to "authenticated";

grant update on table "public"."wines" to "authenticated";

grant delete on table "public"."wines" to "service_role";

grant insert on table "public"."wines" to "service_role";

grant references on table "public"."wines" to "service_role";

grant select on table "public"."wines" to "service_role";

grant trigger on table "public"."wines" to "service_role";

grant truncate on table "public"."wines" to "service_role";

grant update on table "public"."wines" to "service_role";


