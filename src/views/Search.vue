<template>
  <div class="min-h-screen text-white py-10 px-6 md:px-10 mt-10">
    <!-- Filter panel -->
    <FilterPanel @apply="onFilterApply" @clear="onFilterClear" />

    <h1 class="text-2xl font-[Gilroy-SemiBold] mb-6">
      Search results for "<span class="text-red-500 font-[Gilroy-Bold]">{{
        query
      }}</span
      >"
    </h1>

    <!-- Loading / empty states -->
    <div
      v-if="loading"
      class="text-gray-400 text-center mt-10 font-[Gilroy-Bold]"
    >
      Loading results...
    </div>

    <div
      v-else-if="filteredResults.length === 0"
      class="text-gray-500 text-center mt-10 font-[Gilroy-Bold]"
    >
      No results found.
    </div>

    <!-- Movies grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <div
        v-for="movie in visibleResults"
        :key="movie.id"
        class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40"
        @click="openMovieModal(movie)"
      >
        <img
          :src="getPoster(movie.poster_path)"
          alt=""
          class="w-full h-64 object-cover group-hover:scale-105 transition-all duration-300"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-70 group-hover:opacity-100 transition-all"
        ></div>
        <div class="absolute bottom-3 left-3">
          <h3 class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">
            {{ movie.title }}
          </h3>
          <p class="text-gray-400 text-sm">
            {{ new Date(movie.release_date).getFullYear() }} · ⭐{{
              movie.vote_average?.toFixed(1)
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- View More button -->
    <div v-if="filteredResults.length > visibleCount" class="text-center mt-6">
      <button
        @click="showMore"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-[Gilroy-SemiBold]"
      >
        View More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "../stores/movieStore";
import { useModalStore } from "../stores/modalStore";
import FilterPanel from "../components/movies/FilterPanel.vue";

const route = useRoute();
const store = useMovieStore();
const modalStore = useModalStore();

const query = ref((route.query.q as string) || "");
const loading = ref(false);
const error = ref<string | null>(null);

const filters = ref<{
  genre?: string;
  year?: number;
  rating?: number;
  type?: string;
}>({});

const onFilterApply = (newFilters: typeof filters.value) => {
  filters.value = newFilters;
};
const onFilterClear = () => {
  filters.value = {};
};

// Filtered results
const filteredResults = computed(() => {
  return store.searchResults.filter((movie) => {
    if (
      filters.value.genre &&
      !movie.genre_ids?.includes(Number(filters.value.genre))
    )
      return false;
    if (
      filters.value.year &&
      movie.release_date?.slice(0, 4) !== String(filters.value.year)
    )
      return false;
    if (filters.value.rating && movie.vote_average < filters.value.rating)
      return false;
    if (filters.value.type && movie.media_type !== filters.value.type)
      return false;
    return true;
  });
});

// Pagination / view more
const visibleCount = ref(20);
const visibleResults = computed(() =>
  filteredResults.value.slice(0, visibleCount.value)
);
const showMore = () => (visibleCount.value += 20);

// ✅ Fetch search results
async function fetchResults(searchQuery: string) {
  if (!searchQuery.trim()) return;
  loading.value = true;
  try {
    await store.searchMovies(searchQuery);
  } catch (err) {
    error.value = "Failed to load movies.";
  } finally {
    loading.value = false;
  }
}

// Initial fetch
onMounted(() => fetchResults(query.value));

// Watch route query to reload page results
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      query.value = newQuery as string;
      fetchResults(query.value);
    }
  }
);

function openMovieModal(movie: any) {
  modalStore.open("movie", { movieId: movie.id });
}

const getPoster = (path: string) =>
  path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://dummyimage.com/300x450/000/fff&text=No+Image";
</script>
