import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import * as path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 3000,
  }
});
