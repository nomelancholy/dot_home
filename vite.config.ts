import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // sourcemap 관련 경고 무시
        if (warning.code === "SOURCEMAP_ERROR") {
          return;
        }
        warn(warning);
      },
      external: ["@react-email/components"],
    },
  },
  esbuild: {
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: ["@react-email/components"],
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  define: {
    __EXCLUDE_REACT_EMAIL__: JSON.stringify(true),
  },
  ssr: {
    external: ["@react-email/components"],
  },
});
