<template>
  <div class="flex flex-col items-center justify-center h-screen bg-black text-white">
    <transition name="fade" appear>
      <h1 class="text-4xl font-bold mb-3 animate-pulse">🎬 FilmRitz</h1>
    </transition>
    <p class="text-gray-400">Loading your experience...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useHead } from '@vueuse/head';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/ng");
  }, 2500);
});

useHead({
  title: 'Welcome to FilmRitz | Streaming Reimagined',
  meta: [
    {
      name: 'description',
      content:
        'Welcome to FilmRitz — your gateway to streaming entertainment reimagined. Loading your personalized experience...',
    },
    {
      name: 'robots',
      content: 'noindex, follow', // ensures search engines don’t index this splash page
    },
    {
      name: 'theme-color',
      content: '#000000',
    },

    // Open Graph
    { property: 'og:title', content: 'Welcome to FilmRitz' },
    {
      property: 'og:description',
      content:
        'FilmRitz — a new way to explore and enjoy your favorite movies and shows.',
    },
    { property: 'og:image', content: 'https://filmritz.vercel.app/default-og.jpg' },
    { property: 'og:url', content: 'https://filmritz.vercel.app/' },
    { property: 'og:type', content: 'website' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Welcome to FilmRitz' },
    {
      name: 'twitter:description',
      content:
        'FilmRitz — your gateway to modern streaming. Sit tight while we load your experience!',
    },
    { name: 'twitter:image', content: 'https://filmritz.vercel.app/default-og.jpg' },
  ],
  link: [{ rel: 'canonical', href: 'https://filmritz.vercel.app/' }],
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
