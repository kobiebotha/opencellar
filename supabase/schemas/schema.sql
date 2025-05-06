create table storage_locations (
  id uuid primary key default (
    gen_random_uuid()
  ),
  user_id uuid not null references auth.users (id),
  name text not null
);

create table bins (
  id uuid primary key default (
    gen_random_uuid()
  ),
  storage_location_id uuid not null references storage_locations (id),
  name text not null
);

create table wines (
  id uuid primary key default (
    gen_random_uuid()
  ),
  bin_id uuid not null references bins (id),
  count integer not null,
  name text not null,
  vintage integer not null,
  drink_between daterange
);

create type drink_reason as enum('gifted', 'missing', 'drank from cellar');

create type wine_type as enum('red', 'white', 'dessert');

create table drink_log (
  id uuid primary key default (
    gen_random_uuid()
  ),
  wine_id uuid not null references wines (id),
  drank_by uuid not null references auth.users (id),
  drank_at timestamp with time zone default now(),
  reason drink_reason not null
);