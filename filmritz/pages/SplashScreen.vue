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
