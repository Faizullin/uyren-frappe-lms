import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import frappeuiPlugin from '@mono/mono-frappe-ui/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envConfig = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      vueDevTools(),
      frappeuiPlugin({
        envConfig,
        frappeProxy: true, // Setup proxy to Frappe backend
        lucideIcons: true, // Configure Lucide icons
        // jinjaBootData: true, // Inject server-side boot data
        // Generate TypeScript interfaces from DocTypes
        // frappeTypes: {
        //   input: {
        //     app_name: ['doctype_1', 'doctype_2'],
        //   },
        // },
        // Production build config for asset paths and HTML output
        buildConfig: {
          indexHtmlPath: '../lms/www/frontend.html',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
      },
    },
    optimizeDeps: {
      include: ['frappe-ui > feather-icons', 'showdown', 'engine.io-client'],
    },
  }
})
