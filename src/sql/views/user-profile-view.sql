CREATE VIEW user_profile_view AS
SELECT
    profiles.profile_id,
    profiles.username,
    profiles.email,
    profiles.role
FROM profiles
INNER JOIN auth.users ON profiles.profile_id = auth.users.id;