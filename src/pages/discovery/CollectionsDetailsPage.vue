<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER WITH COLLECTION THEME -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      
      <!-- Dynamic Color linear -->
      <div 
        class="absolute inset-0 blur-3xl opacity-40 transition-all duration-1000"
        :style="{ background: `radial-linear(circle at 30% 50%, ${collection?.color}60, transparent 70%)` }"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <router-link 
          to="/ng/collections" 
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-[Gilroy-Medium]"
        >
          ← Back to Collections
        </router-link>

        <div class="flex items-center gap-4 mb-6">
          <div 
            class="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
            :style="{ backgroundColor: `${collection?.color}20`, border: `3px solid ${collection?.color}` }"
          >
            {{ collection?.icon }}
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              {{ collection?.title }}
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              {{ collection?.items.length }} handpicked titles
            </p>
          </div>
        </div>

        <p class="text-xl text-gray-300 font-[Gilroy-Regular] max-w-3xl">
          {{ collection?.description }}
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COLLECTION ITEMS GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto">
      
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="n in 20" :key="n" class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Items Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div
          v-for="(item, index) in collection?.items"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Poster -->
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <!-- linear Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <!-- Info Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>
            
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
              <span class="text-gray-300 text-xs">
                {{ new Date(item.release_date || item.first_air_date || "").getFullYear() }}
              </span>
            </div>
          </div>

          <!-- Play Icon -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
              :style="{ backgroundColor: collection?.color }"
            >
              <span class="text-3xl text-white ml-1">▶</span>
            </div>
          </div>

          <!-- Ranking Badge -->
          <div 
            class="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl"
            :style="{ backgroundColor: collection?.color }"
          >
            {{ index + 1 }}
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useModalStore } from '@/stores/modalStore';

const route = useRoute();
const modalStore = useModalStore();

interface Collection {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
  items: any[];
}

const collection = ref<Collection | null>(null);
const loading = ref(true);

const openModal = (item: any) => {
  modalStore.open(item.media_type || 'movie', { movieId: item.id, mediaType: item.media_type });
};

onMounted(async () => {
  const collectionId = Number(route.params.id);
  
  // Simulate API call - replace with actual implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  collection.value = {
    id: collectionId,
    title: 'Epic Sci-Fi',
    icon: '🚀',
    color: '#3B82F6',
    description: 'Mind-bending journeys through space and time that will leave you questioning reality itself.',
    items: [] // Fetch from API based on collectionId
  };
  
  loading.value = false;
});
</script>