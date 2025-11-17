<template>
  <div :key="key" class="relative w-full h-screen overflow-hidden bg-black">
    <!-- Background Video -->
    <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay muted playsinline>
      <source src="/videos/splash-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
      <source src="/videos/splash.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';

const router = useRouter();
const route = useRoute();
const key = ref(Math.random()); // unique key to force remount

watch(
  () => route.fullPath,
  () => {
    key.value = Math.random(); // remount on URL change
  }
);

const timer = ref<number | null>(null);

onMounted(() => {
  timer.value = window.setTimeout(() => {
    const redirectTo = route.query.redirect || '/ng';
    router.push(redirectTo as string);
  }, 2800);
});

onBeforeUnmount(() => {
  if (timer.value) clearTimeout(timer.value);
});

useHead({
  title: 'Welcome to FilmRitz | Streaming Reimagined',
  meta: [
    { name: 'description', content: 'Welcome to FilmRitz — your gateway to streaming entertainment reimagined. Loading your personalized experience...' },
    { name: 'robots', content: 'noindex, follow' },
    { name: 'theme-color', content: '#000000' },
    { property: 'og:title', content: 'Welcome to FilmRitz' },
    { property: 'og:description', content: 'FilmRitz — a new way to explore and enjoy your favorite movies and shows.' },
    { property: 'og:image', content: 'https://filmritz.vercel.app/filmritzlogo2.png' },
    { property: 'og:url', content: 'https://filmritz.vercel.app/ng' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Welcome to FilmRitz' },
    { name: 'twitter:description', content: 'FilmRitz — your gateway to modern streaming. Sit tight while we load your experience!' },
    { name: 'twitter:image', content: 'https://filmritz.vercel.app/filmritzlogo2.png' },
  ],
  link: [{ rel: 'canonical', href: 'https://filmritz.vercel.app/ng' }],
});
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
