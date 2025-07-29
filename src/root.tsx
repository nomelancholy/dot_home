import "@/lib/i18n";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Navigation from "./common/components/navigation";
import Footer from "./common/components/footer";
import { makeSSRClient } from "./supa-client";
import { Toaster } from "@/common/components/ui/sonner";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="text/javascript"
          src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=db60iht0lc"
        ></script>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);

  // OAuth 코드가 있는지 확인
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { data: sessionData, error: exchangeError } =
      await client.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw new Error(exchangeError.message);
    }

    // 세션이 설정된 후 다시 사용자 정보 가져오기
    const {
      data: { user },
    } = await client.auth.getUser();

    let isAdmin = false;

    if (user && user.id) {
      const { data: profile } = await client
        .from("profiles")
        .select("*")
        .eq("profile_id", user?.id ?? "")
        .single();

      if (profile?.role === "admin") {
        isAdmin = true;
      }

      return { user, profile, isAdmin, headers };
    }

    return { user: null, profile: null, isAdmin: false, headers };
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  let isAdmin = false;

  if (user && user.id) {
    const { data: profile } = await client
      .from("profiles")
      .select("*")
      .eq("profile_id", user?.id ?? "")
      .single();

    if (profile?.role === "admin") {
      isAdmin = true;
    }

    return { user, profile, isAdmin, headers };
  }

  return { user: null, profile: null, isAdmin: false, headers };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { user, isAdmin } = loaderData;

  const isLoggedIn = user !== null;

  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-20 px-4 md:px-10">
      <Navigation
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        name={user?.user_metadata?.name ?? ""}
      />
      <Outlet />
      <Footer />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
