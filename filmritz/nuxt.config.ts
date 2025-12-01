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
  app: {
    head: {
      title: "FilmRitz — Discover Movies & TV Series",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "FilmRitz — Discover trending movies and TV series in a fast, modern, immersive interface.",
        },
        {
          name: "keywords",
          content: "filmritz, movies, tv shows, discover, trending, series, entertainment",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:site_name", content: "FilmRitz" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "FilmRitz — Discover Movies & TV Series" },
        {
          property: "og:description",
          content: "Explore trending films, series, and upcoming releases.",
        },
        {
          property: "og:image",
          content: "https://filmritz.vercel.app/filmritzlogo2.png",
        },
        { property: "og:url", content: "https://filmritz.vercel.app" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "FilmRitz — Discover Movies & TV Series" },
        {
          name: "twitter:description",
          content: "Explore trending films, series, and upcoming releases.",
        },
        {
          name: "twitter:image",
          content: "https://filmritz.vercel.app/filmritzlogo2.png",
        },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://filmritz.vercel.app" },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/ng"],
    },
  },
});
