import { redirect } from "react-router";
import type { Route } from "./+types/class-redirect-page";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  if (type === "one-day") {
    return redirect("/class/one-day");
  } else if (type === "regular") {
    return redirect("/class/regular");
  } else {
    return redirect("/class/one-day");
  }
}
