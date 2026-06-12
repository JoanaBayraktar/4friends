-- 4Friends initial schema
-- Concept: friends describe each other positively, building a profile
-- from the outside perspective instead of self-description.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- groups: a "Freundeskreis", joined via invite code
-- ---------------------------------------------------------------------
create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- profiles: one per auth user, scoped to a group
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  group_id uuid not null references groups (id) on delete cascade,
  name text not null,
  pronouns text,
  image_url text,
  created_at timestamptz not null default now()
);

create index profiles_group_id_idx on profiles (group_id);

-- helper: group of the currently authenticated user
create function current_group_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select group_id from profiles where id = auth.uid()
$$;

-- ---------------------------------------------------------------------
-- questions: shared question bank ("Was macht diese Person besonders?")
-- ---------------------------------------------------------------------
create table questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  type text not null default 'text', -- 'text' | 'choice'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- answers: a friend's answer about another person for a given question
-- ---------------------------------------------------------------------
create table answers (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references profiles (id) on delete cascade,
  about_user_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (from_user_id, about_user_id, question_id)
);

create index answers_about_user_id_idx on answers (about_user_id);

-- ---------------------------------------------------------------------
-- tags: positive-only trait labels
-- ---------------------------------------------------------------------
create table tags (
  id uuid primary key default gen_random_uuid(),
  label text not null unique
);

-- ---------------------------------------------------------------------
-- user_tag_votes: a friend picking tags that fit another person
-- ---------------------------------------------------------------------
create table user_tag_votes (
  from_user_id uuid not null references profiles (id) on delete cascade,
  about_user_id uuid not null references profiles (id) on delete cascade,
  tag_id uuid not null references tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (from_user_id, about_user_id, tag_id)
);

create index user_tag_votes_about_user_id_idx on user_tag_votes (about_user_id);

-- ---------------------------------------------------------------------
-- profile_summaries: the generated profile text + approval by the person
-- ---------------------------------------------------------------------
create table profile_summaries (
  id uuid primary key default gen_random_uuid(),
  about_user_id uuid not null unique references profiles (id) on delete cascade,
  content text not null default '',
  approved boolean not null default false,
  approved_at timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table groups enable row level security;
alter table profiles enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;
alter table tags enable row level security;
alter table user_tag_votes enable row level security;
alter table profile_summaries enable row level security;

-- groups: members can see their own group
create policy "members can view own group"
  on groups for select
  using (id = current_group_id());

-- profiles: members can see other profiles in the same group
create policy "members can view profiles in own group"
  on profiles for select
  using (group_id = current_group_id());

create policy "users can insert own profile"
  on profiles for insert
  with check (id = auth.uid());

create policy "users can update own profile"
  on profiles for update
  using (id = auth.uid());

-- questions: readable by any authenticated member
create policy "authenticated users can view questions"
  on questions for select
  to authenticated
  using (true);

-- answers: members can see/write answers about people in their group
create policy "members can view answers in own group"
  on answers for select
  using (
    about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can write answers about group members"
  on answers for insert
  with check (
    from_user_id = auth.uid()
    and about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can update own answers"
  on answers for update
  using (from_user_id = auth.uid());

-- tags: readable by any authenticated member
create policy "authenticated users can view tags"
  on tags for select
  to authenticated
  using (true);

-- user_tag_votes: members can see/manage votes within their group
create policy "members can view tag votes in own group"
  on user_tag_votes for select
  using (
    about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can cast tag votes for group members"
  on user_tag_votes for insert
  with check (
    from_user_id = auth.uid()
    and about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can remove own tag votes"
  on user_tag_votes for delete
  using (from_user_id = auth.uid());

-- profile_summaries: members can view summaries in their group,
-- but only the person themselves can approve/edit their own summary
create policy "members can view profile summaries in own group"
  on profile_summaries for select
  using (
    about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can generate summary draft for group members"
  on profile_summaries for insert
  with check (
    about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "person can edit and approve own summary"
  on profile_summaries for update
  using (about_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Seed data: starter questions and positive tags
-- ---------------------------------------------------------------------
insert into questions (text, type, sort_order) values
  ('Was macht diese Person besonders?', 'text', 1),
  ('Worin ist sie richtig gut?', 'text', 2),
  ('Was ist ein typischer Satz von ihr?', 'text', 3),
  ('Womit bringt sie andere zum Lachen?', 'text', 4),
  ('Welcher Vibe passt zu ihr?', 'text', 5);

insert into tags (label) values
  ('warmherzig'),
  ('chaotisch-liebenswert'),
  ('kreativ'),
  ('zuverlässig'),
  ('witzig'),
  ('tiefgründig'),
  ('abenteuerlustig'),
  ('direkt'),
  ('loyal'),
  ('einfühlsam'),
  ('inspirierend'),
  ('gelassen');
