import { redirect } from "react-router";
import { makeSSRClient } from "@/supa-client";

export interface AdminUser {
  user: any;
  profile: any;
}

export async function requireAdminAuth(request: Request): Promise<AdminUser> {
  const { client } = makeSSRClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw redirect("/auth/login");
  }

  // Check if user has admin role
  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("profile_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw redirect("/");
  }

  return { user, profile };
}

export async function requireAuth(request: Request): Promise<AdminUser> {
  const { client } = makeSSRClient(request);

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw redirect("/auth/login");
  }

  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("profile_id", user.id)
    .single();

  return { user, profile };
}
