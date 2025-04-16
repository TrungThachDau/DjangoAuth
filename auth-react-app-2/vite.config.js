import { defineConfig } from 'vite'
import viteReact from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: '/fe2/',
  plugins: [viteReact()],
  server: {
    host: true,
    port: 5174,
    allowedHosts: true,
  },
})