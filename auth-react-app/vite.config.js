import { defineConfig } from 'vite'
import viteReact from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [viteReact()],
  server:{
    host:true,
    port:5173,
    allowedHosts:true
  },

})