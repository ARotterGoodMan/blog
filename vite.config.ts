import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  //配置每种资源打包位置
  build: {
    rollupOptions: {
      output: {
        assetFileNames(assetInfo) {
          if (assetInfo.names[0] && assetInfo.names[0].endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          //配置图片
          if (assetInfo.names[0] && /\.(png|jpe?g|gif|svg)$/.test(assetInfo.names[0])) {
            return 'img/[name]-[hash][extname]'
          }
          //配置字体
          if (assetInfo.names[0] && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.names[0])) {
            return 'fonts/[name]-[hash][extname]'
          }
          //其他资源
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
})
