create table public.profiles (
  user_id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  primary key (user_id)
);

alter table public.profiles enable row level security;

create policy "User can see their own profile only."
on profiles
for select using ((select auth.uid()) = user_id);

create policy "Users can update their own profile."
on profiles for update
to authenticated                    -- the Postgres Role (recommended)
using ((select auth.uid()) = user_id)       -- checks if the existing row complies with the policy expression
with check ((select auth.uid()) = user_id); -- checks if the new row complies with the policy expression

create policy "Users can delete their own profile."
on profiles for delete
to authenticated                     -- the Postgres Role (recommended)
using ((select auth.uid()) = user_id);      -- the actual Policy

-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
