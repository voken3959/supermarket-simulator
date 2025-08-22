import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use BASE_URL at build time to set the base path for the site.
// For GitHub Pages set BASE_URL to "/<repo-name>/" (example: "/supermarket-sim/") in the workflow.
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react()],
  server: {
    port: 5173
  }
});
