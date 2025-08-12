import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/ReteJS-custom-nodes/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  }
})
