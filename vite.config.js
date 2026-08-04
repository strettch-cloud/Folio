import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
   server: {
    watch: {
      // Prevents Vite from watching server files and triggering hot reloads
      ignored: ['**/server/**'] 
    }
  },
  build: {
    rollupOptions: {
      // Ensures Rollup completely ignores the server directory if referenced
      external: [
        /^\.\/server\/.*/,
        /^\/server\/.*/
      ]
    }
  }
})
