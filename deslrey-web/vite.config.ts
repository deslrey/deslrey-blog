import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        // 手动拆分大依赖
        manualChunks: {
          // 把 bytemd 核心 + 插件拆出去
          bytemd: [
            'bytemd',
            '@bytemd/plugin-breaks',
            '@bytemd/plugin-frontmatter',
            '@bytemd/plugin-gfm',
            '@bytemd/plugin-highlight',
            '@bytemd/plugin-medium-zoom',
            '@bytemd/react'
          ],
          // 高亮库单独拆包
          highlight: ['highlight.js', 'lowlight'],
          // 其他可能大依赖拆包
          react: ['react', 'react-dom', 'react-router', 'zustand', 'classnames', 'styled-components']
        }
      },
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
