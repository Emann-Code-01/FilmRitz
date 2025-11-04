<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-black text-white">
    <h1 class="text-5xl font-[Gilroy-Bold]old mb-4 animate-pulse">🚧 Page Not Available</h1>
    <p class="text-lg text-gray-400 mb-6">
      This page is under construction. Check back soon!
    </p>
    <router-link to="/ng" class="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-300">
      Go Home
    </router-link>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Page Not Available | FilmRitz — Discover Movies & TV Series',
  meta: [
    {
      name: 'description',
      content:
        'This FilmRitz page is currently under construction. We’re working on something exciting — check back soon for updates!',
    },
    {
      name: 'keywords',
      content:
        'FilmRitz, coming soon, under construction, unavailable page, streaming platform, movies, series',
    },

    // Open Graph
    { property: 'og:title', content: 'Page Not Available | FilmRitz' },
    {
      property: 'og:description',
      content:
        'This FilmRitz page is under construction. Stay tuned for exciting updates and new movie experiences.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://filmritz.vercel.app/' },
    { property: 'og:image', content: 'https://filmritz.vercel.app/default-og.jpg' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Page Not Available | FilmRitz' },
    {
      name: 'twitter:description',
      content:
        'The page you’re looking for is currently unavailable. FilmRitz is working hard to bring new experiences your way!',
    },
    { name: 'twitter:image', content: 'https://filmritz.vercel.app/default-og.jpg' },
  ],
  link: [{ rel: 'canonical', href: 'https://filmritz.vercel.app/' }],
})
</script>
