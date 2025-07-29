import type { MetaFunction } from "react-router";

export interface Route {
  LoaderArgs: { request: Request };
  ActionArgs: { request: Request };
  MetaFunction: MetaFunction;
  ComponentProps: {
    loaderData?: {
      user: any;
      profile: any;
      orders: any[];
      shippingAddresses: any[];
    };
    actionData?: {
      success?: boolean;
      error?: string;
    };
  };
}
