import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/create-checkout-session': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
