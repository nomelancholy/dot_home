import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/supa-client";

interface CategoryInsert {
  name: string;
}

export const createCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryInsert
) => {
  const { data: categoryData, error } = await client
    .from("categories")
    .insert({
      name: category.name,
    })
    .select();

  return { categoryData, error };
};
