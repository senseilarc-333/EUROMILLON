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
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        success: './success.html',
        cancel: './cancel.html',
        terminos: './terminos.html',
        privacidad: './privacidad.html',
        descargo: './descargo.html'
      }
    }
  }
});
