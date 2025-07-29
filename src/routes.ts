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
  ...prefix("product", [
    route("detail", "features/shop/pages/product-detail-page.tsx"),
  ]),
  ...prefix("class", [
    index("features/class/pages/class-redirect-page.tsx"),
    route("one-day", "features/class/pages/class-one-day-page.tsx"),
    route("regular", "features/class/pages/class-regular-page.tsx"),
  ]),
  route("contact", "features/contact/pages/contact-page.tsx"),
  ...prefix("auth", [
    route("/find-password", "features/auth/pages/find-password-page.tsx"),
    route("/login", "features/auth/pages/login-page.tsx"),
    route("/signup-method", "features/auth/pages/signup-method-page.tsx"),
    route("/signup", "features/auth/pages/email-signup-page.tsx"),
    route("/logout", "features/auth/pages/logout-page.tsx"),
    route("/welcome", "common/pages/welcome-page.tsx"),
    ...prefix("/social/:provider", [
      route("/start", "features/auth/pages/social-start-page.tsx"),
      route("/complete", "features/auth/pages/social-complete-page.tsx"),
    ]),
  ]),
  ...prefix("admin", [
    index("features/admin/pages/admin-page.tsx"),
    route(
      "product-registration",
      "features/admin/pages/product-registration-page.tsx"
    ),
    route(
      "category-registration",
      "features/admin/pages/category-registration-page.tsx"
    ),
  ]),
  ...prefix("my", [
    route("history", "features/my/pages/history-page.tsx"),
    route("profile", "features/my/pages/profile-page.tsx"),
  ]),
] satisfies RouteConfig;
