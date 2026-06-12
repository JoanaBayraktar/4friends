-- 4Friends: real user accounts (username/password, no e-mail step) and
-- persistence for everything people do in the app (task answers, tag
-- picks, slider results, likes, points, chat, feature requests).
--
-- HOW TO APPLY:
--   1. Open the Supabase dashboard for this project -> SQL Editor.
--   2. Paste the contents of this file and run it once.
--   3. Go to Authentication -> Sign In / Providers -> Email and turn OFF
--      "Confirm email". This app signs people up with a synthetic
--      "<username>@4friends.app" address and a password only, so there is
--      no inbox to confirm from.
--
-- This migration is additive (uses `if not exists` / `on conflict`), so it
-- is safe to run on the existing project without losing the schema from
-- 0001/0002.

-- ---------------------------------------------------------------------
-- Seed the (only) group, matched by invite code at sign-up time.
-- ---------------------------------------------------------------------
insert into groups (name, invite_code)
values ('Feuchtgebiete', '#Couscous-Salat-2026')
on conflict (invite_code) do nothing;

-- ---------------------------------------------------------------------
-- profiles: username/password accounts + a few extra account fields
-- ---------------------------------------------------------------------
alter table profiles add column if not exists username text;
alter table profiles add column if not exists color text not null default 'bg-zinc-300';
alter table profiles add column if not exists favorite_song text;
alter table profiles add column if not exists notifications boolean not null default true;

create unique index if not exists profiles_username_idx
  on profiles (lower(username));

-- ---------------------------------------------------------------------
-- handle_new_user: create the profiles row when someone signs up.
-- Expects auth.users.raw_user_meta_data to contain:
--   username, name, pronouns (optional), invite_code, color
-- Raises an exception (which aborts the sign-up) if the invite code is
-- unknown, so users can't create accounts outside a real group.
-- ---------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group_id uuid;
begin
  select id into target_group_id
  from groups
  where invite_code = new.raw_user_meta_data ->> 'invite_code';

  if target_group_id is null then
    raise exception 'invalid_invite_code';
  end if;

  insert into profiles (id, group_id, name, pronouns, username, color)
  values (
    new.id,
    target_group_id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'username'),
    new.raw_user_meta_data ->> 'pronouns',
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'color', 'bg-zinc-300')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- freitext_answers: answers to the "Ein paar Fragen" (free-text) task.
-- Stores the question text directly so it works with the large,
-- randomized question bank used by the app (not just the small seeded
-- `questions` table).
-- ---------------------------------------------------------------------
create table if not exists freitext_answers (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references profiles (id) on delete cascade,
  about_user_id uuid not null references profiles (id) on delete cascade,
  question_text text not null,
  answer_text text not null,
  created_at timestamptz not null default now(),
  unique (from_user_id, about_user_id, question_text)
);

create index if not exists freitext_answers_about_user_id_idx
  on freitext_answers (about_user_id);

alter table freitext_answers enable row level security;

create policy "members can view freitext answers in own group"
  on freitext_answers for select
  using (about_user_id in (select id from profiles where group_id = current_group_id()));

create policy "members can write freitext answers about group members"
  on freitext_answers for insert
  with check (
    from_user_id = auth.uid()
    and about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can update own freitext answers"
  on freitext_answers for update
  using (from_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- trait_votes: picks from the "Eigenschaften auswählen" (tags) task.
-- Stores the trait label directly (trait bank has 300+ entries).
-- ---------------------------------------------------------------------
create table if not exists trait_votes (
  from_user_id uuid not null references profiles (id) on delete cascade,
  about_user_id uuid not null references profiles (id) on delete cascade,
  trait_label text not null,
  created_at timestamptz not null default now(),
  primary key (from_user_id, about_user_id, trait_label)
);

create index if not exists trait_votes_about_user_id_idx
  on trait_votes (about_user_id);

alter table trait_votes enable row level security;

create policy "members can view trait votes in own group"
  on trait_votes for select
  using (about_user_id in (select id from profiles where group_id = current_group_id()));

create policy "members can cast trait votes for group members"
  on trait_votes for insert
  with check (
    from_user_id = auth.uid()
    and about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can remove own trait votes"
  on trait_votes for delete
  using (from_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- slider_answers: results from the "Schnell eingeordnet" (slider) task.
-- ---------------------------------------------------------------------
create table if not exists slider_answers (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references profiles (id) on delete cascade,
  about_user_id uuid not null references profiles (id) on delete cascade,
  question_text text not null,
  value int not null,
  stop_text text not null,
  created_at timestamptz not null default now(),
  unique (from_user_id, about_user_id, question_text)
);

create index if not exists slider_answers_about_user_id_idx
  on slider_answers (about_user_id);

alter table slider_answers enable row level security;

create policy "members can view slider answers in own group"
  on slider_answers for select
  using (about_user_id in (select id from profiles where group_id = current_group_id()));

create policy "members can write slider answers about group members"
  on slider_answers for insert
  with check (
    from_user_id = auth.uid()
    and about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can update own slider answers"
  on slider_answers for update
  using (from_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- freitext_answer_likes: hearts on AnswerCard entries
-- ---------------------------------------------------------------------
create table if not exists freitext_answer_likes (
  answer_id uuid not null references freitext_answers (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (answer_id, user_id)
);

alter table freitext_answer_likes enable row level security;

create policy "members can view answer likes in own group"
  on freitext_answer_likes for select
  using (
    answer_id in (
      select id from freitext_answers
      where about_user_id in (select id from profiles where group_id = current_group_id())
    )
  );

create policy "members can like answers in own group"
  on freitext_answer_likes for insert
  with check (
    user_id = auth.uid()
    and answer_id in (
      select id from freitext_answers
      where about_user_id in (select id from profiles where group_id = current_group_id())
    )
  );

create policy "members can remove own answer likes"
  on freitext_answer_likes for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- feature_requests: "Ideen & Wünsche" form on the settings page
-- ---------------------------------------------------------------------
create table if not exists feature_requests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null,
  text text not null,
  created_at timestamptz not null default now()
);

alter table feature_requests enable row level security;

create policy "members can view feature requests in own group"
  on feature_requests for select
  using (group_id = current_group_id());

create policy "members can create feature requests in own group"
  on feature_requests for insert
  with check (group_id = current_group_id() and user_id = auth.uid());

-- Note: the new profiles columns (username, color, favorite_song,
-- notifications) are already covered by the existing "users can update own
-- profile" / "members can view profiles in own group" policies from
-- 0001_init.sql, since those apply to the whole row via `select *` / `update`.

-- ---------------------------------------------------------------------
-- Make sure the `messages` table broadcasts realtime changes (used by the
-- group chat to receive new messages live). Safe to run even if it was
-- already added.
-- ---------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table messages;
exception when duplicate_object then null;
end $$;
