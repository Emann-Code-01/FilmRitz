<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-screen space-y-6"
    >
      <div class="relative">
        <div
          class="w-24 h-24 border-4 border-[#b20710] border-t-transparent rounded-full animate-spin"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center text-4xl">
          🎬
        </div>
      </div>
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-[Gilroy-Bold]">Loading Trailer Cinema</h2>
        <p class="text-gray-400 font-[Gilroy-Medium]">
          Preparing your cinematic experience...
        </p>
        <div class="flex gap-2 justify-center mt-4">
          <div
            class="w-2 h-2 bg-[#b20710] rounded-full animate-bounce"
            style="animation-delay: 0s"
          ></div>
          <div
            class="w-2 h-2 bg-[#b20710] rounded-full animate-bounce"
            style="animation-delay: 0.2s"
          ></div>
          <div
            class="w-2 h-2 bg-[#b20710] rounded-full animate-bounce"
            style="animation-delay: 0.4s"
          ></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="text-center space-y-4 max-w-md">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-3xl font-[Gilroy-Bold] text-red-500">Oops!</h2>
        <p class="text-xl text-gray-400 font-[Gilroy-Medium]">{{ error }}</p>
        <button
          @click="fetchTrailerSlides"
          class="px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all inline-flex items-center gap-2"
        >
          <i class="pi pi-refresh"></i>
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="trailerItems.length > 0" class="space-y-8">
      <!-- Header Section -->
      <div class="relative pt-24 px-6 md:px-10 overflow-hidden">
        <div
          class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
        ></div>

        <div class="relative z-10 max-w-7xl mx-auto">
          <div class="md:flex items-center justify-between mb-6 hidden">
            <div>
              <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] mb-3">
                🎬 Trailer Cinema
              </h1>
              <p class="text-xl text-gray-400 font-[Gilroy-Medium]">
                Watch the latest movie and TV show trailers
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 *:cursor-pointer">
              <button
                @click="shuffleSlides"
                class="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2 border border-white/20"
                title="Shuffle trailers"
              >
                <i class="pi pi-refresh text-lg"></i>
                <span class="hidden md:inline">Shuffle</span>
              </button>
              <button
                @click="fetchTrailerSlides"
                class="px-4 py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2"
                title="Refresh trailers"
              >
                <i class="pi pi-sync text-lg"></i>
                <span class="hidden md:inline">Refresh</span>
              </button>
            </div>
          </div>
          <div class="flex-col flex md:hidden justify-between mb-6 space-y-3">
            <div class="flex flex-col">
              <h1
                class="text-4xl text-nowrap md:text-6xl font-[Gilroy-Bold] mb-3"
              >
                🎬 Trailer Cinema
              </h1>
              <p class="text-xl text-gray-400 font-[Gilroy-Medium]">
                Watch the latest movie and TV show trailers
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 *:cursor-pointer">
              <button
                @click="shuffleSlides"
                class="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2 border border-white/20"
                title="Shuffle trailers"
              >
                <i class="pi pi-refresh text-lg"></i>
                <span class="inline">Shuffle</span>
              </button>
              <button
                @click="fetchTrailerSlides"
                class="px-4 py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2"
                title="Refresh trailers"
              >
                <i class="pi pi-sync text-lg"></i>
                <span class="inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Trailer Player Section -->
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div v-if="currentTrailer" class="space-y-4">
          <!-- Video Player -->
          <div
            class="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <!-- Loading Spinner for Video -->
            <div
              v-if="videoLoading"
              class="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
            >
              <div class="text-center space-y-4">
                <div
                  class="w-16 h-16 border-4 border-[#b20710] border-t-transparent rounded-full animate-spin mx-auto"
                ></div>
                <p class="text-gray-400 font-[Gilroy-Medium]">
                  Loading trailer...
                </p>
              </div>
            </div>

            <iframe
              v-if="currentTrailer.key"
              :src="`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1&rel=0&modestbranding=1`"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              @load="videoLoading = false"
            ></iframe>

            <!-- Fallback for no trailer -->
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-900 to-black"
            >
              <div class="text-center space-y-4">
                <div class="text-6xl">🎬</div>
                <p class="text-xl text-gray-400 font-[Gilroy-SemiBold]">
                  Trailer not available
                </p>
              </div>
            </div>
          </div>

          <!-- Current Trailer Info -->
          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hidden md:block"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-3xl font-[Gilroy-Bold] mb-3">
                  {{ currentTrailer.title }}
                </h2>
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    class="px-3 py-1.5 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    ⭐ {{ currentTrailer.vote_average?.toFixed(1) }}
                  </span>
                  <span
                    class="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    {{
                      currentTrailer.media_type === "movie"
                        ? "🎬 Movie"
                        : "📺 TV Show"
                    }}
                  </span>
                  <span class="text-gray-400 font-[Gilroy-Medium]">
                    {{
                      currentTrailer.release_date?.slice(0, 4) ||
                      currentTrailer.first_air_date?.slice(0, 4)
                    }}
                  </span>
                </div>
                <p
                  class="text-gray-300 font-[Gilroy-Regular] line-clamp-3 mb-4"
                >
                  {{ currentTrailer.overview }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="genreId in currentTrailer.genre_ids?.slice(1, 2)"
                    :key="genreId"
                    class="px-3 py-1 bg-white/10 rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    {{ getGenreName(genreId) }}
                  </span>
                </div>
              </div>

              <!-- More Info Button -->
              <button
                @click="openModal(currentTrailer)"
                class="px-3 md:px-6 py-2 md:py-2.5  bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2 border border-white/20 whitespace-nowrap cursor-pointer"
              >
                <i class="pi pi-info-circle"></i>
                More Info
              </button>
            </div>
          </div>
          <div
            class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 md:hidden block"
          >
            <div class="flex flex-col items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-3xl font-[Gilroy-Bold] mb-3">
                  {{ currentTrailer.title }}
                </h2>
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    class="px-3 py-1.5 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    ⭐ {{ currentTrailer.vote_average?.toFixed(1) }}
                  </span>
                  <span
                    class="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    {{
                      currentTrailer.media_type === "movie"
                        ? "🎬 Movie"
                        : "📺 TV Show"
                    }}
                  </span>
                  <span class="text-gray-400 font-[Gilroy-Medium]">
                    {{
                      currentTrailer.release_date?.slice(0, 4) ||
                      currentTrailer.first_air_date?.slice(0, 4)
                    }}
                  </span>
                </div>
                <p
                  class="text-gray-300 font-[Gilroy-Regular] line-clamp-3 mb-4"
                >
                  {{ currentTrailer.overview }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="genreId in currentTrailer.genre_ids?.slice(1, 2)"
                    :key="genreId"
                    class="px-3 py-1 bg-white/10 rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    {{ getGenreName(genreId) }}
                  </span>
                </div>
              </div>

              <!-- More Info Button -->
              <button
                @click="openModal(currentTrailer)"
                class="px-3 md:px-6 py-2 md:py-2.5  bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center gap-2 border border-white/20 whitespace-nowrap cursor-pointer"
              >
                <i class="pi pi-info-circle"></i>
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Trailer List -->
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <h3 class="text-2xl font-[Gilroy-Bold] mb-6">
          Available Trailers ({{ trailerItems.length }})
        </h3>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          <div
            v-for="item in trailerItems"
            :key="item.id"
            @click="selectTrailer(item)"
            class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border transition-all duration-500 hover:scale-105"
            :class="
              currentTrailer?.id === item.id
                ? 'border-[#b20710] shadow-lg shadow-[#b20710]/50'
                : 'border-white/10 hover:border-[#b20710]/50'
            "
          >
            <!-- Poster -->
            <div class="aspect-2/3 overflow-hidden relative">
              <img
                :src="getPoster(item.poster_path)"
                :alt="item.title || item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
              />

              <!-- Play Icon Overlay -->
              <div
                class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <span class="text-3xl text-white ml-1">▶</span>
                </div>
              </div>

              <!-- Currently Playing Badge -->
              <div
                v-if="currentTrailer?.id === item.id"
                class="absolute top-3 left-3 px-3 py-1.5 bg-[#b20710] rounded-lg text-xs font-[Gilroy-Bold] flex items-center gap-2"
              >
                <span class="animate-pulse">●</span>
                Now Playing
              </div>
            </div>

            <!-- Info -->
            <div class="p-4">
              <h4
                class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2"
              >
                {{ item.title || item.name }}
              </h4>
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-1 bg-[#b20710] rounded-md text-xs font-[Gilroy-SemiBold]"
                >
                  ⭐ {{ item.vote_average?.toFixed(1) }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ (item.release_date || item.first_air_date)?.slice(0, 4) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Trailers Found -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4 max-w-md">
        <div class="text-6xl mb-4">🎬</div>
        <h2 class="text-3xl font-[Gilroy-Bold]">No Trailers Available</h2>
        <p class="text-xl text-gray-400 font-[Gilroy-Medium]">
          We couldn't find any trailers at the moment. Please try again later.
        </p>
        <button
          @click="fetchTrailerSlides"
          class="px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all inline-flex items-center gap-2"
        >
          <i class="pi pi-refresh"></i>
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHead } from "@unhead/vue";
import { fetchTrendingMedia, getMediaVideos } from "@/api/tmdb";
import { useModalStore } from "@/stores/modalStore";
import { genreMap } from "@/types/media";

interface TrailerItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  genre_ids: number[];
  media_type: "movie" | "tv";
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  key?: string;
}

const modalStore = useModalStore();
const trailerItems = ref<TrailerItem[]>([]);
const currentTrailer = ref<TrailerItem | null>(null);
const loading = ref(true);
const videoLoading = ref(false);
const error = ref<string | null>(null);

useHead({
  title: "Trailer Cinema | FilmRitz - Watch Movie & TV Trailers",
  meta: [
    {
      name: "description",
      content:
        "Watch the latest movie and TV show trailers. Browse and play trailers from trending content.",
    },
    {
      name: "keywords",
      content:
        "movie trailers, tv show trailers, watch trailers, filmritz cinema",
    },
    { property: "og:title", content: "Trailer Cinema | FilmRitz" },
    {
      property: "og:description",
      content: "Experience the latest trailers from movies and TV shows.",
    },
  ],
});

async function fetchTrailerSlides() {
  loading.value = true;
  error.value = null;

  try {
    console.log("Fetching trailer cinema items...");

    // Fetch 3 pages (60+ items) and use top 30 for trailers
    const trending = await fetchTrendingMedia("week", 3);

    const topItems = trending.slice(0, 30);

    const itemsWithVideos = await Promise.all(
      topItems.map(async (item) => {
        try {
          const videos = await getMediaVideos(item.id, item.media_type);
          const trailer = videos.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube"
          );

          if (trailer) {
            return {
              id: item.id,
              title: item.title,
              name: item.name,
              overview: item.overview,
              backdrop_path: item.backdrop_path,
              poster_path: item.poster_path,
              genre_ids: item.genre_ids || [],
              media_type: item.media_type,
              vote_average: item.vote_average,
              release_date: item.release_date,
              first_air_date: item.first_air_date,
              key: trailer.key,
            } as TrailerItem;
          }
          return null;
        } catch (error) {
          console.error(`Failed to fetch videos for item ${item.id}:`, error);
          return null;
        }
      })
    );

    const validItems = itemsWithVideos.filter(
      (item): item is TrailerItem => item !== null
    );

    if (validItems.length === 0) {
      error.value = "No trailers available at the moment.";
    } else {
      trailerItems.value = validItems;

      if (!currentTrailer.value) {
        currentTrailer.value = validItems[0];
      }
      console.log(`Loaded ${validItems.length} trailers`);
    }
  } catch (err: any) {
    console.error("Failed to fetch trailers:", err);
    error.value = "Failed to load trailers. Please try again.";
  } finally {
    loading.value = false;
  }
}

function selectTrailer(item: TrailerItem) {
  videoLoading.value = true;
  currentTrailer.value = item;

  window.scrollTo({ top: 33, behavior: "smooth" });

  setTimeout(() => {
    videoLoading.value = false;
  }, 500);
}

function shuffleSlides() {
  const shuffled = [...trailerItems.value];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  trailerItems.value = shuffled;
  currentTrailer.value = shuffled[0];
  window.scrollTo({ top: 33, behavior: "smooth" });
}

function openModal(item: TrailerItem) {
  modalStore.open(item.media_type, {
    movieId: item.id,
    mediaType: item.media_type,
  });
}

function getPoster(path: string | null): string {
  if (!path) return "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
  return `https://image.tmdb.org/t/p/w500${path}`;
}

function getGenreName(genreId: number): string {
  return genreMap[genreId] || "Unknown";
}

onMounted(async () => {
  await fetchTrailerSlides();
});
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
