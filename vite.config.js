import { defineConfig } from 'vite'


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
    open:true,
  },
});
