<template>
  <!-- Trailer Modal -->
  <TrailerModal
    :is-open="showTrailerModal"
    :trailer="selectedTrailer"
    @close="closeTrailerModal"
    @view-details="openFullDetails"
  />

  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-8 py-10 px-6 mt-18">
      <div
        class="relative overflow-hidden rounded-2xl h-[60vh] bg-gray-800/50 animate-pulse"
      ></div>
      <div class="space-y-4 max-w-7xl mx-auto">
        <div class="h-10 w-3/4 rounded bg-gray-800/50 animate-pulse"></div>
        <div class="h-6 w-full rounded bg-gray-800/50 animate-pulse"></div>
        <div class="h-6 w-2/3 rounded bg-gray-800/50 animate-pulse"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="text-center">
        <p class="text-red-500 text-xl font-[Gilroy-SemiBold] mb-4">
          {{ error }}
        </p>
        <button
          @click="fetchDetails"
          class="px-6 py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <section v-else-if="media" class="space-y-8">
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- HERO BACKDROP -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div
        class="relative h-screen overflow-hidden"
        :style="{
          backgroundImage: media.backdrop_path
            ? `url(${baseUrl + media.backdrop_path})`
            : 'url(https://placehold.co/1920x1080/0f0f0f/FF0000?text=NO+IMAGE)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      >
        <!-- linear Overlays -->
        <div
          class="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"
        ></div>
        <div
          class="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"
        ></div>

        <!-- Content Container -->
        <div class="absolute bottom-0 left-0 right-0 p-6 mx-auto">
          <!-- Title -->
          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-[Gilroy-Bold] mb-4 max-w-4xl drop-shadow-2xl animate-fade-up"
          >
            {{ media.title }}
          </h1>

          <!-- Metadata Row -->
          <div
            class="flex flex-wrap items-center gap-3 md:gap-4 mb-4 animate-fade-up"
            style="animation-delay: 0.1s"
          >
            <!-- Rating -->
            <div
              class="flex items-center gap-2 px-3 py-2 bg-[#b20710] rounded-xl"
            >
              <span class="text-yellow-400 text-xl">⭐</span>
              <span class="font-[Gilroy-Bold] text-lg">{{
                media.vote_average?.toFixed(1)
              }}</span>
            </div>

            <!-- Media Type -->
            <span
              class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-[Gilroy-SemiBold]"
            >
              {{ media.media_type === "tv" ? "📺 TV SHOW" : "🎬 MOVIE" }}
            </span>

            <!-- Year -->
            <span
              class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl font-[Gilroy-Medium]"
            >
              {{
                new Date(
                  media.release_date || media.first_air_date || ""
                ).getFullYear()
              }}
            </span>

            <!-- TV Status -->
            <span
              v-if="isTv && media.number_of_seasons"
              class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl font-[Gilroy-SemiBold]"
            >
              {{ media.number_of_seasons }} Season{{
                media.number_of_seasons > 1 ? "s" : ""
              }}
              • {{ tvStatus }}
            </span>
          </div>

          <!-- Genre Tags -->
          <div
            class="flex flex-wrap gap-2 mb-6 animate-fade-up"
            style="animation-delay: 0.15s"
          >
            <router-link
              v-for="genreName in getGenreNames(
                getGenreIdsFromMedia(media)
              ).slice(0, 5)"
              :key="genreName"
              :to="`/ng/genre/${genreName.toLowerCase()}`"
              class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl font-[Gilroy-SemiBold] hover:bg-[#b20710] transition-all duration-200"
            >
              {{ genreName }}
            </router-link>
          </div>

          <!-- Overview -->
          <p
            class="text-lg md:text-xl text-gray-200 font-[Gilroy-Medium] line-clamp max-w-5xl mb-6 animate-fade-up"
            style="animation-delay: 0.2s"
          >
            {{ media.overview }}
          </p>

          <!-- Action Buttons -->
          <div
            class="flex flex-wrap gap-4 animate-fade-up"
            style="animation-delay: 0.25s"
          >
            <button
              @click="playTrailer"
              class="px-8 py-4 bg-white text-black rounded-full font-[Gilroy-Bold] text-lg hover:bg-white/90 transition-all flex items-center gap-3 cursor-pointer"
              :class="loadingTrailer ? 'opacity-75 cursor-wait' : ''"
            >
              <span v-if="!loadingTrailer" class="text-2xl">▶</span>
              <span v-else class="animate-spin">⏳</span>
              <span>{{ loadingTrailer ? "Loading..." : "Watch Trailer" }}</span>
            </button>

            <button
              @click="toggleWatchlist"
              class="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-[Gilroy-SemiBold] text-lg hover:bg-white/30 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span
                :class="{ 'text-red-500 animate-pulse': inWatchlist }"
                class="text-2xl"
              >
                {{ inWatchlist ? "♥" : "♡" }}
              </span>
              <span>{{ inWatchlist ? "In My List" : "Add to List" }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Latest Season Section -->
      <div v-if="isTv && latestSeason" class="px-6 mx-auto space-y-4">
        <h2 class="text-3xl font-[Gilroy-Bold]">Latest Season</h2>
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#b20710]/50 transition-all"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <img
              v-if="latestSeason.poster_path"
              :src="`https://image.tmdb.org/t/p/w342${latestSeason.poster_path}`"
              alt="Season Poster"
              class="w-full md:w-48 rounded-xl object-cover"
              loading="lazy"
            />
            <div class="flex-1">
              <h3 class="text-2xl font-[Gilroy-Bold] mb-2">
                {{ latestSeason.name }}
              </h3>
              <p class="text-gray-400 font-[Gilroy-SemiBold] mb-4">
                {{ latestSeason.episode_count }} Episode{{
                  latestSeason.episode_count > 1 ? "s" : ""
                }}
              </p>
              <p class="text-gray-300 font-[Gilroy-Regular] line-clamp-3">
                {{ latestSeason.overview || "No description available." }}
              </p>
            </div>
          </div>
        </div>

        <!-- View More Seasons Button -->
        <div
          v-if="media.seasons && media.seasons.length > 0"
          class="text-center"
        >
          <router-link
            :to="`/ng/tv-shows/${slugify(media.title)}-${media.id}`"
            class="inline-block px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all"
          >
            View All Seasons →
          </router-link>
        </div>
      </div>

      <!-- Cast Section -->
      <div v-if="cast.length" class="px-6 mx-auto space-y-4">
        <h2 class="text-3xl font-[Gilroy-Bold]">Cast</h2>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div
            v-for="actor in cast"
            :key="actor.id"
            class="shrink-0 w-32 text-center group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-2xl mb-3">
              <img
                v-if="actor.profile_path"
                :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
                :alt="actor.name"
                class="w-full h-44 object-cover group-hover:scale-110 transition-all duration-500"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-44 bg-gray-800 flex items-center justify-center text-4xl"
              >
                👤
              </div>
            </div>
            <p class="text-sm font-[Gilroy-Bold] line-clamp-1">
              {{ actor.name }}
            </p>
            <p class="text-xs text-gray-400 font-[Gilroy-Medium] line-clamp-1">
              {{ actor.character }}
            </p>
          </div>
        </div>
      </div>

      <!-- Similar Titles Section -->
      <div v-if="similar.length" class="px-6 mx-auto space-y-4 pb-12">
        <h2 class="text-3xl font-[Gilroy-Bold]">Similar Titles</h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          <router-link
            v-for="sim in similar"
            :key="sim.id"
            :to="simRoute(sim)"
            class="group relative rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
          >
            <div class="aspect-2/3">
              <img
                :src="
                  sim.poster_path
                    ? `https://image.tmdb.org/t/p/w342${sim.poster_path}`
                    : 'https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE'
                "
                :alt="sim.title || sim.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                loading="lazy"
              />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Toast Notification -->
    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useWatchlistStore } from "@/stores/watchlist";
import { genreMap } from "@/types/media";
import { getMediaVideos } from "@/api/tmdb";
import TrailerModal from "@/components/media/TrailerModal.vue";
import AdSlot from "@/components/ads/AdSlot.vue";

interface TrailerData {
  id: string;
  title: string;
  type: string;
  backdrop_path: string;
  duration: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  key: string;
  site: string;
  publishedAt?: string;
}

const route = useRoute();
const baseUrl = "https://image.tmdb.org/t/p/w1280";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const media = ref<any | null>(null);
const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const latestSeason = ref<any | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Trailer state
const showTrailerModal = ref(false);
const selectedTrailer = ref<TrailerData | null>(null);
const loadingTrailer = ref(false);

const store = useWatchlistStore();
store.loadFromLocalStorage();

const inWatchlist = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

const isTv = computed(
  () => route.params.type === "tv" || media.value?.media_type === "tv"
);

const tvStatus = computed(() => {
  if (!isTv.value || !media.value) return "Unknown";

  const status = media.value.status;
  const nextEpisodeExists = !!media.value.next_episode_to_air;

  if (status === "Canceled") return "Canceled";
  if (status === "Ended" && nextEpisodeExists) return "Ongoing";
  if (status === "Returning Series") return "Ongoing";
  if (status === "Ended") return "Finished";

  return "Ongoing";
});

function slugToId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const raw = Array.isArray(param) ? param[0] : param;
  const match = raw.match(/-(\d+)$/);
  return match ? Number(match[1]) : /^\d+$/.test(raw) ? Number(raw) : null;
}

function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
}

async function fetchDetails() {
  loading.value = true;
  error.value = null;

  try {
    const idNum = slugToId(route.params.name);
    if (!idNum) {
      error.value = "Invalid media ID";
      return;
    }

    const mediaType = route.path.includes("/tv/") ? "tv" : "movie";

    const [detailsRes, creditsRes, similarRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}/credits`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}/similar`, {
        params: { api_key: API_KEY },
      }),
    ]);

    media.value = {
      ...detailsRes.data,
      media_type: mediaType,
      title: detailsRes.data.title ?? detailsRes.data.name,
    };

    cast.value = creditsRes.data.cast?.slice(0, 15) ?? [];
    similar.value = (similarRes.data.results || [])
      .slice(0, 10)
      .map((r: any) => ({
        ...r,
        media_type: mediaType,
        title: r.title ?? r.name,
      }));

    if (mediaType === "tv" && detailsRes.data.seasons?.length) {
      latestSeason.value = detailsRes.data.seasons.at(-1);
    }

    inWatchlist.value = store.isInWatchlist(media.value.id);
  } catch (err: any) {
    console.error(err);
    error.value = "Failed to load media details. Please try again.";
  } finally {
    loading.value = false;
  }
}

async function playTrailer() {
  if (!media.value) return;

  console.log("Playing trailer for:", media.value);
  loadingTrailer.value = true;

  try {
    const videos = await getMediaVideos(media.value.id, media.value.media_type);
    console.log("Fetched videos:", videos);

    const trailer = videos.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );

    if (trailer) {
      selectedTrailer.value = {
        id: `${media.value.media_type}-${media.value.id}-${trailer.key}`,
        title: media.value.title || "",
        type:
          media.value.media_type === "movie" ? "Movie Trailer" : "TV Trailer",
        backdrop_path:
          media.value.backdrop_path || media.value.poster_path || "",
        duration: 150,
        mediaId: media.value.id,
        mediaType: media.value.media_type,
        key: trailer.key,
        site: trailer.site,
        publishedAt: trailer.published_at,
      };

      showTrailerModal.value = true;
    } else {
      console.warn("No trailer found");
      toastMessage.value = "⚠️ No trailer available";
      showToast.value = true;
      setTimeout(() => (showToast.value = false), 3000);
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    toastMessage.value = "❌ Failed to load trailer";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
  } finally {
    loadingTrailer.value = false;
  }
}

function closeTrailerModal() {
  showTrailerModal.value = false;
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300);
}

function openFullDetails(_mediaType: "movie" | "tv", _mediaId: number) {
  // Already on the details page, just close the modal
  closeTrailerModal();
}

function getGenreIdsFromMedia(media: any): number[] {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres))
    return media.genres.map((g: { id: number }) => g.id);
  return [];
}

function getGenreNames(ids?: number[]) {
  return ids?.map((id) => genreMap[id]).filter(Boolean) ?? [];
}

function simRoute(sim: any) {
  const slug = slugify(sim.title || sim.name);
  return sim.media_type === "tv"
    ? `/ng/tv/${slug}-${sim.id}`
    : `/ng/movie/${slug}-${sim.id}`;
}

function toggleWatchlist() {
  if (!media.value) return;

  if (inWatchlist.value) {
    store.removeFromWatchlist(media.value.id);
    toastMessage.value = "❌ Removed from Watchlist";
  } else {
    store.addToWatchlist({
      id: media.value.id,
      title: media.value.title,
      poster_path: media.value.poster_path,
      media_type: media.value.media_type,
      overview: media.value.overview,
      release_date: media.value.release_date,
      vote_average: media.value.vote_average,
    });
    toastMessage.value = "✅ Added to Watchlist";
  }

  inWatchlist.value = !inWatchlist.value;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

onMounted(fetchDetails);
watch(() => route.params.name, fetchDetails);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out forwards;
}
</style>
