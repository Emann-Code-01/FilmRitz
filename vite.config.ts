import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), tailwindcss(), svgLoader()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias '@' to the 'src' directory
      // Add other aliases as needed, e.g.,
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@composables": path.resolve(__dirname, "./src/composables"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@stores": path.resolve(__dirname, "./src/stores"),
    },
  },
  build: {
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.* in production
        drop_debugger: true,
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vue-vendor": ["vue", "vue-router", "pinia"],
          "ui-vendor": ["@headlessui/vue", "@heroicons/vue"],
          "utils-vendor": ["axios", "colorthief"],
        },
        // Chunk file naming
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // Warn if chunk exceeds 500kb
    // Source maps for production debugging (optional)
    sourcemap: false,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ["vue", "vue-router", "pinia", "axios"],
  },
});
