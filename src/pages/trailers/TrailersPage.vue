<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <TrailerModal
      :is-open="showTrailerModal"
      :trailer="selectedTrailer"
      @close="closeTrailerModal"
      @view-details="openFullDetails"
    />

    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div class="md:flex items-center gap-4 hidden">
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Trailers</h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Watch the latest movie and show trailers
            </p>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">Trailers</h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            Watch the latest movie and show trailers
          </p>
        </div>
      </div>
    </div>

    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
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

    <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto mt-8">
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

      <div v-else-if="filteredTrailers.length === 0" class="text-center py-20">
        <h3 class="text-2xl font-[Gilroy-Bold] text-gray-400 mb-2">
          No trailers found
        </h3>
        <p class="text-gray-500">Try selecting a different category</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="trailer in filteredTrailers"
          :key="trailer.id"
          @click="playTrailer(trailer)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <div class="aspect-video overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w780${trailer.backdrop_path}`"
              :alt="trailer.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <span
              class="bg-[#b20710] rounded-full p-2 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"
          ></div>

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
import { type TrailerData } from "@/api/tmdb";
import { getRotatedTrailers } from "@/services/mediaRotation";
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
  selectedTrailer.value = trailer;
  showTrailerModal.value = true;
};

const closeTrailerModal = () => {
  showTrailerModal.value = false;
  // Small delay before clearing to allow modal animation
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300);
};

const openFullDetails = (mediaType: "movie" | "tv", mediaId: number) => {
  modalStore.open(mediaType, {
    movieId: mediaId,
    mediaType: mediaType,
  });
};

onMounted(async () => {
  try {
    loading.value = true;
    // Use rotated trailers for variety (cached for 6 hours)
    const fetchedTrailers = await getRotatedTrailers();
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
