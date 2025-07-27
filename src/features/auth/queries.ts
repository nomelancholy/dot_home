import { supabaseAdmin } from "@/supa-client";

export const checkUsernameExists = async (username: string) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();

  if (error) {
    return false;
  }

  return true;
};

export const checkEmailExists = async (email: string) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("profile_id")
    .eq("email", email)
    .single();

  if (error) {
    return false;
  }

  return true;
};
