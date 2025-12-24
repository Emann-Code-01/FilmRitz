<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- Trailer Player Modal -->
    <TrailerModal
      :is-open="showTrailerModal"
      :trailer="selectedTrailer"
      @close="closeTrailerModal"
      @view-details="openFullDetails"
    />

    <!-- Hero Header -->
    <div class="relative pt-14 md:pt-24 pb-12 px-6 md:px-10 overflow-hidden">
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
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Trending Trailers
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Latest trending video content
            </p>
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
              Trending Trailers
            </h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            Latest trending video content
          </p>
        </div>
      </div>
    </div>

    <!-- Trailers Grid -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="n in 9"
          :key="n"
          class="aspect-video bg-gray-800/50 rounded-xl animate-pulse"
        ></div>
      </div>

      <!-- No Trailers -->
      <div v-else-if="trailers.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🎬</div>
        <h3 class="text-2xl font-[Gilroy-Bold] text-gray-400">
          No trailers available
        </h3>
      </div>

      <!-- Trailers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="trailer in trailers"
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
              @error="handleImageError"
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

          <!-- Trending Badge -->
          <div
            class="absolute top-4 left-4 px-3 py-1 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold] flex items-center gap-2"
          >
            🔥 Trending
          </div>

          <!-- Info -->
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3 class="text-white font-[Gilroy-Bold] text-lg line-clamp-1 mb-2">
              {{ trailer.title }}
            </h3>
            <div class="flex items-center gap-3">
              <span
                class="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-sm font-[Gilroy-SemiBold]"
              >
                {{ trailer.type }}
              </span>
              <span class="text-gray-300 text-sm">
                {{ trailer.mediaType === "movie" ? "Movie" : "TV Show" }}
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
import { ref, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { fetchAllTrailers, type TrailerData } from "@/api/tmdb";
import TrailerModal from "@/components/media/TrailerModal.vue";
import AdSlot from "@/components/ads/AdSlot.vue";

const modalStore = useModalStore();

const trailers = ref<TrailerData[]>([]);
const loading = ref(true);
const showTrailerModal = ref(false);
const selectedTrailer = ref<TrailerData | null>(null);

const playTrailer = (trailer: TrailerData) => {
  console.log("Playing trailer:", trailer);
  selectedTrailer.value = trailer;
  showTrailerModal.value = true;
};

const closeTrailerModal = () => {
  console.log("Closing trailer modal");
  showTrailerModal.value = false;
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300);
};

const openFullDetails = (mediaType: "movie" | "tv", mediaId: number) => {
  console.log("Opening full details:", mediaType, mediaId);
  modalStore.open(mediaType, {
    movieId: mediaId,
    mediaType: mediaType,
  });
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "/no-poster.jpg";
};

onMounted(async () => {
  try {
    loading.value = true;
    console.log("Fetching trending trailers...");
    const fetchedTrailers = await fetchAllTrailers();
    console.log("Fetched trailers:", fetchedTrailers);
    trailers.value = fetchedTrailers;
  } catch (error) {
    console.error("Error loading trailers:", error);
  } finally {
    loading.value = false;
  }
});
</script>
