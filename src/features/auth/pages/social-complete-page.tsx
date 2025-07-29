import { makeSSRClient } from "@/supa-client";
import type { Route } from "./+types/social-complete-page";
import { z } from "zod";
import { redirect } from "react-router";

const paramSchema = z.object({
  provider: z.enum(["kakao", "google"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramSchema.safeParse(params);

  if (!success) {
    return redirect("/auth/login");
  }

  const { provider } = data;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    throw new Error(`OAuth error: ${oauthError} - ${errorDescription}`);
  }

  if (!code) {
    return redirect("/auth/login");
  }

  const { client, headers } = makeSSRClient(request);

  const { data: sessionData, error: exchangeError } =
    await client.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    throw new Error(exchangeError.message);
  }

  // 세션이 제대로 설정되었는지 확인
  if (!sessionData.session) {
    throw new Error("Failed to create session");
  }

  return redirect("/", {
    headers,
  });
};
