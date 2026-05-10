-- Storage buckets for assets (audio, b-roll, thumbnails, final renders)

-- Audio files from ElevenLabs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('audio', 'audio', false, 10485760, array['audio/mpeg', 'audio/mp3', 'audio/wav'])
on conflict (id) do nothing;

-- B-roll from stock video APIs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('broll', 'broll', false, 524288000, array['video/mp4', 'video/webm', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Thumbnails generated
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('thumbnails', 'thumbnails', true, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- Final rendered videos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('renders', 'renders', false, 524288000, array['video/mp4', 'video/webm'])
on conflict (id) do nothing;

-- Storage policies (same RLS pattern - owner can only access their own)
create policy "audio_owner_access" on storage.objects
  for all using (
    bucket_id = 'audio' and 
    exists (
      select 1 from channels c
      where c.owner_id = auth.uid()
    )
  );

create policy "broll_owner_access" on storage.objects
  for all using (
    bucket_id = 'broll' and 
    exists (
      select 1 from channels c
      where c.owner_id = auth.uid()
    )
  );

create policy "thumbnails_owner_access" on storage.objects
  for all using (
    bucket_id = 'thumbnails' and 
    exists (
      select 1 from channels c
      where c.owner_id = auth.uid()
    )
  );

create policy "renders_owner_access" on storage.objects
  for all using (
    bucket_id = 'renders' and 
    exists (
      select 1 from channels c
      where c.owner_id = auth.uid()
    )
  );