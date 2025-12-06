<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Ambient Glow -->
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
          Curated Collections
        </h1>
        <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
          Hand-picked lists
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COLLECTIONS GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto">
      <!-- Loading Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="n in 6"
          :key="n"
          class="h-64 bg-gray-800/50 rounded-xl animate-pulse"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Fetch collections
</script>
