<!-- src/views/TvDetails.vue -->
<template>
  <div class="min-h-screen text-white py-10 px-6 md:px-10 mt-10">
    <div v-if="tv">
      <!-- ✅ Hero Block for Latest Season -->
      <div v-if="latestSeason" class="relative h-[70vh] mb-10 rounded-2xl overflow-hidden" :style="{
        backgroundImage:
          latestSeason.poster_path || tv.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${latestSeason.poster_path || tv.backdrop_path
            })`
            : 'url(https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }">
        <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-6 md:p-10 max-w-3xl space-y-3 animate-fade-up">
          <h1 class="text-4xl font-[Gilroy-Bold]">
            {{ tv.name }} — {{ latestSeason.name }}
          </h1>
          <p class="text-gray-300 font-[Gilroy-Medium] line-clamp-4">
            {{ latestSeason.overview || tv.overview }}
          </p>
          <div class="flex items-center gap-3 text-gray-400">
            <p class="font-[Gilroy-SemiBold]">
              {{ latestSeason.episode_count }} Episodes
            </p>
            <span>•</span>
            <p class="font-[Gilroy-Medium]">
              Aired: {{ latestSeason.air_date || "N/A" }}
            </p>
          </div>
          <router-link :to="`/ng/tv/${slugify(tv.name)}-${tv.id}`"
            class="inline-block place-items-center gap-3 justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition">
            <span class="flex items-center gap-2"><i class="pi pi-arrow-left"></i>Back</span>
          </router-link>
        </div>
      </div>

      <!-- ✅ Seasons Section -->
      <h2 class="text-2xl font-[Gilroy-SemiBold] mb-4">Seasons</h2>

      <div v-for="(season, index) in displayedSeasons" :key="season.id" class="mb-8">
        <div class="bg-white/10 p-4 rounded-xl mb-3 cursor-pointer hover:bg-white/20 transition"
          @click="loadEpisodes(season.season_number)">
          <div class="flex gap-2 items-center">
            <p class="text-lg font-[Gilroy-Bold]">{{ season.name }}</p>
            <span class="text-[Gilroy-Bold] text-3xl">·</span>
            <p class="text-gray-400 font-[Gilroy-SemiBold]">
              {{ season.episode_count }} Episodes
            </p>
            <span class="text-[Gilroy-Bold] text-3xl">·</span>
            <p class="text-gray-400 font-[Gilroy-SemiBold]">
              {{ season.air_date }}
            </p>
          </div>
          <p class="text-gray-400 font-[Gilroy-Medium] line-clamp-3">
            {{ season.overview }}
          </p>
        </div>

        <!-- ✅ Episode List -->
        <div v-if="selectedSeason === season.season_number && episodes.length"
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pl-3 border-l border-white/10">
          <div v-for="ep in episodes" :key="ep.id" @click.prevent.stop="openModal(ep)"
            class="flex gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
            <img v-if="ep.still_path" :src="ep.still_path
              ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
              : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
              " alt="Episode thumbnail" class="w-28 h-20 object-cover rounded-md" loading="lazy" />
            <div>
              <p class="font-[Gilroy-Medium]">
                {{ ep.episode_number }}. {{ ep.name }}
              </p>
              <p class="text-sm text-gray-400 font-[Gilroy-Regular] line-clamp-3">
                {{ ep.overview }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ Episode Modal (Single) -->
      <TransitionRoot :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50 transition-all duration-200">
          <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogOverlay class="absolute inset-0 bg-[linear-gradient(to_bottom,#000000CC_10%,#000000_50%)]" />
            <DialogPanel v-if="selectedEpisode" @click.stop
              class="relative w-full max-w-4xl h-[40em] overflow-hidden rounded-xl text-white shadow-xl">
              <div>
                <div
                  class="absolute inset-0 bg-black/50 bg-fixed bg-center bg-cover mx-auto bg-no-repeat transition-all duration-300 animate-pulse"
                  v-if="loading"></div>
                <div v-else
                  class="absolute inset-0 bg-fixed bg-center bg-cover mx-auto bg-no-repeat transition-all duration-500 animate-fade-up"
                  :style="{
                    backgroundImage: selectedEpisode.still_path
                      ? `url(${baseUrl + selectedEpisode.still_path})`
                      : 'url(https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat)',
                  }"></div>
                <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent"></div>
              </div>

              <button @click="closeModal"
                class="hover:bg-white/30 absolute top-5 right-5 rounded-full p-1 cursor-pointer transition-all duration-300">
                <svg viewBox="0 0 36 36" width="36" height="36" class="transform -rotate-45"
                  xmlns="http://www.w3.org/2000/svg" fill="none" role="img" loading="lazy">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
                    fill="currentColor"></path>
                </svg>
              </button>

              <div class="absolute bottom-0 left-0 z-10 p-6 space-y-3">
                <DialogTitle as="h2" class="text-3xl font-[Gilroy-Bold]">
                  {{ selectedEpisode.name }}
                </DialogTitle>
                <div class="text-gray-400 font-[Gilroy-Medium]">
                  Season {{ selectedEpisode.season_number }} • Episode {{ selectedEpisode.episode_number }}
                </div>
                <div class="flex items-center gap-4">
                  <span class="px-2 py-1 bg-green-700 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">
                    {{ selectedEpisode?.vote_average?.toFixed(1) }}
                  </span>
                  <span class="text-sm font-[Gilroy-Medium]">
                    {{ selectedEpisode.air_date }}
                  </span>
                </div>
                <DialogDescription class="mt-3 max-w-2xl text-lg font-[Gilroy-Medium]">
                  {{ selectedEpisode.overview }}
                </DialogDescription>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- ✅ View More / View Less Button -->
      <div v-if="tv.seasons.length > 2" class="mt-4 text-center">
        <button @click="toggleSeasons"
          class="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition cursor-pointer">
          {{ showAllSeasons ? "View Less" : "View More" }}
        </button>
      </div>
    </div>

    <div v-else class="text-gray-400 text-center mt-10">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getTVDetails, getTVSeasonDetails } from "../../api/tmdb";
import type { TVShow, Episode } from "../../types/media";
import { useHead } from '@unhead/vue'
import {
  TransitionRoot,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from "@headlessui/vue";

const route = useRoute();
const tv = ref<TVShow | null>(null);
const episodes = ref<Episode[]>([]);
const selectedSeason = ref<number | null>(null);
const showAllSeasons = ref(false);
const isOpen = ref(false);
const latestSeason = ref<any | null>(null);
const loading = ref(false);
const selectedEpisode = ref<Episode | null>(null);
const baseUrl = "https://image.tmdb.org/t/p/w1280";

useHead({
  title: 'FilmRitz | Stream Your Favorite TV Shows',
  meta: [
    { name: 'description', content: 'Explore and stream trending TV shows on FilmRitz.' },
  ],
})

// ✅ Fetch TV details
onMounted(async () => {
  const id = slugToId(route.params.name);
  if (!id) return;
  tv.value = await getTVDetails(id);
  if (tv.value?.seasons?.length) {
    latestSeason.value = tv.value.seasons[tv.value.seasons.length - 1];
  }
});

// ✅ Load episodes for specific season
async function loadEpisodes(seasonNumber: number) {
  if (!tv.value) return;
  if (selectedSeason.value === seasonNumber) {
    selectedSeason.value = null;
    episodes.value = [];
    return;
  }
  selectedSeason.value = seasonNumber;
  const seasonData = await getTVSeasonDetails(tv.value.id, seasonNumber);
  episodes.value = seasonData.episodes || [];
}

// ✅ Only 2 seasons unless expanded
const displayedSeasons = computed(() => {
  if (!tv.value) return [];
  return showAllSeasons.value ? tv.value.seasons : tv.value.seasons.slice(0, 2);
});

function toggleSeasons() {
  showAllSeasons.value = !showAllSeasons.value;
}

// --- helpers ---
function slugToId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const raw = Array.isArray(param) ? param[0] : param;
  const str = String(raw);
  const m = str.match(/-(\d+)$/);
  if (m) return Number(m[1]);
  if (/^\d+$/.test(str)) return Number(str);
  return null;
}

function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(
    String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
}
// --- end helpers ---

function closeModal() {
  isOpen.value = false;
  selectedEpisode.value = null;
}

function openModal(ep: Episode) {
  selectedEpisode.value = ep;
  isOpen.value = true;
}

watch(tv, (newTv) => {
  if (!newTv) return

  const title = newTv.name || 'FilmRitz — Discover Movies & TV Series'
  const description =
    newTv.overview?.length > 150
      ? newTv.overview.slice(0, 147) + '...'
      : newTv.overview || 'Stream your favorite TV shows on FilmRitz.'

  const image = newTv.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${newTv.backdrop_path}`
    : 'https://filmritz.vercel.app/ng/filmritzlogo.jpg'

  useHead({
    title: `${title} | FilmRitz — Discover Movies & TV Series`,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: `${title}, FilmRitz, TV show, series, streaming, episodes` },

      // Open Graph / Facebook
      { property: 'og:title', content: `${title} | FilmRitz — Discover Movies & TV Series` },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: 'video.tv_show' },
      { property: 'og:url', content: `https://filmritz.vercel.app/ng/${route.fullPath}` },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${title} | FilmRitz — Discover Movies & TV Series` },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: `https://filmritz.vercel.app/ng/${route.fullPath}` },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TVSeries',
          name: title,
          description,
          image,
          numberOfSeasons: newTv.number_of_seasons,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: newTv.vote_average?.toFixed(1),
            bestRating: '10',
          },
        }),
      },
    ],
  })
})
</script>
