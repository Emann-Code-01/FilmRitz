<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <!-- Video Player Container -->
    <div class="relative w-full bg-black aspect-video">
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-black/50"
      >
        <div class="animate-spin">
          <div
            class="w-16 h-16 border-4 border-[#b20710] border-t-transparent rounded-full"
          ></div>
        </div>
      </div>

      <!-- Placeholder Player -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-black"
      >
        <div class="text-center">
          <p class="text-xl text-gray-400">Video Player Coming Soon</p>
          <p class="text-sm text-gray-500 mt-2">
            This feature is under development
          </p>
        </div>
      </div>

      <!-- Player Controls Overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4 group hover:opacity-100 opacity-0 transition-opacity"
      >
        <div class="flex items-center justify-between text-white">
          <div class="flex items-center gap-4">
            <button class="hover:text-[#b20710] transition">▶ Play</button>
            <button class="hover:text-[#b20710] transition">⏸ Pause</button>
          </div>
          <button class="hover:text-[#b20710] transition">⛶ Fullscreen</button>
        </div>
      </div>
    </div>

    <!-- Episode/Media Info -->
    <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto py-8">
      <h1 class="text-3xl font-[Gilroy-Bold] mb-4">Media Title</h1>
      <p class="text-gray-400 font-[Gilroy-Regular] mb-6">
        Play the video above to watch your content
      </p>

      <!-- Related/Up Next -->
      <div class="mt-12">
        <h2 class="text-2xl font-[Gilroy-Bold] mb-6">Up Next</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="n in 3"
            :key="n"
            class="bg-white/5 rounded-xl border border-white/10 p-4 hover:border-[#b20710]/50 transition"
          >
            <div class="aspect-video bg-gray-800 rounded mb-3"></div>
            <p class="font-[Gilroy-SemiBold] text-sm">Episode {{ n }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";

const route = useRoute();
const loading = ref(true);

useHead({
  title: "Watching — FilmRitz",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

onMounted(() => {
  const mediaId = route.params.id;
  console.log("Loading media:", mediaId);

  // Simulate loading
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style scoped></style>
