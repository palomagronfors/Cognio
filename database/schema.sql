-- ============================================================
--  Cognio - tietokannan rakenne (Supabase / PostgreSQL)
-- ============================================================
--  Aja tämä Supabasessa: SQL Editor -> New query -> liitä -> Run.
--  Tämä luo yhden rivin per käyttäjä, jossa koko Cognion data
--  on JSON-muodossa. Rivin näkee ja muokkaa vain sen omistaja.
-- ============================================================

create table if not exists public.kayttaja_data (
  user_id    uuid references auth.users on delete cascade primary key,
  data       jsonb       not null default '{}',
  updated_at timestamptz not null default now()
);

-- Row Level Security: jokainen pääsee vain omaan dataansa
alter table public.kayttaja_data enable row level security;

create policy "oma data - luku"
  on public.kayttaja_data
  for select using ( auth.uid() = user_id );

create policy "oma data - lisays"
  on public.kayttaja_data
  for insert with check ( auth.uid() = user_id );

create policy "oma data - paivitys"
  on public.kayttaja_data
  for update using ( auth.uid() = user_id );
