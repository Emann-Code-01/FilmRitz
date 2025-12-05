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
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Trending Now</h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              What everyone's watching this week
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="sticky top-16 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4">
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            class="shrink-0 px-6 py-3 rounded-full font-[Gilroy-SemiBold] transition-all duration-300"
            :class="selectedFilter === filter.value
              ? 'bg-[#b20710] text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 max-w-7xl mx-auto mt-8">
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="n in 20" :key="n" class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div
          v-for="(item, index) in filteredItems"
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

          <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs">⭐ {{ item.vote_average?.toFixed(1) }}</span>
            </div>
          </div>

          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-16 h-16 rounded-full bg-[#b20710] flex items-center justify-center shadow-2xl">
              <span class="text-3xl text-white ml-1">▶</span>
            </div>
          </div>

          <div class="absolute top-3 left-3 w-10 h-10 rounded-full bg-[#b20710] flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl">
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useModalStore } from '@/stores/modalStore';
import { fetchTrendingMedia, fetchTrendingMovies, fetchTrendingTV } from '@/api/tmdb';

const modalStore = useModalStore();

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' },
];

const selectedFilter = ref('all');
const trendingItems = ref<any[]>([]);
const loading = ref(true);

const filteredItems = computed(() => {
  if (selectedFilter.value === 'all') return trendingItems.value;
  return trendingItems.value.filter(item => item.media_type === selectedFilter.value);
});

const getImageUrl = (path: string | null): string => {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE';
};

const openModal = (item: any) => {
  modalStore.open(item.media_type, { movieId: item.id, mediaType: item.media_type });
};

const loadTrending = async () => {
  loading.value = true;
  try {
    if (selectedFilter.value === 'all') {
      trendingItems.value = await fetchTrendingMedia('week');
    } else if (selectedFilter.value === 'movie') {
      trendingItems.value = await fetchTrendingMovies('week');
    } else {
      trendingItems.value = await fetchTrendingTV('week');
    }
  } catch (error) {
    console.error('Failed to load trending:', error);
  } finally {
    loading.value = false;
  }
};

watch(selectedFilter, loadTrending);
onMounted(loadTrending);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>