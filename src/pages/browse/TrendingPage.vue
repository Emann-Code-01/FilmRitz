<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="md:flex items-center gap-4 hidden">
          <div
            class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
          >
            🔥
          </div>
          <div class="flex-1">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Trending Now
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              What everyone's watching this week
            </p>
          </div>
          <div class="flex gap-6">
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                {{ totalItems }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                {{ currentPage }}
              </div>
            </div>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <div
              class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
            >
              🔥
            </div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Trending Now
            </h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            What everyone's watching this week
          </p>
          <div class="flex gap-6 justify-center">
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-2xl font-[Gilroy-Bold] text-[#b20710]">
                {{ totalItems }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div class="text-2xl font-[Gilroy-Bold] text-[#b20710]">
                {{ currentPage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="changeFilter(filter.value)"
            class="shrink-0 px-3 md:px-6 py-2 md:py-2.5 rounded-full font-[Gilroy-SemiBold] transition-all duration-500 cursor-pointer"
            :class="
              selectedFilter === filter.value
                ? 'bg-[#b20710] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            "
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 mx-auto mt-8 max-w-7xl">
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="(item, index) in currentPageItems"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105 animate-fade-up"
          :style="{ animationDelay: `${index * 30}ms` }"
        >
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="getImageUrl(item.poster_path)"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          >
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs"
                >⭐ {{ item.vote_average?.toFixed(1) }}</span
              >
              <span class="text-gray-300 text-xs">
                {{
                  new Date(
                    item.release_date || item.first_air_date || ""
                  ).getFullYear()
                }}
              </span>
            </div>
          </div>

          <div
            class="absolute top-3 left-3 w-10 h-10 rounded-full bg-[#b20710] flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl"
          >
            #{{ (currentPage - 1) * 20 + index + 1 }}
          </div>
        </div>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-4 mb-12"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 md:px-6 py-2 md:py-2.5 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          ← Previous
        </button>

        <div
          class="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-md"
        >
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="page !== -1 && changePage(page)"
            class="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl font-[Gilroy-Bold] text-white transition-all cursor-pointer"
            :class="[
              page === currentPage
                ? 'bg-[#b20710]'
                : 'bg-white/10 hover:bg-white/20',
              page === -1 ? 'cursor-default hover:bg-white/10' : '',
            ]"
            :disabled="page === -1"
          >
            {{ page === -1 ? "..." : page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 md:px-6 py-2 md:py-2.5 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useModalStore } from "@/stores/modalStore";
import AdSlot from "@/components/ads/AdSlot.vue";
import {
  fetchTrendingMedia,
  fetchTrendingMovies,
  fetchTrendingTV,
} from "@/api/tmdb";

const modalStore = useModalStore();

const filters = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "TV Shows", value: "tv" },
];

const selectedFilter = ref("all");
const trendingItems = ref<any[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 20;

const filteredItems = computed(() => {
  if (selectedFilter.value === "all") return trendingItems.value;
  return trendingItems.value.filter(
    (item) => item.media_type === selectedFilter.value
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

const totalItems = computed(() => {
  return filteredItems.value.length;
});

const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1); // Ellipsis
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push(-1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push(-1);
      pages.push(total);
    }
  }

  return pages;
});

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
};

const openModal = (item: any) => {
  modalStore.open(item.media_type, {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const changeFilter = (filterValue: string) => {
  selectedFilter.value = filterValue;
  currentPage.value = 1; // Reset to page 1 when filter changes
};

const loadTrending = async () => {
  loading.value = true;
  try {
    // Fetch 3 pages for each filter to get 60+ items
    if (selectedFilter.value === "all") {
      trendingItems.value = await fetchTrendingMedia("week", 3);
    } else if (selectedFilter.value === "movie") {
      trendingItems.value = await fetchTrendingMovies("week", 3);
    } else {
      trendingItems.value = await fetchTrendingTV("week", 3);
    }
  } catch (error) {
    console.error("Failed to load trending:", error);
  } finally {
    loading.value = false;
  }
};

watch(selectedFilter, loadTrending);
onMounted(loadTrending);
</script>

<style scoped>
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.5s ease-out forwards;
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
