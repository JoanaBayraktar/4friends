# 4Friends

"Was sehen deine Freund\*innen in dir?" – Freunde beantworten Fragen und
wählen Tags für eine Person, daraus entsteht ein Profil aus der
Außenperspektive, das die Person selbst freigeben kann.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

The app currently runs on placeholder data from
[`src/lib/mock-data.ts`](src/lib/mock-data.ts) so the UI can be explored
without a backend.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   (via `supabase db push` or the SQL editor).
3. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and anon key.
4. Wire up the pages under `src/app` to the Supabase clients in
   [`src/lib/supabase`](src/lib/supabase) instead of the mock data — each
   page has `TODO` comments marking where real queries should go.

## Data model

- `groups` – a Freundeskreis, joined via `invite_code`
- `profiles` – one per user, scoped to a group
- `questions` – shared question bank
- `answers` – a friend's answer about another person for a question
- `tags` / `user_tag_votes` – positive-only trait tags friends pick for someone
- `profile_summaries` – the generated profile text + approval by the person

## Pages

- `/login` – multi-step onboarding: invite code → name/pronouns → profile photo
- `/group` – overview of all people in the group
- `/group/[personId]` – a randomly picked mini-task for that person: answer
  questions one at a time, pick trait tags, or rate them with sliders
  (BlindMate-style). Each completed task awards points; reaching a points
  threshold triggers a level-up animation.
- `/group/[personId]/profile` – view their generated profile
- `/me` – edit and approve your own generated profile
- `/chat` – group chat for everyone in the Freundeskreis

## Gamification

Points and levels are defined in
[`src/lib/points.ts`](src/lib/points.ts) and currently tracked client-side
via `localStorage` (see [`src/hooks/usePoints.ts`](src/hooks/usePoints.ts)).
The Supabase migration adds `profiles.points` and a `point_events` log so
this can move server-side later.

## Planned next steps

- Friends suggesting a new profile picture for someone (table
  `profile_picture_suggestions` already scaffolded, no UI yet)
- A shared list of movies/series that everyone in the group can rate
