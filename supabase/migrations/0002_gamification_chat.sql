-- Gamification, group chat, and a placeholder for future
-- "suggest a new profile picture" feature.

-- ---------------------------------------------------------------------
-- points: running total per profile, kept in sync via point_events
-- ---------------------------------------------------------------------
alter table profiles add column points int not null default 0;

create table point_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  amount int not null,
  reason text not null, -- e.g. 'answered_questions', 'picked_tags', 'slider_questions'
  created_at timestamptz not null default now()
);

create index point_events_user_id_idx on point_events (user_id);

create function apply_point_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update profiles set points = points + new.amount where id = new.user_id;
  return new;
end;
$$;

create trigger point_events_apply
  after insert on point_events
  for each row execute function apply_point_event();

alter table point_events enable row level security;

create policy "members can view point events in own group"
  on point_events for select
  using (
    user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "users can log their own point events"
  on point_events for insert
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- messages: group chat
-- ---------------------------------------------------------------------
create table messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups (id) on delete cascade,
  from_user_id uuid not null references profiles (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create index messages_group_id_idx on messages (group_id, created_at);

alter table messages enable row level security;

create policy "members can view messages in own group"
  on messages for select
  using (group_id = current_group_id());

create policy "members can send messages to own group"
  on messages for insert
  with check (
    group_id = current_group_id()
    and from_user_id = auth.uid()
  );

-- ---------------------------------------------------------------------
-- profile_picture_suggestions: not used by the UI yet.
-- Future feature: friends can suggest a new profile picture for someone,
-- which the person can then approve (mirrors profile_summaries.approved).
-- ---------------------------------------------------------------------
create table profile_picture_suggestions (
  id uuid primary key default gen_random_uuid(),
  about_user_id uuid not null references profiles (id) on delete cascade,
  suggested_by_user_id uuid not null references profiles (id) on delete cascade,
  image_url text not null,
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at timestamptz not null default now()
);

create index profile_picture_suggestions_about_user_id_idx
  on profile_picture_suggestions (about_user_id);

alter table profile_picture_suggestions enable row level security;

create policy "members can view picture suggestions in own group"
  on profile_picture_suggestions for select
  using (
    about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "members can suggest pictures for group members"
  on profile_picture_suggestions for insert
  with check (
    suggested_by_user_id = auth.uid()
    and about_user_id in (select id from profiles where group_id = current_group_id())
  );

create policy "person can approve or reject own picture suggestions"
  on profile_picture_suggestions for update
  using (about_user_id = auth.uid());
