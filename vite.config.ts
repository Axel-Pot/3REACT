import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@layouts': resolve(__dirname, './src/layouts'),
      '@services': resolve(__dirname, './src/services'),
      '@components': resolve(__dirname, './src/components')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test.setup.js'
  }
} as UserConfig)