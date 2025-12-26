<template>
  <div class="relative min-h-screen bg-[#0a0a0a]">
    <!-- 🌈 GLOBAL Ambient Lighting Layer -->
    <div
      v-if="isAmbientEnabled"
      class="fixed inset-0 pointer-events-none transition-all duration-1000 z-0 blur-3xl opacity-50"
      :style="{ background: ambientGradient }"
    />

    <!-- Ambient toggle button (md and larger screens only) -->
    <div class="fixed bottom-4 right-4 z-50 hidden md:block">
      <button
        @click="toggleAmbient"
        class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors shadow-lg"
      >
        <span class="flex items-center gap-2">
          <span>{{ isAmbientEnabled ? "🌈" : "⚫" }}</span>
          <span class="text-sm font-semibold">
            Ambient: {{ isAmbientEnabled ? "ON" : "OFF" }}
          </span>
        </span>
      </button>
    </div>

    <!-- Main Content with relative positioning -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <Navbar />

      <main class="grow">
        <router-view />
      </main>

      <Footer />

      <GlobalModal />
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

const { isAmbientEnabled, ambientGradient, toggle } = useAmbient();

const toggleAmbient = () => {
  console.log("Toggle clicked, current state:", isAmbientEnabled.value);
  toggle();
  console.log("New state:", isAmbientEnabled.value);
};

onMounted(() => {
  // Initialize ambient system once on layout mount
  initializeAmbient();
  console.log("MainLayout mounted, ambient enabled:", isAmbientEnabled.value);
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
