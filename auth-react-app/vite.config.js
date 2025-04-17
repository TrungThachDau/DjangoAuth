import { defineConfig,  } from 'vite'
import viteReact from "@vitejs/plugin-react";
export default defineConfig(() => {
  return {
    plugins: [viteReact()],
    server: {
      host: true,
      // eslint-disable-next-line no-process-env
      port: 5173,
      allowedHosts: true,
    },
  };
});