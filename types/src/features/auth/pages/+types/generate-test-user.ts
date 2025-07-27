import type { MetaFunction } from "react-router";

export interface Route {
  LoaderArgs: { request: Request };
  ActionArgs: { request: Request };
  MetaFunction: MetaFunction;
  ComponentProps: {
    loaderData?: unknown;
    actionData?: unknown;
  };
}
