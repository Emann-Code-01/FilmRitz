<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-2xl bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl">
            🔥
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Trending Trailers</h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Most watched trailers this week
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 max-w-7xl mx-auto mt-8">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 12" :key="n" class="aspect-video bg-gray-800/50 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in trendingTrailers"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <div class="aspect-video overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w780${item.backdrop_path}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>

          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-20 rounded-full bg-[#b20710] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
              <span class="text-4xl text-white ml-1">▶</span>
            </div>
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3 class="text-white font-[Gilroy-Bold] text-lg line-clamp-1 mb-2">
              {{ item.title || item.name }}
            </h3>
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold]">
                #{{ index + 1 }} TRENDING
              </span>
              <span class="text-gray-300 text-sm">⭐ {{ item.vote_average?.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useModalStore } from '@/stores/modalStore';
import { fetchTrendingMedia } from '@/api/tmdb';

const modalStore = useModalStore();
const trendingTrailers = ref<any[]>([]);
const loading = ref(true);

const openModal = (item: any) => {
  modalStore.open(item.media_type, { movieId: item.id, mediaType: item.media_type });
};

onMounted(async () => {
  try {
    const data = await fetchTrendingMedia('week');
    trendingTrailers.value = data.slice(0, 18);
  } catch (error) {
    console.error('Failed to load trending trailers:', error);
  } finally {
    loading.value = false;
  }
});
</script>