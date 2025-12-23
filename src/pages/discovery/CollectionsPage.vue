<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Ambient Glow with dynamic color -->
      <div
        class="absolute inset-0 blur-3xl transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 30% 50%, ${ambientColor}40, transparent 70%)`,
        }"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] mb-3">
          Curated Collections
        </h1>
        <p class="text-xl text-gray-400 font-[Gilroy-Medium]">
          Explore our hand-picked collections for every mood and genre
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COLLECTIONS GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 max-w-[1590px] mx-auto">
      <CuratedCollections @update-ambient="updateAmbientColor" />
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdSlot from "@/components/ads/AdSlot.vue";
import CuratedCollections from "@/components/media/CuratedCollections.vue";

const ambientColor = ref("#b20710");

const updateAmbientColor = (color: string) => {
  ambientColor.value = color;
};
</script>
