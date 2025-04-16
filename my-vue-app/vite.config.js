import { defineConfig } from 'vite'
import viteReact from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [viteReact()],
  base: '/fe2/',
  server:{
    host:true,
    port:5175,
    allowedHosts:true
  },

})