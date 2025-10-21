<template>
  <div>
    <div
      v-if="!auth.loaded"
      class="flex items-center justify-center min-h-screen text-white"
    >
      <p class="animate-pulse text-lg tracking-wide">
        Yo, welcome back to FilmRitz — we’ve been expecting you! Let’s dive into
        what’s trending. 🎬
      </p>
    </div>

    <HeroSection />

    <template v-if="!isLoggedIn">
      <SubPreview />
      <BlockSection />
    </template>

    <template v-else>
      <main class="space-y-10 p-6 text-white">
        <section>
          <h2 class="text-2xl font-[Gilroy-Bold]old mb-3">🔥 Trending Now</h2>
          <TrendingNow />
        </section>

        <section>
          <h2 class="text-2xl font-[Gilroy-Bold]old mb-3">⭐ Top Rated</h2>
          <TopRated />
        </section>

        <!-- Upcoming -->
        <section>
          <h2 class="text-2xl font-[Gilroy-Bold]old mb-3">🎬 Coming Soon</h2>
          <upComing />
        </section>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import HeroSection from "../components/PHome/HeroSection.vue";
import SubPreview from "../components/PHome/SubPreview.vue";
import BlockSection from "../components/PHome/BlockSection.vue";
import TrendingNow from "../components/movies/TrendingNow.vue";
import TopRated from "../components/movies/TopRated.vue";
import upComing from "../components/movies/ComingSoon.vue";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);
</script>

<style scoped></style>
