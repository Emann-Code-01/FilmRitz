<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-20">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER WITH GENRE THEMING -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Dynamic Genre Color Gradient -->
      <div
        class="absolute inset-0 blur-3xl opacity-30 transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 30% 50%, ${genreColor}40, transparent 70%)`,
        }"
      ></div>

      <div class="relative z-10 max-w-[1230px] mx-auto justify-between">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            :style="{
              backgroundColor: `${genreColor}20`,
              border: `2px solid ${genreColor}`,
            }"
          >
            {{ genreIcon }}
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] capitalize">
              {{ genreName }}
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              {{ genreDescription }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- FILTER PANEL -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div
      class="sticky top-26 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="">
        <FilterPanel @apply="onFilterApply" @clear="onFilterClear" />
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MEDIA GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 mx-auto mt-8">
      <!-- Loading Skeleton -->
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

      <!-- Empty State -->
      <div v-else-if="!visibleResults.length" class="text-center py-20">
        <div class="text-6xl mb-4">🎬</div>
        <p class="text-gray-400 text-xl font-[Gilroy-SemiBold]">
          No results found for "{{ genreName }}"
        </p>
      </div>

      <!-- Media Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <MediaCard
          v-for="item in visibleResults"
          :key="item.id"
          :media="item"
          :accent-color="genreColor"
        />
      </div>
    </div>
    <div v-if="filteredMedia.length > itemsPerPage" class="text-center mt-12">
      <button
        @click="toggleView"
        :disabled="loading"
        class="px-8 py-4 rounded-xl font-[Gilroy-Bold] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 cursor-pointer"
        :style="{ backgroundColor: genreColor }"
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
import { getMoviesByGenre, getShowsByGenre } from "@/lib/discover";
import { genreNameToId } from "@/types/media";
import type { Media } from "@/types/media";
import MediaCard from "@/components/media/MediaCard.vue";
import FilterPanel from "@/components/media/FilterPanel.vue";

const route = useRoute();
const genreName = ref<string>("");
const media = ref<Media[]>([]);
const loading = ref(false);
const isExpanded = ref(false);
const itemsPerPage = 20;
const visibleCount = ref(itemsPerPage);

const filters = ref({
  genre: "",
  year: null as number | null,
  rating: null as number | null,
  type: "",
  sort: "",
});

// Genre metadata with colors and icons
const genreMetadata: Record<
  string,
  { color: string; icon: string; description: string }
> = {
  action: {
    color: "#FF4500",
    icon: "💥",
    description: "High-octane thrills and explosive adventures",
  },
  adventure: {
    color: "#10B981",
    icon: "🗺️",
    description: "Epic journeys and daring quests",
  },
  animation: {
    color: "#F59E0B",
    icon: "🎨",
    description: "Animated wonders for all ages",
  },
  comedy: {
    color: "#FFD700",
    icon: "😂",
    description: "Laugh-out-loud moments and feel-good stories",
  },
  crime: {
    color: "#8B5CF6",
    icon: "🔪",
    description: "Gripping tales of law and disorder",
  },
  documentary: {
    color: "#6B7280",
    icon: "📹",
    description: "Real stories that inspire and inform",
  },
  drama: {
    color: "#8B5CF6",
    icon: "🎭",
    description: "Powerful performances and emotional depth",
  },
  family: {
    color: "#10B981",
    icon: "👨‍👩‍👧‍👦",
    description: "Entertainment for the whole family",
  },
  fantasy: {
    color: "#EC4899",
    icon: "🧙",
    description: "Magical worlds and mystical adventures",
  },
  history: {
    color: "#92400E",
    icon: "📜",
    description: "Journey through time and significant events",
  },
  horror: {
    color: "#DC2626",
    icon: "👻",
    description: "Spine-chilling scares and supernatural terror",
  },
  music: {
    color: "#EC4899",
    icon: "🎵",
    description: "Stories told through rhythm and melody",
  },
  mystery: {
    color: "#6366F1",
    icon: "🔍",
    description: "Unravel puzzles and solve enigmas",
  },
  romance: {
    color: "#EC4899",
    icon: "💕",
    description: "Heartwarming love stories and connections",
  },
  "science fiction": {
    color: "#3B82F6",
    icon: "🚀",
    description: "Futuristic worlds and mind-bending concepts",
  },
  "tv movie": {
    color: "#9CA3AF",
    icon: "📺",
    description: "Made-for-TV entertainment",
  },
  thriller: {
    color: "#EF4444",
    icon: "😱",
    description: "Edge-of-your-seat suspense",
  },
  war: {
    color: "#78350F",
    icon: "⚔️",
    description: "Stories of conflict and heroism",
  },
  western: {
    color: "#92400E",
    icon: "🤠",
    description: "Tales from the frontier",
  },
};

const genreColor = computed(() => {
  const meta = genreMetadata[genreName.value.toLowerCase()];
  return meta?.color || "#b20710";
});

const genreIcon = computed(() => {
  const meta = genreMetadata[genreName.value.toLowerCase()];
  return meta?.icon || "🎬";
});

const genreDescription = computed(() => {
  const meta = genreMetadata[genreName.value.toLowerCase()];
  return meta?.description || "Explore movies and shows in this genre";
});

async function fetchMedia() {
  loading.value = true;
  const genreParam = route.params.name;
  genreName.value = Array.isArray(genreParam)
    ? genreParam[0]
    : (genreParam as string);
  const genreId = genreNameToId[genreName.value.toLowerCase()] ?? null;

  if (!genreId) {
    media.value = [];
    loading.value = false;
    return;
  }

  try {
    const [movies, shows] = await Promise.all([
      getMoviesByGenre(genreId),
      getShowsByGenre(genreId),
    ]);
    media.value = [...movies, ...shows];
  } catch (err) {
    console.error("Failed to fetch genre media:", err);
  } finally {
    loading.value = false;
    visibleCount.value = itemsPerPage;
    isExpanded.value = false;
  }
}

const filteredMedia = computed(() => {
  let results = [...media.value];

  if (filters.value.genre)
    results = results.filter((item) =>
      item.genre_ids?.includes(Number(filters.value.genre))
    );

  if (filters.value.year)
    results = results.filter((item) => {
      const date = item.release_date || item.first_air_date;
      return date && new Date(date).getFullYear() === filters.value.year;
    });

  if (filters.value.rating)
    results = results.filter(
      (item) => (item.vote_average ?? 0) >= filters.value.rating!
    );

  if (filters.value.type)
    results = results.filter((item) => item.media_type === filters.value.type);

  if (filters.value.sort === "newest")
    results.sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date || 0).getTime() -
        new Date(a.release_date || a.first_air_date || 0).getTime()
    );
  else if (filters.value.sort === "oldest")
    results.sort(
      (a, b) =>
        new Date(a.release_date || a.first_air_date || 0).getTime() -
        new Date(b.release_date || b.first_air_date || 0).getTime()
    );

  return results;
});

const visibleResults = computed(() =>
  filteredMedia.value.slice(0, visibleCount.value)
);

function toggleView() {
  isExpanded.value = !isExpanded.value;
  visibleCount.value = isExpanded.value
    ? filteredMedia.value.length
    : itemsPerPage;
  if (!isExpanded.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function onFilterApply(newFilters: any) {
  filters.value = { ...filters.value, ...newFilters };
  visibleCount.value = itemsPerPage;
  isExpanded.value = false;
}

function onFilterClear() {
  filters.value = { genre: "", year: null, rating: null, type: "", sort: "" };
  visibleCount.value = itemsPerPage;
  isExpanded.value = false;
}

onMounted(fetchMedia);
watch(() => route.params.name, fetchMedia);
</script>
