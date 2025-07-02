import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  define: {
    'import.meta.env.VITE_USERS': JSON.stringify(process.env.VITE_USERS || '[]'),
  },
});
