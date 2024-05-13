/// <reference types="vitest" />

import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import { fileURLToPath, URL } from 'url'

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
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  build: {
    manifest: true,
  },
  test: {
    root: fileURLToPath(new URL('../', import.meta.url)),
    include: [
      'DataManagement/src/**/*.spec.{js,ts}',
      'shared/src/**/*.spec.{js,ts}',
    ],
    globals: true,
    environmentMatchGlobs: [['DataManagement/src/components/**', 'jsdom']],
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    environment: 'jsdom',
    coverage: {
      include: ['DataManagement/src/**/*.{js,ts}', 'shared/src/**/*.{js,ts}'],
      exclude: [
        '**/*.d.ts',
        'src/store/**',
        'DataManagement/src/composables/useUserTags.ts',
        'DataManagement/src/plugins/**',
        'DataManagement/src/router/**',
        'DataManagement/src/config/**',
        'DataManagement/src/store/**',
        'DataManagement/src/utils/mdi-icons.ts',
        'DataManagement/src/utils/materialColors.ts',
        'DataManagement/src/utils/plotting/graphSeriesUtils.ts',
        'DataManagement/src/utils/test/**',
        'DataManagement/src/utils/googleMaps/**',
        'DataManagement/src/App.vue',
        'DataManagement/src/main.ts',
        'DataManagement/src/vocabularies.ts',
        'DataManagement/postcss.config.js',
        'shared/src/services/api.ts',
        'shared/src/services/apiMethods.ts',
        'shared/src/services/handle401.ts',
        'shared/src/utils/rules.ts',
        'shared/src/utils/plotting/echarts.ts',
        'shared/src/utils/CSVDownloadUtils.ts',
        'shared/src/router/*',
        'shared/src/types/*',
        'shared/src/store/*',
        'shared/src/composables/*',
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
