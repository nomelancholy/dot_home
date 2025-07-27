create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
 -- create profile for the user 
  if new.raw_user_meta_data is not null and new.raw_user_meta_data ? 'username' then
    insert into public.profiles (profile_id, username, email, role)
    values (new.id, new.raw_user_meta_data ->> 'username', new.email, 'user');
  end if;
  return new;
end;
$$;

drop trigger if exists user_to_profile_trigger on auth.users;

create trigger user_to_profile_trigger
after insert on auth.users
for each row
execute function handle_new_user();