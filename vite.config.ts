import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer' // 新增

const { VITE_API_URL } = process.env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // 构建后自动打开分析报告
      filename: 'stats.html', // 输出文件路径
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  css: {
    postcss: './postcss.config.js', // 确保正确指向 PostCSS 配置
  },
  server: {
    open: false,
    host: '0.0.0.0',
    port: 2111,
    proxy: {
      '/v1': {
        target: 'http://192.168.2.16',
        changeOrigin: true,
        secure: false,
        rewrite: path => path, // 保持路径不变
      },
      'http://192.168.123.68:8000': {
        target: 'http://192.168.123.68:8000',
        changeOrigin: true,
        secure: false,
        rewrite: path => '',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  root: process.cwd(),
  publicDir: 'public',
  base: './',
  appType: 'spa',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境下移除console
        drop_debugger: true,
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库打包成单独的chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI库分离
          'ui-vendor': ['antd', '@ant-design/icons'],
          // 工具库分离
          'utils-vendor': ['axios', 'dayjs'],
          'echarts-vendor': ['echarts'],
          // icons分离
          'icons-vendor': ['lucide-react'],
          // docx
          'docx-vendor': ['docx'],
          // highlight
          'highlight-vendor': ['highlight.js'],
        },
        // 自定义chunk命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
