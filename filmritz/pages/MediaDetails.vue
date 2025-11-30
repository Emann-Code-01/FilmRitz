<!-- src/pages/MediaDetails.vue -->
<template>
  <section v-if="!loading && media" class="space-y-8">
    <!-- Backdrop -->
    <div class="relative h-[85vh] overflow-hidden" :style="{
      backgroundImage: media.backdrop_path
        ? `url(${baseUrl + media.backdrop_path})`
        : 'url(https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }">
      <div class="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>

      <!-- Desktop Info -->
      <div class="absolute bottom-0 hidden md:flex flex-col md:left-8 max-w-5xl space-y-3 animate-fade-up">
        <h1 class="text-4xl font-[Gilroy-Bold]">{{ media.title }}</h1>
        <p class="text-lg text-gray-300 font-[Gilroy-Medium]">{{ media.overview }}</p>
        <div class="flex items-center gap-4">
          <span class="px-2 py-1 bg-[#b20710]/70 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">{{
            media?.vote_average?.toFixed(1) }}</span>
          <span class="px-2 py-1 text-white bg-white/10 rounded-md text-sm font-[Gilroy-SemiBold]">{{
            media.media_type.toUpperCase() }}</span>
          <span class="text-sm font-[Gilroy-Medium]">{{ new Date(media?.release_date).getFullYear() }}</span>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="genreName in getGenreNames(getGenreIdsFromMedia(media))" :key="genreName"
              :to="`/ng/genre/${genreName.toLowerCase()}`"
              class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200 cursor-pointer">
              {{ genreName }}
            </router-link>
            <span v-if="isTv && media.number_of_seasons" class="ml-2 text-lg text-gray-300 font-[Gilroy-SemiBold]">
              {{ media.number_of_seasons }} Season{{ media.number_of_seasons > 1 ? "s" : "" }}
              • {{ tvStatus }}
            </span>
          </div>
        </div>

        <!-- Discover + Watchlist Buttons -->
        <div class="flex gap-3 mt-4 animate-fade-up">
          <button @click="goToWatch"
            class="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-[Gilroy-SemiBold] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>▶
            Discover</button>

          <!-- Heart Toggle Button -->
          <button @click="toggleWatchlist"
            class="px-4 py-2 flex items-center gap-2 rounded-xl font-[Gilroy-Medium] bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <span :class="{ 'text-red-500 animate-pulse': inWatchlist }">♥</span>
            <span>{{ inWatchlist ? "Added to My List" : "Add to My List" }}</span>
          </button>
        </div>

        <!-- Toast -->
        <transition name="fade">
          <div v-if="showToast"
            class="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
            {{ toastMessage }}
          </div>
        </transition>
      </div>
    </div>

    <!-- Mobile Info -->
    <div class="md:hidden flex flex-col px-8 -mt-56 relative space-y-3">
      <h1 class="text-4xl font-[Gilroy-Bold]">{{ media.title }}</h1>
      <p class="text-lg text-gray-300 font-[Gilroy-Medium]">{{ media.overview }}</p>
      <div class="flex items-center gap-4">
        <span class="px-2 py-1 bg-[#b20710]/70 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">{{
          media?.vote_average?.toFixed(1) }}</span>
        <span class="text-sm font-[Gilroy-Medium]">{{ new Date(media?.release_date).getFullYear() }}</span>
      </div>

      <div class="flex flex-wrap gap-2">
        <router-link v-for="genreName in getGenreNames(getGenreIdsFromMedia(media))" :key="genreName"
          :to="`/ng/genre/${genreName.toLowerCase()}`"
          class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200 cursor-pointer">
          {{ genreName }}
        </router-link>
      </div>

      <div class="flex gap-3 animate-fade-up">
        <button @click="goToWatch"
          class="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-[Gilroy-SemiBold] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>▶
          Discover</button>

        <button @click="toggleWatchlist"
          class="px-4 py-2 flex items-center gap-2 rounded-xl font-[Gilroy-Medium] bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
          <span :class="{ 'text-red-500 animate-pulse': inWatchlist }">♥</span>
          <span>{{ inWatchlist ? "Added to My List" : "Add to My List" }}</span>
        </button>

        <!-- Toast -->
        <transition name="fade">
          <div v-if="showToast"
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
            {{ toastMessage }}
          </div>
        </transition>
      </div>
    </div>

    <!-- Latest Season, Cast, Similar Titles remain unchanged -->
    <div v-if="isTv && latestSeason" class="px-8 space-y-4 mt-10">
      <h2 class="text-2xl font-[Gilroy-Bold]">Latest Season</h2>
      <div class="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
        <div class="flex md:flex-row gap-4">
          <img v-if="latestSeason.poster_path" :src="`https://image.tmdb.org/t/p/w1280${latestSeason.poster_path}`"
            alt="Season Poster" class="w-40 h-56 rounded-xl object-cover" loading="lazy" />
          <div class="self-end">
            <h3 class="text-xl font-[Gilroy-SemiBold] mb-1">{{ latestSeason.name }}</h3>
            <p class="text-gray-400 font-[Gilroy-Medium] mb-2">{{ latestSeason.episode_count }} Episodes</p>
            <p class="text-gray-300 font-[Gilroy-Medium] line-clamp-3">{{ latestSeason.overview }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="media?.media_type === 'tv' && media?.seasons?.length" class="mt-4 text-center">
      <RouterLink :to="`/tv/${slugify(media.title)}-${media.id}`"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition">
        View More Seasons →
      </RouterLink>
    </div>

    <div v-if="cast.length" class="space-y-3 px-8 py-3">
      <h2 class="text-xl font-[Gilroy-Bold]">Cast</h2>
      <div class="flex gap-4 overflow-x-auto pb-3">
        <div v-for="actor in cast" :key="actor.id" class="shrink-0 w-28 text-center py-3">
          <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
            class="rounded-xl mb-1 hover:scale-105 transition-all duration-300" loading="lazy" />
          <p class="text-sm font-[Gilroy-SemiBold] line-clamp-1">{{ actor.name }}</p>
          <p class="text-xs text-gray-400 font-[Gilroy-Medium] line-clamp-1">{{ actor.character }}</p>
        </div>
      </div>
    </div>

    <div v-if="similar.length" class="space-y-3 px-8">
      <h2 class="text-xl font-[Gilroy-Bold]">Similar Titles</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <router-link v-for="sim in similar" :key="sim.id" :to="simRoute(sim)" class="group">
          <img
            :src="sim.poster_path ? `https://image.tmdb.org/t/p/w300${sim.poster_path}` : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'"
            ` class="rounded-xl group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            loading="lazy" />
        </router-link>
      </div>
    </div>
  </section>

  <div v-else
    class="space-y-8 min-h-screen text-white py-10 px-6 md:px-10 mt-18 transition-all duration-900 animate-fade-up">
    <div class="relative overflow-hidden rounded-xl h-[60vh] shimmer"></div>

    <div class="space-y-4">
      <div class="h-8 w-1/2 rounded shimmer"></div>
      <div class="h-4 w-full rounded shimmer"></div>
      <div class="h-4 w-3/4 rounded shimmer"></div>
      <div class="flex space-x-2">
        <div class="w-16 h-6 rounded shimmer"></div>
        <div class="w-16 h-6 rounded shimmer"></div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="h-6 w-32 rounded shimmer"></div>
      <div class="flex space-x-3 overflow-x-auto">
        <div v-for="n in 5" :key="n" class="w-28 h-40 rounded-lg shimmer"></div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="h-6 w-40 rounded shimmer"></div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div v-for="n in 5" :key="n" class="w-full h-64 rounded-lg shimmer"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useWatchlistStore } from "../../src/stores/watchlist";
import { genreMap } from "../../src/types/media";
import { useHead } from "#imports";

const route = useRoute();
const router = useRouter();

const baseUrl = "https://image.tmdb.org/t/p/w1280";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const media = ref<any | null>(null);
const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const latestSeason = ref<any | null>(null);
const loading = ref(false);

const store = useWatchlistStore();
store.loadFromLocalStorage();

const inWatchlist = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

const isTv = computed(() => route.params.type === "tv" || media.value?.media_type === "tv");

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
  if (!raw) return null; // ✅ ensures raw is a string

  const match = raw.match(/-(\d+)$/);
  if (match) return Number(match[1]);

  return /^\d+$/.test(raw) ? Number(raw) : null;
}

function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  );
}

async function fetchDetails() {
  loading.value = true;

  try {
    const idNum = slugToId(route.params.name);
    if (!idNum) return;

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

    const d = detailsRes.data;

    media.value = {
      ...d,
      media_type: mediaType,
      title: d.title ?? d.name,
    };

    cast.value = creditsRes.data.cast?.slice(0, 15) ?? [];
    similar.value = (similarRes.data.results || [])
      .slice(0, 10)
      .map((r: any) => ({
        ...r,
        media_type: mediaType,
        title: r.title ?? r.name,
      }));

    if (mediaType === "tv" && d.seasons?.length) {
      latestSeason.value = d.seasons.at(-1);
    }

    inWatchlist.value = store.isInWatchlist(media.value.id);

    applySeo();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function getGenreIdsFromMedia(media: any): number[] {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres)) return media.genres.map((g: { id: number }) => g.id);
  return [];
}

function getGenreNames(ids?: number[]): string[] {
  return ids?.map((id) => genreMap[id]).filter((name): name is string => !!name) || ["Unknown"];
}

function simRoute(sim: any) {
  const slug = slugify(sim.title || sim.name);
  return sim.media_type === "tv" ? `/ng/tv/${slug}-${sim.id}` : `/ng/movie/${slug}-${sim.id}`;
}

function goToWatch() {
  router.push("#");
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
  setTimeout(() => (showToast.value = false), 2000);
}

// --- SEO using same structure as Home.vue / GenreView.vue ---
function applySeo() {
  if (!media.value) return;

  const title = `${media.value.title} (${new Date(media.value.release_date || media.value.first_air_date).getFullYear()}) – FilmRitz`;
  const desc = media.value.overview || `Discover ${media.value.title} on FilmRitz. Explore full details, cast, trailers, similar titles, and more.`;
  const image = media.value.backdrop_path || media.value.poster_path
    ? `https://image.tmdb.org/t/p/w1280${media.value.backdrop_path || media.value.poster_path}`
    : "https://placehold.co/1200x630/0f0f0f/FF0000?text=FILMRITZ";
  const url = `https://filmritz.com${route.fullPath}`;

  useHead({
    title,
    meta: [
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:image", content: image },
      { property: "og:url", content: url },
      { property: "og:type", content: isTv.value ? "video.tv_show" : "video.movie" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: image },
    ],
    link: [{ rel: "canonical", href: url }],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": isTv.value ? "TVSeries" : "Movie",
          name: media.value.title,
          description: media.value.overview,
          image,
          genre: getGenreNames(getGenreIdsFromMedia(media.value)),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: media.value.vote_average,
            ratingCount: media.value.vote_count,
          },
        }),
      } as any,
    ],
  });
}
onMounted(fetchDetails);
watch(route, fetchDetails);
</script>



<style scoped>
/* Pop animation for heart toggle */
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.pop-enter-from,
.pop-leave-to {
  transform: scale(0.7);
  opacity: 0;
}

/* Fade animation for toast */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Shimmer skeleton */
.shimmer {
  position: relative;
  overflow: hidden;
  background-color: #2a2a2a;
}

.shimmer::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
