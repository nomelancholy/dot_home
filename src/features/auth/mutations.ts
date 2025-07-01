import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { formSchema } from "./pages/signup-page";

export const createProfile = async (
  client: SupabaseClient,
  data: z.infer<typeof formSchema> & { id: string }
) => {
  const { data: profileData, error } = await client
    .from("profiles")
    .insert({
      profile_id: data.id,
      email: data.email,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .select();
  if (error) {
    throw error;
  }
};
