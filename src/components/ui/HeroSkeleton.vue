<template>
  <div
    class="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-center items-center text-center text-white animate-pulse">
    <div class="absolute inset-0 bg-white/10"></div>

    <div class="z-10 flex flex-col items-center gap-6 px-6">
      <!-- Title placeholder -->
      <div class="h-10 w-3/4 md:w-1/2 bg-white/20 rounded"></div>

      <!-- Subtitle placeholder -->
      <div class="h-5 w-1/3 bg-white/10 rounded"></div>

      <!-- Description placeholder -->
      <div class="space-y-2 w-2/3">
        <div class="h-3 bg-white/10 rounded"></div>
        <div class="h-3 bg-white/10 rounded w-1/2 mx-auto"></div>
      </div>

      <!-- Input + Button placeholder -->
      <div class="flex flex-col md:flex-row gap-3 mt-4 w-full md:w-auto justify-center">
        <div class="h-12 w-80 bg-white/20 rounded"></div>
        <div class="h-12 w-40 bg-red-700/60 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed — purely visual
</script>
