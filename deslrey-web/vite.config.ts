import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true,
          filename: 'stats.html',
          gzipSize: true,
          brotliSize: true
        })
      ]
    }
  }
})
