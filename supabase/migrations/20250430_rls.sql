--RLS
alter table "public"."storage_locations" enable row level security;

alter table "public"."bins" enable row level security;

alter table "public"."wines" enable row level security;


create policy "Authenticated users can insert into their own storage_locations"
on "public"."storage_locations"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Authenticated users can select their own storage_locations"
on "public"."storage_locations"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can delete their own storage_locations"
on "public"."storage_locations"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update their own storage_locations"
on "public"."storage_locations"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));


CREATE POLICY "Users can view their own bins" 
ON bins 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM storage_locations 
    WHERE storage_locations.id = bins.storage_location_id 
    AND storage_locations.user_id = auth.uid()
  )
);

create policy "Users can delete their own bins"
on "public"."bins"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM storage_locations
  WHERE ((storage_locations.id = bins.storage_location_id) AND (storage_locations.user_id = auth.uid())))));


create policy "Users can insert bins for their own storage locations"
on "public"."bins"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM storage_locations
  WHERE ((storage_locations.id = bins.storage_location_id) AND (storage_locations.user_id = auth.uid())))));


create policy "Users can update their own bins"
on "public"."bins"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM storage_locations
  WHERE ((storage_locations.id = bins.storage_location_id) AND (storage_locations.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM storage_locations
  WHERE ((storage_locations.id = bins.storage_location_id) AND (storage_locations.user_id = auth.uid())))));


create policy "Users can delete their own wines"
on "public"."wines"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (bins
     JOIN storage_locations ON ((bins.storage_location_id = storage_locations.id)))
  WHERE ((bins.id = wines.bin_id) AND (storage_locations.user_id = auth.uid())))));


create policy "Users can insert wines into their own bins"
on "public"."wines"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (bins
     JOIN storage_locations ON ((bins.storage_location_id = storage_locations.id)))
  WHERE ((bins.id = wines.bin_id) AND (storage_locations.user_id = auth.uid())))));


create policy "Users can update their own wines"
on "public"."wines"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (bins
     JOIN storage_locations ON ((bins.storage_location_id = storage_locations.id)))
  WHERE ((bins.id = wines.bin_id) AND (storage_locations.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (bins
     JOIN storage_locations ON ((bins.storage_location_id = storage_locations.id)))
  WHERE ((bins.id = wines.bin_id) AND (storage_locations.user_id = auth.uid())))));


create policy "Users can view their own wines"
on "public"."wines"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (bins
     JOIN storage_locations ON ((bins.storage_location_id = storage_locations.id)))
  WHERE ((bins.id = wines.bin_id) AND (storage_locations.user_id = auth.uid())))));



