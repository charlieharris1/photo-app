create table public.current_print_batch (
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamp not null,
  last_updated_at timestamp not null,
  file_path text,
  primary key (user_id)
);

alter table public.current_print_batch enable row level security;

create policy "User can see their own current print batch."
on profiles
for select using ((select auth.uid()) = user_id);

create policy "Users can update their own current print batch."
on profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete items from their own print batch."
on profiles for delete
to authenticated
using ((select auth.uid()) = user_id);