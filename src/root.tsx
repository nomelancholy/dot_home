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
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user && user.id) {
    return { user };
  }

  return { user: null };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  console.log("root user  :>> ", user);

  const isLoggedIn = user !== null;

  console.log("root isLoggedIn :>> ", isLoggedIn);

  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-20 px-4 md:px-10">
      <Navigation
        isLoggedIn={isLoggedIn}
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
