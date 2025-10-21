<template>
  <div
    class="flex flex-col items-center justify-center h-screen bg-black text-white"
  >
    <transition name="fade" appear>
      <h1 class="text-4xl font-bold mb-3 animate-pulse">🎬 FilmRitz</h1>
    </transition>
    <p class="text-gray-400">Loading your experience...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/ng");
  }, 2500);
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
