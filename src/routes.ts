import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  route("about", "features/about/pages/about-page.tsx"),
  route("shop", "features/shop/pages/shop-page.tsx"),
  ...prefix("class", [
    index("features/class/pages/class-redirect-page.tsx"),
    route("one-day", "features/class/pages/class-one-day-page.tsx"),
    route("regular", "features/class/pages/class-regular-page.tsx"),
  ]),

  route("contact", "features/contact/pages/contact-page.tsx"),
] satisfies RouteConfig;
