drop policy "Users can delete their own bins" on "public"."bins";

drop policy "Users can insert bins for their own storage locations" on "public"."bins";

drop policy "Users can update their own bins" on "public"."bins";

drop policy "Users can view their own bins" on "public"."bins";

drop policy "Authenticated users can insert into their own storage_locations" on "public"."storage_locations";

drop policy "Authenticated users can select their own storage_locations" on "public"."storage_locations";

drop policy "Users can delete their own storage_locations" on "public"."storage_locations";

drop policy "Users can update their own storage_locations" on "public"."storage_locations";

drop policy "Users can delete their own wines" on "public"."wines";

drop policy "Users can insert wines into their own bins" on "public"."wines";

drop policy "Users can update their own wines" on "public"."wines";

drop policy "Users can view their own wines" on "public"."wines";

alter type "public"."drink_reason" rename to "drink_reason__old_version_to_be_dropped";

create type "public"."drink_reason" as enum ('gifted', 'missing', 'drank from cellar');

alter table "public"."drink_log" alter column reason type "public"."drink_reason" using reason::text::"public"."drink_reason";

drop type "public"."drink_reason__old_version_to_be_dropped";

alter table "public"."bins" disable row level security;

alter table "public"."drink_log" add column "drank_by" uuid not null;

alter table "public"."storage_locations" disable row level security;

alter table "public"."wines" alter column "drink_between" drop not null;

alter table "public"."wines" disable row level security;

alter table "public"."drink_log" add constraint "drink_log_drank_by_fkey" FOREIGN KEY (drank_by) REFERENCES auth.users(id) not valid;

alter table "public"."drink_log" validate constraint "drink_log_drank_by_fkey";


