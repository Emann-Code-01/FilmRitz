<template>
  <div>
    <div v-if="!auth.loaded" class="flex items-center justify-center min-h-screen bg-black text-white">
      <p class="animate-pulse text-lg tracking-wide">Loading FilmRitz...</p>
    </div>

    <template v-else-if="!isLoggedIn">
      <HeroSection />
      <SubPreview />
      <BlockSection />
    </template>

    <template v-else>
      <div class="text-white min-h-screen bg-black">
        <h1 class="text-center text-4xl font-bold py-10">Welcome back to FilmRitz 🎬</h1>
        <!-- Replace this with your logged-in dashboard -->
        <p class="text-center opacity-80">Movies are loading for your account...</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import HeroSection from "../components/PHome/HeroSection.vue";
import SubPreview from "../components/PHome/SubPreview.vue";
import BlockSection from "../components/PHome/BlockSection.vue";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);

onMounted(() => {
  if (!auth.loaded) {
    auth.syncUser();
  }
});
</script>

<style scoped></style>
