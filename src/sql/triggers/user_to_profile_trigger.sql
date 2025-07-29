create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  suffix_array text[] := array['_청자', '_백자', '_머그컵', '_물레', '_소성', '_시유', '_점토', '_백토'];
  suffix_index integer;
begin
 -- create profile for the user 
  if new.raw_app_meta_data is not null then
    if new.raw_app_meta_data ? 'provider' and new.raw_app_meta_data ->> 'provider' = 'email' then
      if new.raw_user_meta_data ? 'username' then
        insert into public.profiles (profile_id, username, email, role)
        values (new.id, new.raw_user_meta_data ->> 'username', new.email, 'user');
      end if;
    end if;

    if new.raw_app_meta_data ? 'provider' and new.raw_app_meta_data ->> 'provider' = 'kakao' then
      if new.raw_user_meta_data ? 'preferred_username' then
          -- UUID를 기반으로 랜덤하게 suffix 선택
        suffix_index := (abs(('x' || substr(new.id::text, 1, 8))::bit(32)::integer) % array_length(suffix_array, 1)) + 1;
        insert into public.profiles (profile_id, username, email, role)
        values (new.id, new.raw_user_meta_data ->> 'preferred_username' || suffix_array[suffix_index], new.email, 'user');
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists user_to_profile_trigger on auth.users;

create trigger user_to_profile_trigger
after insert on auth.users
for each row
execute function handle_new_user();