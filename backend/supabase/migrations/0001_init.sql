-- Matiks Content OS - Database Schema
-- Run with: supabase db push or supabase migrations apply

-- Cleanup existing tables for a fresh start
drop table if exists metrics, assets, render_jobs, reels, briefs, signals, channels, patterns, agents cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Channels table
create table channels (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null,
  handle text not null,
  niche text not null,
  language text not null default 'EN' check (language in ('EN','HI','ES','PT')),
  status text not null default 'warming' check (status in ('active','paused','warming')),
  followers integer not null default 0,
  d7_reach integer not null default 0,
  hook_rate numeric(5,2) not null default 0,
  save_rate numeric(5,2) not null default 0,
  voice_id text,
  posting_window text,
  queue_depth integer not null default 0,
  ig_user_id text,
  access_token_enc text,
  proxy_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, handle)
);

-- Signals table
create table signals (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references channels(id) on delete cascade not null,
  source text not null,
  raw jsonb not null,
  score numeric(5,2),
  status text not null default 'new' check (status in ('new','used','rejected')),
  created_at timestamptz not null default now()
);

-- Briefs table
create table briefs (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references channels(id) on delete cascade not null,
  signal_id uuid references signals(id) on delete set null,
  schema_version integer not null default 1,
  payload jsonb not null,
  model text not null,
  prompt_tokens integer,
  completion_tokens integer,
  cost_usd numeric(10,6),
  created_at timestamptz not null default now()
);

-- Reels table
create table reels (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references channels(id) on delete cascade not null,
  brief_id uuid references briefs(id) on delete set null,
  topic text not null,
  stage text not null default 'idea' check (stage in ('idea','research','scripted','voiceover','assets','rendered','queued','analyzed')),
  score integer check (score between 0 and 100),
  scheduled_for timestamptz,
  posted_at timestamptz,
  ig_media_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Assets table
create table assets (
  id uuid primary key default uuid_generate_v4(),
  brief_id uuid references briefs(id) on delete cascade not null,
  kind text not null check (kind in ('audio','broll','thumb','final')),
  provider text not null,
  storage_path text not null,
  duration_ms integer,
  status text not null default 'pending' check (status in ('pending','ready','failed')),
  created_at timestamptz not null default now()
);

-- Render jobs table
create table render_jobs (
  id uuid primary key default uuid_generate_v4(),
  brief_id uuid references briefs(id) on delete cascade not null,
  provider text not null,
  external_id text,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed')),
  error text,
  output_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Metrics table
create table metrics (
  id uuid primary key default uuid_generate_v4(),
  reel_id uuid references reels(id) on delete cascade not null,
  captured_at timestamptz not null default now(),
  reach integer default 0,
  plays integer default 0,
  likes integer default 0,
  saves integer default 0,
  shares integer default 0,
  comments integer default 0,
  follows integer default 0,
  hook_rate numeric(5,2) default 0
);

-- Patterns table
create table patterns (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references channels(id) on delete cascade,
  kind text not null check (kind in ('hook','format','topic')),
  summary text not null,
  lift_pct numeric(6,2),
  evidence_reel_ids uuid[],
  created_at timestamptz not null default now()
);

-- Agents table
create table agents (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  role text not null,
  status text not null default 'idle'
);

-- Insert default agents
insert into agents (name, role) values
  ('Atlas', 'Researcher'),
  ('Ravi', 'Writer'),
  ('Kira', 'Editor'),
  ('Nexus', 'Scheduler');

-- Indexes
create index idx_channels_owner on channels(owner_id);
create index idx_signals_channel on signals(channel_id);
create index idx_briefs_channel on briefs(channel_id);
create index idx_reels_channel on reels(channel_id);
create index idx_reels_stage on reels(stage);
create index idx_reels_scheduled on reels(scheduled_for) where scheduled_for is not null;
create index idx_assets_brief on assets(brief_id);
create index idx_render_jobs_brief on render_jobs(brief_id);
create index idx_metrics_reel on metrics(reel_id);
create index idx_patterns_channel on patterns(channel_id);

-- RLS
alter table channels enable row level security;
alter table signals enable row level security;
alter table briefs enable row level security;
alter table reels enable row level security;
alter table assets enable row level security;
alter table render_jobs enable row level security;
alter table metrics enable row level security;
alter table patterns enable row level security;
alter table agents enable row level security;

-- Channels policies
create policy "channels_select" on channels for select
  using (owner_id = auth.uid());

create policy "channels_insert" on channels for insert
  with check (owner_id = auth.uid());

create policy "channels_update" on channels for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "channels_delete" on channels for delete
  using (owner_id = auth.uid());

-- Signals policies
create policy "signals_select" on signals for select
  using (exists (
    select 1 from channels c
    where c.id = signals.channel_id
    and c.owner_id = auth.uid()
  ));

create policy "signals_insert" on signals for insert
  with check (exists (
    select 1 from channels c
    where c.id = signals.channel_id
    and c.owner_id = auth.uid()
  ));

-- Briefs policies
create policy "briefs_select" on briefs for select
  using (exists (
    select 1 from channels c
    where c.id = briefs.channel_id
    and c.owner_id = auth.uid()
  ));

create policy "briefs_insert" on briefs for insert
  with check (exists (
    select 1 from channels c
    where c.id = briefs.channel_id
    and c.owner_id = auth.uid()
  ));

-- Reels policies
create policy "reels_select" on reels for select
  using (exists (
    select 1 from channels c
    where c.id = reels.channel_id
    and c.owner_id = auth.uid()
  ));

create policy "reels_insert" on reels for insert
  with check (exists (
    select 1 from channels c
    where c.id = reels.channel_id
    and c.owner_id = auth.uid()
  ));

create policy "reels_update" on reels for update
  using (exists (
    select 1 from channels c
    where c.id = reels.channel_id
    and c.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from channels c
    where c.id = reels.channel_id
    and c.owner_id = auth.uid()
  ));

create policy "reels_delete" on reels for delete
  using (exists (
    select 1 from channels c
    where c.id = reels.channel_id
    and c.owner_id = auth.uid()
  ));

-- Assets policies
create policy "assets_select" on assets for select
  using (exists (
    select 1 from briefs b
    join channels c on c.id = b.channel_id
    where b.id = assets.brief_id
    and c.owner_id = auth.uid()
  ));

-- Render jobs policies
create policy "render_jobs_select" on render_jobs for select
  using (exists (
    select 1 from briefs b
    join channels c on c.id = b.channel_id
    where b.id = render_jobs.brief_id
    and c.owner_id = auth.uid()
  ));

create policy "render_jobs_insert" on render_jobs for insert
  with check (exists (
    select 1 from briefs b
    join channels c on c.id = b.channel_id
    where b.id = render_jobs.brief_id
    and c.owner_id = auth.uid()
  ));

create policy "render_jobs_update" on render_jobs for update
  using (exists (
    select 1 from briefs b
    join channels c on c.id = b.channel_id
    where b.id = render_jobs.brief_id
    and c.owner_id = auth.uid()
  ));

-- Metrics policies
create policy "metrics_select" on metrics for select
  using (exists (
    select 1 from reels r
    join channels c on c.id = r.channel_id
    where r.id = metrics.reel_id
    and c.owner_id = auth.uid()
  ));

create policy "metrics_insert" on metrics for insert
  with check (exists (
    select 1 from reels r
    join channels c on c.id = r.channel_id
    where r.id = metrics.reel_id
    and c.owner_id = auth.uid()
  ));

-- Patterns policies
create policy "patterns_select" on patterns for select
  using (
    channel_id is null or
    exists (
      select 1 from channels c
      where c.id = patterns.channel_id
      and c.owner_id = auth.uid()
    )
  );

create policy "patterns_insert" on patterns for insert
  with check (
    channel_id is null or
    exists (
      select 1 from channels c
      where c.id = patterns.channel_id
      and c.owner_id = auth.uid()
    )
  );

-- Agents policy (read-only for all authenticated users)
create policy "agents_select" on agents for select
  using (auth.role() = 'authenticated');

-- updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end
$$ language plpgsql;

-- Triggers
create trigger update_channels_updated
  before update on channels
  for each row execute function update_updated_at();

create trigger update_reels_updated
  before update on reels
  for each row execute function update_updated_at();

create trigger update_render_jobs_updated
  before update on render_jobs
  for each row execute function update_updated_at();