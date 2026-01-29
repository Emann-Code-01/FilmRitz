<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <TrailerModal
      :is-open="showTrailerModal"
      :trailer="selectedTrailer"
      @close="closeTrailerModal"
      @view-details="openFullDetails"
    />

    <div class="relative pt-14 md:pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>
      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div class="md:flex items-center gap-4 hidden">
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

    <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
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

      <div v-else-if="trailers.length === 0" class="text-center py-20">
        <h3 class="text-2xl font-[Gilroy-Bold] text-gray-400">
          No trailers available
        </h3>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="trailer in trailers"
          :key="trailer.id"
          @click="playTrailer(trailer)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <div class="aspect-video overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w780${trailer.backdrop_path}`"
              :alt="trailer.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
              @error="handleImageError"
            />
          </div>

          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"
          ></div>

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
            class="absolute top-4 left-4 px-3 py-1 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold] flex items-center gap-2"
          >
            Trending
          </div>

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
import { ref, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { type TrailerData } from "@/api/tmdb";
import { getRotatedTrailers } from "@/services/mediaRotation";
import TrailerModal from "@/components/media/TrailerModal.vue";
import AdSlot from "@/components/ads/AdSlot.vue";
import { useHead } from "@unhead/vue";

useHead({
  title: "Trending Trailers — Most Watched on FilmRitz",
  meta: [
    {
      name: "description",
      content:
        "Check out the most popular and trending movie and TV show trailers on FilmRitz right now.",
    },
    { name: "robots", content: "index, follow" },
  ],
});

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

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

onMounted(async () => {
  try {
    loading.value = true;
    console.log("Fetching trending trailers...");
    // Use rotated trailers for variety (cached for 6 hours)
    const fetchedTrailers = await getRotatedTrailers();
    console.log("Fetched trailers:", fetchedTrailers);
    trailers.value = fetchedTrailers;
  } catch (error) {
    console.error("Error loading trailers:", error);
  } finally {
    loading.value = false;
  }
});
</script>
