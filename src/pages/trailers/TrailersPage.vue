<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- Trailer Player Modal -->
    <TrailerModal
      :is-open="showTrailerModal"
      :trailer="selectedTrailer"
      @close="closeTrailerModal"
      @view-details="openFullDetails"
    />

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Ambient Glow -->
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="md:flex items-center gap-4 hidden">
          <div
            class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
          >
            🎬
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Trailers</h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Watch the latest movie and show trailers
            </p>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <div
              class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
            >
              🎬
            </div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Trailers</h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            Watch the latest movie and show trailers
          </p>
        </div>
      </div>
    </div>

    <!-- Category Filters -->
    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectedCategory = cat.value"
            class="px-6 py-2.5 rounded-full font-[Gilroy-SemiBold] whitespace-nowrap transition-all duration-500 cursor-pointer"
            :class="
              selectedCategory === cat.value
                ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            "
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Trailers Grid -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto mt-8">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="n in 12"
          :key="n"
          class="aspect-video bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <!-- No Trailers Found -->
      <div v-else-if="filteredTrailers.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🎬</div>
        <h3 class="text-2xl font-[Gilroy-Bold] text-gray-400 mb-2">
          No trailers found
        </h3>
        <p class="text-gray-500">Try selecting a different category</p>
      </div>

      <!-- Trailers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="trailer in filteredTrailers"
          :key="trailer.id"
          @click="playTrailer(trailer)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <!-- Thumbnail -->
          <div class="aspect-video overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w780${trailer.backdrop_path}`"
              :alt="trailer.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"
          ></div>

          <!-- Play Button
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-20 h-20 rounded-full bg-[#b20710] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform"
            >
              <span class="text-4xl text-white ml-1">▶</span>
            </div>
          </div> -->

          <!-- Info -->
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3 class="text-white font-[Gilroy-Bold] text-lg line-clamp-1 mb-2">
              {{ trailer.title }}
            </h3>
            <div class="flex items-center gap-3">
              <span
                class="px-3 py-1 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold]"
              >
                {{ trailer.type }}
              </span>
              <span class="text-gray-300 text-sm">
                {{ formatDuration(trailer.duration) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { fetchAllTrailers, type TrailerData } from "@/api/tmdb";
import TrailerModal from "@/components/media/TrailerModal.vue";
import AdSlot from "@/components/ads/AdSlot.vue";

const modalStore = useModalStore();

const categories = [
  { label: "All Trailers", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "TV Shows", value: "tv" },
  { label: "Trending", value: "trending" },
  { label: "New Releases", value: "new" },
];

const selectedCategory = ref("all");
const trailers = ref<TrailerData[]>([]);
const loading = ref(true);
const showTrailerModal = ref(false);
const selectedTrailer = ref<TrailerData | null>(null);

const filteredTrailers = computed(() => {
  if (selectedCategory.value === "all") return trailers.value;
  return trailers.value.filter((t) => {
    if (selectedCategory.value === "movie") return t.mediaType === "movie";
    if (selectedCategory.value === "tv") return t.mediaType === "tv";
    if (selectedCategory.value === "trending") return true;
    if (selectedCategory.value === "new") {
      // Show trailers published within last 30 days
      if (!t.publishedAt) return false;
      const publishDate = new Date(t.publishedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return publishDate >= thirtyDaysAgo;
    }
    return true;
  });
});

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const playTrailer = (trailer: TrailerData) => {
  console.log("Playing trailer:", trailer); // Debug log
  selectedTrailer.value = trailer;
  showTrailerModal.value = true;
};

const closeTrailerModal = () => {
  console.log("Closing trailer modal"); // Debug log
  showTrailerModal.value = false;
  // Small delay before clearing to allow modal animation
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300);
};

const openFullDetails = (mediaType: "movie" | "tv", mediaId: number) => {
  console.log("Opening full details:", mediaType, mediaId); // Debug log
  modalStore.open(mediaType, {
    movieId: mediaId,
    mediaType: mediaType,
  });
};

onMounted(async () => {
  try {
    loading.value = true;
    console.log("Fetching trailers..."); // Debug log
    const fetchedTrailers = await fetchAllTrailers();
    console.log("Fetched trailers:", fetchedTrailers); // Debug log
    trailers.value = fetchedTrailers;
  } catch (error) {
    console.error("Error loading trailers:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
