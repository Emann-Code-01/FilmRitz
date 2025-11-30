// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,
  devtools: { enabled: true },
  modules: [],
  typescript: {
    strict: true,
  },
  imports: {
    dirs: ["composables"],
  },
  runtimeConfig: {
    public: {
      baseUrl: "https://filmritz.vercel.app",
      tmdbApiKey: process.env.VITE_TMDB_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/ng"],
    },
  },
});
