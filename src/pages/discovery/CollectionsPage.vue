<template>
  <div class="min-h-screen text-white pb-20">
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

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
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
import { useHead } from "@unhead/vue";

useHead({
  title: "Curated Movie Collections — Hand-Picked Favorites | FilmRitz",
  meta: [
    {
      name: "description",
      content:
        "Explore our expert-curated collections of movies and TV shows. From hidden gems to all-time classics, find your next favorite on FilmRitz.",
    },
    { name: "robots", content: "index, follow" },
  ],
});

const ambientColor = ref("#b20710");

const updateAmbientColor = (color: string) => {
  ambientColor.value = color;
};
</script>
