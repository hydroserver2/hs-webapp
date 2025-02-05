/// <reference types="vitest" />

import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: { configFile: 'src/styles/settings.scss' },
    }),
  ],
  optimizeDeps: {
    exclude: ['vuetify'],
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  resolve: {
    extensions: ['.js', '.json', '.vue', '.less', '.scss', '.ts'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    manifest: true,
  },
  test: {
    globals: true,
    environmentMatchGlobs: [['src/components/**', 'jsdom']],
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    environment: 'jsdom',
    coverage: {
      exclude: [
        '**/src/**/*.vue',
        '**/src/composables/useUserTags.ts',
        '**/src/composables/useHydroShare.ts',
        '**/src/services/getCSRFToken.ts',
        '**/src/plugins/**',
        '**/src/router/**',
        '**/src/store/**',
        '**/src/types/**',
        '**/src/config/**',
        '**/src/services/api.ts',
        '**/src/services/apiMethods.ts',
        '**/src/services/handle401.ts',
        '**/src/utils/mdi-icons.ts',
        '**/src/utils/materialColors.ts',
        '**/src/utils/CSVDownloadUtils.ts',
        '**/src/utils/plotting/echarts.ts',
        '**/src/utils/plotting/graphSeriesUtils.ts',
        '**/src/utils/test/**',
        '**/src/utils/googleMaps/**',
        '**/src/utils/rules.ts',
        '**/src/App.vue',
        '**/src/main.ts',
        '**/*.d.ts',
        '**/postcss.config.js',
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
