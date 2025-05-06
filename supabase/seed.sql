-- Insert into storage_locations

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_token, recovery_token, raw_user_meta_data,
  last_sign_in_at, raw_app_meta_data, created_at, updated_at, email_change, email_change_token_new
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- instance_id (default for local dev)
  gen_random_uuid(), -- id (generate a new UUID)
  'authenticated', -- aud
  'authenticated', -- role
  'kobie@powersync.com', -- email
  crypt('a', gen_salt('bf')), -- encrypted_password
  now(), -- email_confirmed_at (to skip email confirmation)
  '',    -- confirmation_token
  '',    -- recovery_token
  '{"email_verified": true}'::jsonb,
  now(), -- last_sign_in_at
  '{"provider":"email","providers":["email"]}', -- raw_app_meta_data
  now(), -- created_at
  now(), -- updated_at
  '',     -- email_change
  ''     -- email_change_token_new
);

WITH first_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO storage_locations (id, user_id, name) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM first_user), 'Main Cellar'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM first_user), 'Secondary Cellar');

-- Insert into bins
INSERT INTO bins (id, storage_location_id, name) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Bin A'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Bin B'),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Bin C');

-- Insert into wines
INSERT INTO wines (id, bin_id, count, name, vintage, drink_between) VALUES
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 10, 'Chardonnay', 2018, '[2020-01-01,2025-12-31]'),
('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 5, 'Merlot', 2015, '[2017-01-01,2022-12-31]'),
('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 8, 'Cabernet Sauvignon', 2016, '[2018-01-01,2023-12-31]');

-- Insert into drink_log
WITH first_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO drink_log (id, wine_id, drank_at, reason, drank_by) VALUES
('99999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', '2023-01-15 14:30:00+00', 'drank from cellar', (SELECT id FROM first_user)),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', '2023-02-20 18:00:00+00', 'gifted', (SELECT id FROM first_user));