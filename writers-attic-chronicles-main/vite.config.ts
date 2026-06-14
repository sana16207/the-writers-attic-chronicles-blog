import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  vite: {
    resolve: {
      // IMPORTANT: prevents Windows path parsing issues in router plugin
      preserveSymlinks: false,
    },
  },
});