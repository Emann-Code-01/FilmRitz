import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), tailwindcss(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' to the 'src' directory
      // Add other aliases as needed, e.g.,
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@composables': path.resolve(__dirname, './src/composables'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
