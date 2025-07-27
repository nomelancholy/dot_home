import type {
  LoaderFunctionArgs,
  MetaFunction as RouterMetaFunction,
} from "react-router";

export namespace Route {
  export type LoaderArgs = LoaderFunctionArgs;
  export type MetaFunction = RouterMetaFunction;

  export interface ComponentProps {
    loaderData: Awaited<ReturnType<typeof loader>>;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  // This is just for type generation, actual implementation is in the component file
  return {};
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Welcome - Day Off Today" },
    { name: "description", content: "Welcome to Day Off Today" },
  ];
};
