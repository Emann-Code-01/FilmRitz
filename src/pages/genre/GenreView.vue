<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 md:">
    <!-- HERO HEADER -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 blur-3xl opacity-30 transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 30% 50%, ${genreColor}40, transparent 70%)`,
        }"
      ></div>

      <div
        class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto justify-between"
      >
        <div class="md:flex items-center gap-4 mb-4 hidden">
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

    <!-- FILTER PANEL -->
    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <FilterPanel
        :defaultGenreId="currentGenreId ?? undefined"
        @apply="onFilterApply"
        @clear="onFilterClear"
      />
    </div>

    <!-- MEDIA GRID -->
    <div class="px-6 mx-auto mt-8">
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
        </div>
      </div>

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
  </div>

  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { getMoviesByGenre, getShowsByGenre } from "@/lib/discover";
import { genreNameToId } from "@/types/media";
import type { Media } from "@/types/media";
import MediaCard from "@/components/media/MediaCard.vue";
import FilterPanel from "@/components/media/FilterPanel.vue";
import AdSlot from "@/components/ads/AdSlot.vue";

/* ✅ ROUTE PROP (FINAL FIX) */
const props = defineProps<{
  name: string;
}>();

const genreName = ref("");
const media = ref<Media[]>([]);
const loading = ref(false);
const isExpanded = ref(false);
const itemsPerPage = 20;
const visibleCount = ref(itemsPerPage);
const currentGenreId = ref<number | null>(null);

const filters = ref({
  genre: "",
  year: null as number | null,
  rating: null as number | null,
  type: "",
  sort: "",
});

/* GENRE META */
const genreMetadata: Record<string, { color: string; description: string }> = {
  action: { color: "#FF4500", description: "High-octane thrills" },
  drama: { color: "#8B5CF6", description: "Emotional depth" },
};

const genreColor = computed(
  () => genreMetadata[genreName.value.toLowerCase()]?.color || "#b20710",
);
const genreDescription = computed(
  () =>
    genreMetadata[genreName.value.toLowerCase()]?.description ||
    "Explore movies and shows in this genre",
);

/* ✅ FETCH USING PROP (NOT route.params) */
async function fetchMedia() {
  loading.value = true;
  genreName.value = props.name;

  currentGenreId.value = genreNameToId[genreName.value.toLowerCase()] ?? null;

  if (!currentGenreId.value) {
    media.value = [];
    loading.value = false;
    return;
  }

  try {
    const [movies, shows] = await Promise.all([
      getMoviesByGenre(currentGenreId.value),
      getShowsByGenre(currentGenreId.value),
    ]);
    media.value = [...movies, ...shows];
  } finally {
    loading.value = false;
    visibleCount.value = itemsPerPage;
    isExpanded.value = false;
    filters.value.genre = String(currentGenreId.value);
  }
}

const filteredMedia = computed(() =>
  media.value.filter((item) =>
    filters.value.genre
      ? item.genre_ids?.includes(Number(filters.value.genre))
      : true,
  ),
);

const visibleResults = computed(() =>
  filteredMedia.value.slice(0, visibleCount.value),
);

function onFilterApply(newFilters: any) {
  filters.value = { ...filters.value, ...newFilters };
}

function onFilterClear() {
  filters.value = { genre: "", year: null, rating: null, type: "", sort: "" };
}

/* ✅ WATCH PROP */
onMounted(fetchMedia);
watch(() => props.name, fetchMedia);
</script>
