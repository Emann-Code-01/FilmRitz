<template>
  <div
    class="min-h-screen text-white py-10 px-6 md:px-10 mt-15 transition-all duration-900 animate-fade-up"
  >
    <!-- 🔽 Filter Panel -->
    <FilterPanel @apply="onFilterApply" @clear="onFilterClear" />

    <h1 class="text-2xl font-[Gilroy-SemiBold] mb-6 capitalize">
      "<span class="text-red-500 font-[Gilroy-Bold]">{{ formattedGenre }}</span
      >" Movies & Shows
    </h1>

    <!-- 🔄 Skeleton Loader -->
    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <div
        v-for="n in 12"
        :key="n"
        class="relative w-full h-72 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 animate-pulse"
      >
        <div
          class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer"
        ></div>
        <div class="h-3/4 bg-gray-800 rounded-t-xl"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- ✅ Results -->
    <div
      v-else-if="visibleResults.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <MediaCard
        v-for="(item, index) in visibleResults"
        :key="index"
        :media="item"
      />
    </div>

    <!-- ❌ Empty state -->
    <div v-else class="text-gray-400 text-center mt-8">
      No results found for "{{ genreName }}".
    </div>

    <!-- ⬇️ View More / Show Less -->
    <div v-if="filteredMedia.length > itemsPerPage" class="text-center mt-6">
      <button
        @click="toggleView"
        :disabled="loading"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-[Gilroy-SemiBold] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {{ loading ? "Loading..." : isExpanded ? "Show Less" : "View More" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { watchEffect } from "#imports";
import { getMoviesByGenre, getShowsByGenre } from "../../src/lib/discover";
import { genreNameToId } from "../../src/types/media";
import type { Media } from "../../src/types/media";
import MediaCard from "../../src/components/media/MediaCard.vue";
import FilterPanel from "../../src/components/media/FilterPanel.vue";

// 🚦 Route & genre
const route = useRoute();
const genreName = ref<string>("All");

const formattedGenre = computed(() => {
  const g = genreName.value || "Genre";
  return g.charAt(0).toUpperCase() + g.slice(1);
});

// Media data
const media = ref<Media[]>([]);
const loading = ref(false);
const isExpanded = ref(false);
const itemsPerPage = 12;
const visibleCount = ref(itemsPerPage);

// 🎚️ Filter state
interface Filters {
  genre: string;
  year: number | null;
  rating: number | null;
  type: string;
  sort: "newest" | "oldest" | "";
}
const filters = ref<Filters>({
  genre: "",
  year: null,
  rating: null,
  type: "",
  sort: "",
});

// 🔽 Fetch media for current genre
async function fetchMedia() {
  loading.value = true;

  const genreParam = route.params.name;
  genreName.value = Array.isArray(genreParam)
    ? (genreParam[0] ?? "All")
    : ((genreParam as string) ?? "All");

  const genreId = genreNameToId[genreName.value.toLowerCase()] ?? null;

  if (!genreId) {
    media.value = [];
    loading.value = false;
    updateSEO();
    return;
  }

  try {
    const [movies, shows] = await Promise.all([
      getMoviesByGenre(genreId),
      getShowsByGenre(genreId),
    ]);
    media.value = [...movies, ...shows];
  } catch (err) {
    console.error("Failed to fetch media:", err);
    media.value = [];
  } finally {
    loading.value = false;
    visibleCount.value = itemsPerPage;
    isExpanded.value = false;
    updateSEO();
  }
}

// 🧩 Filter logic
const filteredMedia = computed(() => {
  let results = [...media.value];

  if (filters.value.genre) {
    results = results.filter((item) =>
      item.genre_ids?.includes(Number(filters.value.genre)),
    );
  }

  if (filters.value.year) {
    results = results.filter((item) => {
      const date = item.release_date || item.first_air_date;
      return date ? new Date(date).getFullYear() === filters.value.year : false;
    });
  }

  if (filters.value.rating) {
    results = results.filter(
      (item) => (item.vote_average ?? 0) >= filters.value.rating!,
    );
  }

  if (filters.value.type) {
    results = results.filter((item) => item.media_type === filters.value.type);
  }

  if (filters.value.sort === "newest") {
    results.sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date || 0).getTime() -
        new Date(a.release_date || a.first_air_date || 0).getTime(),
    );
  } else if (filters.value.sort === "oldest") {
    results.sort(
      (a, b) =>
        new Date(a.release_date || a.first_air_date || 0).getTime() -
        new Date(b.release_date || b.first_air_date || 0).getTime(),
    );
  }

  return results;
});

// 👁️ Control visible results
const visibleResults = computed(() =>
  filteredMedia.value.slice(0, visibleCount.value),
);

// ⬇️ Toggle View More / Show Less
function toggleView() {
  isExpanded.value = !isExpanded.value;
  visibleCount.value = isExpanded.value
    ? filteredMedia.value.length
    : itemsPerPage;
}

// 🎚️ Apply filters from FilterPanel
function onFilterApply(newFilters: Partial<Filters>) {
  filters.value = { ...filters.value, ...newFilters };

  if (newFilters.genre) {
    const selectedGenre = Object.entries(genreNameToId).find(
      ([_, id]) => id === Number(newFilters.genre),
    );
    genreName.value = selectedGenre ? selectedGenre[0] : "All";
  } else {
    const genreParam = route.params.name;
    genreName.value = Array.isArray(genreParam)
      ? (genreParam[0] ?? "All")
      : ((genreParam as string) ?? "All");
  }

  visibleCount.value = itemsPerPage;
  isExpanded.value = false;
  updateSEO();
}

// 🧹 Clear filters
function onFilterClear() {
  filters.value = { genre: "", year: null, rating: null, type: "", sort: "" };

  const genreParam = route.params.name;
  genreName.value = Array.isArray(genreParam)
    ? (genreParam[0] ?? "All")
    : ((genreParam as string) ?? "All");

  visibleCount.value = itemsPerPage;
  isExpanded.value = false;
  updateSEO();
}

onMounted(fetchMedia);
watch(() => route.params.name, fetchMedia);

// Dynamic SEO update
function updateSEO() {
  watchEffect(() => {
    const cleanGenre = (genreName.value || "Genre").toLowerCase();
    const formattedGenre =
      cleanGenre.charAt(0).toUpperCase() + cleanGenre.slice(1);
    const cleanURL = `https://filmritz.vercel.app/ng/genre/${encodeURIComponent(cleanGenre)}`;

    useHead({
      title: `FilmRitz — ${formattedGenre} Movies & Shows`,
      meta: [
        {
          name: "description",
          content: `Discover top-rated ${formattedGenre} movies and TV shows on FilmRitz. Browse trending titles, filter by rating, year, and more.`,
        },
        {
          name: "keywords",
          content:
            "filmritz, movies, tv shows, discovering, emanncode, vue project, ifeoluwa olajubaje emmanuel",
        },
        {
          property: "og:title",
          content: `FilmRitz — ${formattedGenre} Movies & Shows`,
        },
        {
          property: "og:description",
          content: `Watch the best ${formattedGenre} movies and series. Updated daily.`,
        },
        {
          property: "og:image",
          content: "https://filmritz.vercel.app/filmritzlogo2.png",
        },
        { property: "og:url", content: cleanURL },
        { property: "og:type", content: "website" },
        {
          name: "twitter:title",
          content: `FilmRitz — ${formattedGenre} Movies & Shows`,
        },
        {
          name: "twitter:description",
          content: `Discover ${formattedGenre} movies and series with high quality.`,
        },
        {
          name: "twitter:image",
          content: "https://filmritz.vercel.app/filmritzlogo2.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "index, follow" },
      ],
      link: [{ rel: "canonical", href: cleanURL }],
    });
  });
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

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
