<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>
      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="md:flex items-center gap-4 hidden">
          <div
            class="w-20 h-20 rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl"
          >
            🎬
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Coming Soon</h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Upcoming releases you won't want to miss
            </p>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <div
              class="w-20 h-20 rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl"
            >
              🎬
            </div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Coming Soon</h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            Upcoming releases you won't want to miss
          </p>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 mx-auto mt-8">
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="bg-gray-800/50 rounded-2xl p-4 animate-pulse"
        >
          <div class="aspect-2/3 bg-gray-700 rounded-xl mb-3"></div>
          <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div
          v-for="item in upcomingItems"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="getImageUrl(item.poster_path)"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div
            class="absolute inset-0 bg-linear-to-b from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
          <div class="absolute top-5 left-5 flex items-center gap-2 text-xs">
            <span
              class="px-2 py-1 bg-[#b20710] rounded-md font-[Gilroy-SemiBold]"
            >
              {{ getCountdown(item.release_date || item.first_air_date) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { fetchUpcomingMedia } from "@/api/tmdb";
import AdSlot from "@/components/ads/AdSlot.vue";

const modalStore = useModalStore();
const upcomingItems = ref<any[]>([]);
const loading = ref(true);

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
};

const getCountdown = (date: string): string => {
  if (!date) return "TBA";
  const releaseDate = new Date(date);
  const now = new Date();
  const diff = releaseDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Released";
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  return `${Math.floor(days / 30)} months`;
};

const openModal = (item: any) => {
  modalStore.open(item.media_type, {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

onMounted(async () => {
  try {
    upcomingItems.value = await fetchUpcomingMedia();
  } catch (error) {
    console.error("Failed to load upcoming:", error);
  } finally {
    loading.value = false;
  }
});
</script>
