<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div class="md:flex items-center gap-4 hidden">
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
                {{ pagination.totalItems.value }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.currentPage.value }}
              </div>
            </div>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Trending Now
            </h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            What everyone's watching this week
          </p>
          <div class="flex gap-6">
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-2xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.totalItems.value }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div class="text-2xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.currentPage.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
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

    <div class="px-6 md:px-10 mx-auto mt-8 max-w-[1230px] lg:max-w-[1440px]">
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
        <MediaCard
          v-for="(item, index) in pagination.pagedItems.value"
          :key="item.id"
          :media="item"
          :rank="pagination.startIndex.value + index"
          class="animate-fade-up"
          :style="{ animationDelay: `${index * 30}ms` }"
        />
      </div>

      <!-- Use Pagination component -->
      <Pagination
        :model-value="pagination.currentPage.value"
        @update:model-value="pagination.changePage"
        :total-items="pagination.totalItems.value"
        :total-pages="pagination.totalPages.value"
        :per-page="pagination.perPage.value"
        :start-index="pagination.startIndex.value"
        :end-index="pagination.endIndex.value"
        show-info
        show-ellipsis
        show-labels
        :max-buttons="7"
        theme-color="#b20710"
      />
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { usePagination } from "@/composables/usePagination";
import AdSlot from "@/components/ads/AdSlot.vue";
import Pagination from "@/components/ui/Pagination.vue";
import MediaCard from "@/components/media/MediaCard.vue";
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

const filteredItems = computed(() => {
  if (selectedFilter.value === "all") return trendingItems.value;
  return trendingItems.value.filter(
    (item) => item.media_type === selectedFilter.value,
  );
});

// Use pagination composable
const pagination = usePagination(filteredItems, {
  perPage: 20,
  scrollBehavior: "smooth",
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

const changeFilter = (filterValue: string) => {
  selectedFilter.value = filterValue;
  pagination.reset(); // Reset to page 1 when filter changes
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
