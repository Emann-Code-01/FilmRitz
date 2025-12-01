<template>
  <div class="min-h-screen text-white py-10 px-6 md:px-10 mt-15 transition-all duration-900 animate-fade-up">
    <!-- Filter panel -->
    <FilterPanel @apply="onFilterApply" @clear="onFilterClear" />

    <h1 class="text-2xl font-[Gilroy-SemiBold] mb-6">
      Search results for "<span class="text-red-500 font-[Gilroy-Bold]">{{ query }}</span>"
    </h1>

    <!-- 🔄 Skeleton Loader -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="n in 10" :key="n"
        class="relative w-full h-80 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 animate-pulse">
        <div class="absolute inset-0 bg-linear-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] animate-shimmer"></div>
        <div class="absolute bottom-3 left-3 right-3 space-y-2">
          <div class="h-4 bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-700 rounded w-1/2"></div>
          <div class="flex gap-2 mt-2">
            <div v-for="i in 3" :key="i" class="h-4 w-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredResults.length === 0" class="text-gray-500 text-center mt-10 font-[Gilroy-Bold]">
      No results found.
    </div>

    <!-- Results grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div role="status" v-for="item in visibleResults" :key="item.id + '-' + (item.media_type || 'unknown')"
        class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40"
        @click="openMediaModal(item)">
        <img loading="lazy" :src="item
          ? getPoster(item)
          : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'" alt="Poster"
          class="w-full h-64 object-cover group-hover:scale-105 transition-all duration-300" />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/90 via-transparent opacity-100 group-hover:opacity-100 transition-all">
        </div>
        <div class="absolute bottom-3 left-3">
          <title as="h3" class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">
            {{ item.title || item.name }}
          </title>
          <p class="text-gray-400 font-[Gilroy-Medium] text-sm">
            {{ new Date(item?.release_date).getFullYear() }} · ⭐
            {{ item.vote_average?.toFixed(1) }}
          </p>
          <p class="flex flex-wrap gap-2">
            <span v-for="genreName in getGenreNames(getGenreIdsFromMedia(item))" :key="genreName"
              class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200">
              {{ genreName }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div v-if="filteredResults.length > itemsPerPage" class="text-center mt-6">
      <button @click="toggleView" :disabled="loading"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-[Gilroy-SemiBold] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
        {{ loading ? "Loading..." : isExpanded ? "Show Less" : "View More" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useMediatore } from "@/stores/mediaStore";
import { useModalStore } from "@/stores/modalStore";
import { genreMap } from "@/types/media";
import type { Media } from "@/types/media";
import FilterPanel from "@/components/media/FilterPanel.vue";
import { useHead } from '@unhead/vue'

const route = useRoute();
const store = useMediatore();
const modalStore = useModalStore();

const query = ref((route.query.q as string) || "");
const loading = ref(false);
const isExpanded = ref(false);
const itemsPerPage = 10;
const visibleCount = ref(itemsPerPage);
const currentPage = ref(1);
const filters = ref<{ genre?: string; year?: number; rating?: number; type?: string; sort?: string }>({});

const filteredResults = computed(() => {
  let results = store.searchResults.filter((item: Media) => {
    if (filters.value.genre && !item.genre_ids?.includes(Number(filters.value.genre))) return false;

    const year = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
    if (filters.value.year && year !== String(filters.value.year)) return false;

    if (filters.value.rating && item.vote_average < filters.value.rating) return false;
    if (filters.value.type && item.media_type !== filters.value.type) return false;

    return true;
  });

  if (filters.value.sort === "newest") {
    results = results.sort((a, b) => new Date(b.release_date || b.first_air_date || 0).getTime() - new Date(a.release_date || a.first_air_date || 0).getTime());
  } else if (filters.value.sort === "oldest") {
    results = results.sort((a, b) => new Date(a.release_date || a.first_air_date || 0).getTime() - new Date(b.release_date || b.first_air_date || 0).getTime());
  }

  return results;
});

const visibleResults = computed(() => filteredResults.value.slice(0, visibleCount.value));

async function fetchResults(searchQuery: string, page = 1) {
  if (!searchQuery.trim()) return;
  loading.value = true;
  try {
    await store.searchMulti(searchQuery, page);
    currentPage.value = page;
  } finally {
    loading.value = false;
  }
}

onMounted(() => fetchResults(query.value));

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      query.value = newQuery as string;
      fetchResults(query.value);
    }
  }
);

watch(
  () => query.value,
  () => {
    isExpanded.value = false;
    visibleCount.value = itemsPerPage;
  }
);

function openMediaModal(item: Media) {
  const type = item.media_type ?? "movie";
  modalStore.open(type, { movieId: item.id });
}

function getPoster(item: any) {
  return item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat";
}

function getGenreIdsFromMedia(media: any): number[] {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres)) return media.genres.map((g: { id: number }) => g.id);
  return [];
}

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return ["Unknown"];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

function toggleView() {
  if (isExpanded.value) visibleCount.value = itemsPerPage;
  else visibleCount.value += itemsPerPage;
  isExpanded.value = !isExpanded.value;
}

function onFilterApply(newFilters: typeof filters.value) {
  filters.value = newFilters;
}
function onFilterClear() {
  filters.value = {};
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  animation: shimmer 1.5s infinite;
}
</style>
