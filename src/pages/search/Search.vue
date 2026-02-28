<template>
  <div class="min-h-screen text-white pb-20 mt-20">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 rounded-2xl bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-3xl"
          >
            🔍
          </div>
          <div>
            <h1 class="text-4xl md:text-5xl font-[Gilroy-Bold]">
              Search Results
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-1">
              Found
              <span class="text-[#b20710] font-[Gilroy-Bold]">{{
                filteredResults.length
              }}</span>
              results for "<span class="text-white font-[Gilroy-Bold]">{{
                query
              }}</span
              >"
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky top-22 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <FilterPanel @apply="onFilterApply" @clear="onFilterClear" />
      </div>
    </div>

    <div class="px-6 md:px-10 mx-auto mt-8">
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="relative rounded-2xl overflow-hidden bg-white/5 animate-pulse"
        >
          <div class="aspect-2/3 bg-gray-800"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredResults.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-xl font-[Gilroy-SemiBold] mb-2">
          No results found for "{{ query }}"
        </p>
        <p class="text-gray-500 font-[Gilroy-Regular]">
          Try adjusting your search terms or filters
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <MediaCard
          v-for="item in visibleResults"
          :key="item.id + '-' + (item.media_type || 'unknown')"
          :media="item"
        />
      </div>
    </div>

    <div v-if="filteredResults.length > itemsPerPage" class="text-center mt-12">
      <button
        @click="toggleView"
        :disabled="loading"
        class="px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {{
          loading ? "Loading..." : isExpanded ? "Show Less ↑" : "View More ↓"
        }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useMediaStore } from "@/stores/mediaStore";
import type { Media } from "@/types/media";
import FilterPanel from "@/components/media/FilterPanel.vue";
import MediaCard from "@/components/media/MediaCard.vue";
import { useHead } from "@unhead/vue";

const route = useRoute();
const store = useMediaStore();

const query = ref((route.query.q as string) || "");
const loading = ref(false);
const isExpanded = ref(false);
const itemsPerPage = 20;
const visibleCount = ref(itemsPerPage);
const currentPage = ref(1);
const filters = ref<{
  genre?: string;
  year?: number;
  rating?: number;
  type?: string;
  sort?: string;
}>({});

const filteredResults = computed(() => {
  let results = store.searchResults.filter((item: Media) => {
    if (
      filters.value.genre &&
      !item.genre_ids?.includes(Number(filters.value.genre))
    )
      return false;

    const year =
      item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
    if (filters.value.year && year !== String(filters.value.year)) return false;

    if (filters.value.rating && item.vote_average < filters.value.rating)
      return false;
    if (filters.value.type && item.media_type !== filters.value.type)
      return false;

    return true;
  });

  if (filters.value.sort === "newest") {
    results = results.sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date || 0).getTime() -
        new Date(a.release_date || a.first_air_date || 0).getTime(),
    );
  } else if (filters.value.sort === "oldest") {
    results = results.sort(
      (a, b) =>
        new Date(a.release_date || a.first_air_date || 0).getTime() -
        new Date(b.release_date || b.first_air_date || 0).getTime(),
    );
  }

  return results;
});

const visibleResults = computed(() =>
  filteredResults.value.slice(0, visibleCount.value),
);

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
  },
);

watch(
  () => query.value,
  () => {
    isExpanded.value = false;
    visibleCount.value = itemsPerPage;
  },
);

function toggleView() {
  if (isExpanded.value) {
    visibleCount.value = itemsPerPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    visibleCount.value += itemsPerPage;
  }
  isExpanded.value = !isExpanded.value;
}

function onFilterApply(newFilters: typeof filters.value) {
  filters.value = newFilters;
}

function onFilterClear() {
  filters.value = {};
}

useHead({
  title: computed(() => `Search: ${query.value} | FilmRitz`),
  meta: [
    {
      name: "description",
      content: computed(
        () => `Search results for "${query.value}" on FilmRitz`,
      ),
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
});
</script>
