import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import styleImport from 'vite-plugin-style-import'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // styleImport({
    //   libs: [
    //     {
    //       libraryName: 'element-plus',
    //       esModule: true,
    //       ensureStyleFile: true,
    //       resolveStyle: (name) => {
    //         return `element-plus/lib/theme-chalk/${name}.css`
    //       },
    //       resolveComponent: (name) => {
    //         return `element-plus/lib/${name}`
    //       }
    //     }
    //   ]
    // }),
    Components({
      resolvers: [VantResolver()]
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  resolve: {
    alias: {
      '~styles': path.resolve('./src/assets/css'),
      static: path.resolve('./src/assets'),
      '@apis': path.resolve('./src/api'),
      '@comps': path.resolve('./src/components'),
      '@': path.resolve('./src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve(
            'src/assets/css/util.less'
          )}";`
        },
        javascriptEnabled: true
      }
    }
  }
})
