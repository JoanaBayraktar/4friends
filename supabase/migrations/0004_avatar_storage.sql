-- 4Friends: storage bucket for profile photo uploads ("Foto ändern" in
-- Einstellungen).
--
-- HOW TO APPLY:
--   Open the Supabase dashboard for this project -> SQL Editor, paste the
--   contents of this file and run it once. Safe to re-run.

-- Public bucket so uploaded avatars can be displayed via their public URL.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view avatar images (the bucket is public anyway, but this
-- also allows reading via the authenticated/anon API).
drop policy if exists "avatar images are publicly accessible" on storage.objects;
create policy "avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Users can upload/replace/delete only files inside their own folder,
-- i.e. paths starting with "<their-user-id>/...".
drop policy if exists "users can upload their own avatar" on storage.objects;
create policy "users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users can update their own avatar" on storage.objects;
create policy "users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users can delete their own avatar" on storage.objects;
create policy "users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
