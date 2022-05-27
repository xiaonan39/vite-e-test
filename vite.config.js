import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: 'src/assets/'
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: 'API',
        replacement: path.resolve(__dirname, 'src/api/index.js')
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  plugins: [
    vue(),
    viteMockServe({
      supportTs: false, // 是否使用ts
      mockPath: './src/mock',
      watchFiles: true, // 监视文件更改
      prodEnabled: false, // 生产打包开关
      localEnabled: true // 开发打包开关
    })
  ],
  server: {
    host: '0.0.0.0', // host设置为true才可以使用network的形式，以ip访问项目
    port: 8888, // 端口号
    open: true, // 自动打开浏览器
    cors: true, // 跨域设置允许
    strictPort: true, // 如果端口已占用直接退出
    proxy: {
      '/mock': {
        // target: 'http://172.31.2.58:8200/',
        target: 'http://localhost:8800/', // 测试联调
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace('/mock/', '/')
      }
    }
  },
  build: {
    minify: 'esbuild',
    brotliSize: false,
    // 是否css文件分割
    sourcemap: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 2000,
    // 在生产环境移除console.log
    /* terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    assetsDir: 'assets', */
    // 静态资源打包到dist下的不同目录
    rollupOptions: {
      target: 'esnext',
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: function (assetInfo) {
          return 'static/[ext]/[name]-[hash].[ext]'
        },
        manualChunks: {
          element: ['element-plus']
        }
      }
    }
  }
})
