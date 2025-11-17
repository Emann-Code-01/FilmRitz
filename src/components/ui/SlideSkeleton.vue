<template>
  <div class="relative w-full h-screen overflow-hidden bg-black animate-pulse">
    <!-- Background placeholder -->
    <div class="absolute inset-0 bg-white/10"></div>

    <!-- Gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"
    ></div>

    <!-- Content placeholders -->
    <div
      class="relative z-10 flex flex-col justify-end h-full p-10 text-white space-y-4"
    >
      <div class="h-8 bg-white/20 w-2/3 rounded"></div>
      <div class="flex gap-3">
        <div class="h-5 w-12 bg-[#b20710]/70/60 rounded"></div>
        <div class="h-5 w-16 bg-white/10 rounded"></div>
      </div>

      <div class="h-4 bg-white/10 rounded w-3/4"></div>
      <div class="h-4 bg-white/10 rounded w-2/3"></div>
      <div class="h-4 bg-white/10 rounded w-1/3"></div>
    </div>
  </div>
</template>

<script setup>
// purely visual
</script>
