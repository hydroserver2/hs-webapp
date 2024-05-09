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
      'QualityControl/src/**/*.spec.{js,ts}',
      'shared/src/**/*.spec.{js,ts}',
    ],
    globals: true,
    environmentMatchGlobs: [['QualityControl/src/components/**', 'jsdom']],
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    environment: 'jsdom',
    coverage: {
      include: ['QualityControl/src/**/*.{js,ts}', 'shared/src/**/*.{js,ts}'],
      exclude: [
        '**/*.d.ts',
        'src/store/**',
        'shared/src/services/api.ts',
        'shared/src/services/apiMethods.ts',
        'shared/src/services/handle401.ts',
        'shared/src/utils/rules.ts',
        'shared/src/router/*',
        'shared/src/types/*',
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
