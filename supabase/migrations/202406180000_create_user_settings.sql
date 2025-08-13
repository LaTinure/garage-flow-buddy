-- Create user_settings table
create table if not exists public.user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  locale text not null default 'fr-FR',
  theme text not null default 'system',
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_settings_user_fk foreign key (user_id) references auth.users(id) on delete cascade,
  constraint user_settings_theme_check check (theme in ('light','dark','system'))
);

create unique index if not exists user_settings_user_id_uidx on public.user_settings(user_id);

alter table public.user_settings enable row level security;

-- RLS: users can select their own settings
create policy if not exists user_settings_select_self on public.user_settings
  for select
  using (auth.uid() = user_id);

-- RLS: users can insert their own settings
create policy if not exists user_settings_insert_self on public.user_settings
  for insert
  with check (auth.uid() = user_id);

-- RLS: users can update their own settings
create policy if not exists user_settings_update_self on public.user_settings
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS: users can delete their own settings (optional)
create policy if not exists user_settings_delete_self on public.user_settings
  for delete
  using (auth.uid() = user_id);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_settings_updated_at
before update on public.user_settings
for each row execute procedure public.set_updated_at();