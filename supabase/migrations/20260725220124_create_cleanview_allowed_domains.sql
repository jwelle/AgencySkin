create table public.cleanview_allowed_domains (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null,
  hostname text not null unique,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cleanview_allowed_domains_agency_name_length
    check (char_length(btrim(agency_name)) between 1 and 120),
  constraint cleanview_allowed_domains_hostname_canonical
    check (
      hostname = lower(hostname)
      and char_length(hostname) between 3 and 253
      and hostname ~ '^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]([a-z0-9-]{0,61}[a-z0-9])?$'
      and hostname <> 'localhost'
    )
);

comment on table public.cleanview_allowed_domains is
  'Exact HTTPS white-label hostnames approved to run the CleanView extension.';
comment on column public.cleanview_allowed_domains.hostname is
  'Canonical lowercase hostname only; do not include a scheme, port, path, or wildcard.';

alter table public.cleanview_allowed_domains enable row level security;
alter table public.cleanview_allowed_domains force row level security;

revoke all on table public.cleanview_allowed_domains from public, anon, authenticated;
grant select on table public.cleanview_allowed_domains to service_role;

create function public.set_cleanview_allowed_domains_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_cleanview_allowed_domains_updated_at() from public, anon, authenticated;

create trigger set_cleanview_allowed_domains_updated_at
before update on public.cleanview_allowed_domains
for each row execute function public.set_cleanview_allowed_domains_updated_at();
