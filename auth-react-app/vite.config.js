import { defineConfig } from 'vite';
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [viteReact()],
  server: {
    host: true,
    // eslint-disable-next-line no-process-env
    port: 5173,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'], 
          react: ['react', 'react-dom'], 
        },
      }, 
    },
    chunkSizeWarningLimit: 1000, 
  },
});