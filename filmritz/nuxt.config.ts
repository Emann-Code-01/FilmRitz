// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-icon', "@nuxtjs/tailwindcss"],
  ssr: true,

  app: {
    head: {
      title: "FilmRitz — Discover Movies & TV Shows",
      meta: [
        { name: "description", content: "FilmRitz lets you browse movies, TV shows, trailers and details. Inspired by Netflix." },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { property: "og:title", content: "FilmRitz" },
        { property: "og:description", content: "Discover movies and TV shows with a clean Netflix-inspired UI." },
        { property: "og:type", content: "website" }
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" }
      ]
    }
  }
})