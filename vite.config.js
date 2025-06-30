import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://www.istpos.somee.com',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
