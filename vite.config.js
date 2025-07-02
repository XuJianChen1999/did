import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import postcssPxToViewport from 'postcss-px-to-viewport'

const folderName = 'nft'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    base: `/${folderName}/`,
    define: {
      'process.env': env,
      'process.version': JSON.stringify(env.VITE_NODE_VERSION || 'v18.0.0'),
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [VantResolver()],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
      proxy: createViteProxy(),
    },
    build: {
      outDir: folderName,
      rollupOptions: {
        output: {
          // 对静态资源进行更细粒度的拆分
          assetFileNames: 'assets/[name]-[hash][extname]',
          // 对代码拆分的 chunk 进行命名
          chunkFileNames: 'js/[name]-[hash].js',
          // 入口文件的命名
          entryFileNames: 'js/[name]-[hash].js',
          // 手动拆包配置
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          postcssPxToViewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 375, // 视窗的宽度
            unitPrecision: 6, // 转换后值的精度
            viewportUnit: 'vw', // 转换成的视口单位
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            propList: ['*', '!border*', '!border-radius'],
            exclude: [/node_modules/],
          }),
        ],
      },
    },
  }
})

function createViteProxy() {
  const res = {}
  const VITE_PROXY = [['/api', 'https://www.ccoin.life/api']]

  VITE_PROXY.forEach(([prefix, target]) => {
    res[prefix] = {
      target,
      secure: false,
      changeOrigin: true,
      headers: {
        Referer: target,
      },
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
    }
  })
  return res
}
