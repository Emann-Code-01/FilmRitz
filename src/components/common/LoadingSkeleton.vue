<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-black text-white">
    <div class="flex flex-col items-center space-y-8 w-full max-w-md px-6">
      <!-- FilmRitz Logo Placeholder -->
      <div class="relative h-12 w-48 overflow-hidden rounded-xl bg-gray-800 shimmer"></div>

      <!-- Title Placeholder -->
      <div class="relative h-6 w-64 overflow-hidden rounded-lg bg-gray-800 shimmer"></div>

      <!-- Movie Thumbnails Grid Placeholder -->
      <div class="grid grid-cols-3 gap-3 w-full mt-6">
        <div
          v-for="i in 6"
          :key="i"
          class="relative h-32 w-full overflow-hidden rounded-lg bg-gray-800 shimmer"
        ></div>
      </div>

      <!-- Subtext Placeholder -->
      <div class="relative h-4 w-48 overflow-hidden rounded-lg bg-gray-800 shimmer"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Shimmer Animation */
.shimmer::before {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  animation: shimmer 1.8s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
