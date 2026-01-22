<template>
  <div class="relative min-h-screen bg-[#0a0a0a]">
    <!-- 🌈 GLOBAL Ambient Lighting Layer -->
    <div
      v-if="isAmbientEnabled"
      class="fixed inset-0 pointer-events-none transition-all duration-1000 z-0 blur-3xl opacity-50"
      :style="{ background: ambientGradient }"
    />

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <Navbar />

      <main class="grow mt-10">
        <router-view />
      </main>

      <Footer />

      <CookieBanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import Navbar from "@/components/common/Navbar.vue";
import Footer from "@/components/common/Footer.vue";
import CookieBanner from "@/components/ui/CookieBanner.vue";

import { useAmbient, initializeAmbient } from "@/composables/useAmbient";

const { isAmbientEnabled, ambientGradient } = useAmbient();

onMounted(() => {
  initializeAmbient();
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #b20710;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e32125;
}
</style>
