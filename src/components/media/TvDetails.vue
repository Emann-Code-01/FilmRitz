<template>
  <div class="min-h-screen text-white py-10 px-6 md:px-10 mt-20">
    <!-- Skeleton / Loading State -->
    <div v-if="!tv" class="space-y-8">
      <!-- Hero skeleton -->
      <div class="relative h-[70vh] rounded-2xl bg-gray-800 animate-pulse"></div>

      <!-- Seasons skeleton -->
      <div class="space-y-4">
        <div v-for="i in 2" :key="i" class="p-4 bg-gray-700 rounded-xl animate-pulse h-20"></div>
      </div>

      <!-- Episodes skeleton -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div v-for="i in 6" :key="i" class="flex gap-4 p-3 bg-gray-700 rounded-lg animate-pulse h-24">
          <div class="w-28 h-20 bg-gray-600 rounded-md"></div>
          <div class="flex-1 space-y-2 py-1">
            <div class="h-4 bg-gray-600 rounded w-3/4"></div>
            <div class="h-3 bg-gray-600 rounded w-full"></div>
            <div class="h-3 bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual content -->
    <div v-else>
      <!-- Hero Block -->
      <div v-if="latestSeason" class="relative h-[70vh] mb-10 rounded-2xl overflow-hidden" :style="{
        backgroundImage:
          latestSeason.poster_path || tv.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${latestSeason.poster_path || tv.backdrop_path})`
            : 'url(https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }">
        <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-6 md:p-10 max-w-3xl space-y-3 animate-fade-up">
          <h1 class="text-4xl font-[Gilroy-Bold]">{{ tv.name }} — {{ latestSeason.name }}</h1>
          <p class="text-gray-300 font-[Gilroy-Medium] line-clamp-4">
            {{ latestSeason.overview || tv.overview }}
          </p>
          <div class="flex items-center gap-3 text-gray-400">
            <p class="font-[Gilroy-SemiBold]">{{ latestSeason.episode_count }} Episodes</p>
            <span>•</span>
            <p class="font-[Gilroy-Medium]">Aired: {{ latestSeason.air_date || 'N/A' }}</p>
          </div>
          <router-link :to="`/ng/tv/${slugify(tv.name)}-${tv.id}`"
            class="inline-block place-items-center gap-3 justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition">
            <span class="flex items-center gap-2"><i class="pi pi-arrow-left"></i>Back</span>
          </router-link>
        </div>
      </div>

      <!-- Seasons Section -->
      <h2 class="text-2xl font-[Gilroy-SemiBold] mb-4">Seasons</h2>
      <div v-for="season in displayedSeasons" :key="season.id" class="mb-8">
        <div class="bg-white/10 p-4 rounded-xl mb-3 cursor-pointer hover:bg-white/20 transition"
          @click="loadEpisodes(season.season_number)">
          <div class="flex gap-2 items-center">
            <p class="text-lg font-[Gilroy-Bold]">{{ season.name }}</p>
            <span class="text-[Gilroy-Bold] text-3xl">·</span>
            <p class="text-gray-400 font-[Gilroy-SemiBold]">{{ season.episode_count }} Episodes</p>
            <span class="text-[Gilroy-Bold] text-3xl">·</span>
            <p class="text-gray-400 font-[Gilroy-SemiBold]">{{ season.air_date }}</p>
          </div>
          <p class="text-gray-400 font-[Gilroy-Medium] line-clamp-3">{{ season.overview }}</p>
        </div>

        <!-- Episode List -->
        <div v-if="selectedSeason === season.season_number && episodes.length"
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pl-3 border-l border-white/10">
          <div v-for="ep in episodes" :key="ep.id" @click.prevent.stop="openModal(ep)"
            class="flex gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
            <img v-if="ep.still_path" :src="`https://image.tmdb.org/t/p/w300${ep.still_path}`" alt="Episode thumbnail"
              class="w-28 h-20 object-cover rounded-md" loading="lazy" />
            <div>
              <p class="font-[Gilroy-Medium]">{{ ep.episode_number }}. {{ ep.name }}</p>
              <p class="text-sm text-gray-400 font-[Gilroy-Regular] line-clamp-3">
                {{ ep.overview }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Episode Modal -->
      <TransitionRoot :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50">
          <div class="fixed inset-0 overflow-y-auto">
            <DialogOverlay class="fixed inset-0 bg-black/80" />
            <div class="flex items-center justify-center min-h-screen p-4">
              <DialogPanel v-if="selectedEpisode"
                class="relative w-full max-w-5xl rounded-xl overflow-hidden text-white shadow-xl bg-black">

                <!-- Skeleton -->
                <div v-if="loading" class="animate-pulse">
                  <div class="h-[70vh] bg-gray-700"></div>
                  <div class="p-6 space-y-3 bg-gray-800">
                    <div class="h-6 bg-gray-600 w-3/4 rounded"></div>
                    <div class="h-4 bg-gray-600 w-1/2 rounded"></div>
                    <div class="h-4 bg-gray-600 w-full rounded"></div>
                    <div class="h-4 bg-gray-600 w-5/6 rounded"></div>
                  </div>
                </div>

                <!-- Actual content -->
                <div v-else class="overflow-y-auto h-[90vh] relative">
                  <div class="relative h-[70vh] bg-cover bg-center" :style="{
                    backgroundImage: selectedEpisode.still_path
                      ? `url(https://image.tmdb.org/t/p/w1280${selectedEpisode.still_path})`
                      : 'url(https://placehold.co/600x400/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE)',
                  }">
                    <div class="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
                    <button @click="closeModal"
                      class="hover:bg-[#b20710]/70 absolute top-6 right-6 rounded-full p-1 transition-all duration-300 z-20">
                      <svg viewBox="0 0 36 36" width="36" height="36" class="transform -rotate-45" fill="currentColor">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" />
                      </svg>
                    </button>
                  </div>

                  <!-- Overlay Info -->
                  <div
                    class="relative -mt-40 p-6 bg-linear-to-t from-black/95 via-black/70 to-transparent rounded-t-2xl">
                    <DialogTitle as="h2" class="text-3xl font-[Gilroy-Bold]">
                      {{ selectedEpisode.name }}
                    </DialogTitle>
                    <div class="text-gray-400 font-[Gilroy-Medium] mt-1">
                      Season {{ selectedEpisode.season_number }} • Episode {{ selectedEpisode.episode_number }}
                    </div>
                    <div class="flex items-center gap-4 mt-2">
                      <span class="px-2 py-1 bg-[#b20710]/70 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">
                        {{ selectedEpisode?.vote_average?.toFixed(1) }}
                      </span>
                      <span class="text-sm font-[Gilroy-Medium]">{{ selectedEpisode.air_date }}</span>
                      <span class="text-gray-400 font-[Gilroy-Medium]">{{ selectedEpisode.runtime }}min</span>
                    </div>
                    <DialogDescription class="mt-4 max-w-2xl text-lg font-[Gilroy-Medium]">
                      {{ selectedEpisode.overview }}
                    </DialogDescription>

                    <!-- Cast -->
                    <div v-if="episodeCredits.length" class="mt-8">
                      <h3 class="text-2xl font-[Gilroy-SemiBold] mb-4">Cast</h3>
                      <div class="grid grid-cols-2 gap-4">
                        <div v-for="actor in episodeCredits" :key="actor.id"
                          class="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                          <img :src="actor.profile_path
                            ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path
                            : 'https://placehold.co/80x80/0f0f0f/FF0000?text=NO+IMG'"
                            class="w-14 h-14 rounded-full object-cover" />
                          <div>
                            <p class="font-[Gilroy-Medium] text-base">{{ actor.name }}</p>
                            <p class="text-sm text-gray-400 font-[Gilroy-Regular]">
                              as {{ actor.character || 'Unknown Role' }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- View More / View Less Button -->
      <div v-if="tv.seasons.length > 2" class="mt-4 text-center">
        <button @click="toggleSeasons"
          class="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition cursor-pointer">
          {{ showAllSeasons ? 'View Less' : 'View More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getTVDetails, getTVSeasonDetails, getTVEpisodeDetails, getTVEpisodeCredits } from "../../api/tmdb";
import type { TVShow, Episode, Season } from "../../types/media";
import { useHead } from "@unhead/vue";
import { TransitionRoot, Dialog, DialogPanel, DialogTitle, DialogDescription, DialogOverlay } from "@headlessui/vue";

const route = useRoute();
const tv = ref<TVShow | null>(null);
const episodes = ref<Episode[]>([]);
const selectedSeason = ref<number | null>(null);
const showAllSeasons = ref(false);
const isOpen = ref(false);
const latestSeason = ref<Season | null>(null);
const loading = ref(false);
const selectedEpisode = ref<Episode | null>(null);
const episodeCredits = ref<any[]>([]);

useHead({ title: "FilmRitz | Stream Your Favorite TV Shows" });

// Load TV details
onMounted(async () => {
  const id = slugToId(route.params.name);
  if (!id) return;
  tv.value = await getTVDetails(id);
  if (tv.value?.seasons?.length) {
    latestSeason.value = tv.value.seasons[tv.value.seasons.length - 1];
  }
});

// Load episodes
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

// Toggle seasons view
const displayedSeasons = computed(() => {
  if (!tv.value) return [];
  return showAllSeasons.value ? tv.value.seasons : tv.value.seasons.slice(0, 2);
});
function toggleSeasons() { showAllSeasons.value = !showAllSeasons.value; }

// Helpers
function slugToId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const raw = Array.isArray(param) ? param[0] : param;
  const m = String(raw).match(/-(\d+)$/);
  return m ? Number(m[1]) : /^\d+$/.test(raw as string) ? Number(raw) : null;
}
function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
}

// Modal actions
function closeModal() {
  isOpen.value = false;
  selectedEpisode.value = null;
  episodeCredits.value = [];
}

async function openModal(ep: Episode) {
  loading.value = true;
  isOpen.value = true;

  if (!tv.value) return;

  // Episode details
  const epDetails = await getTVEpisodeDetails(tv.value.id, ep.season_number, ep.episode_number);
  selectedEpisode.value = epDetails;

  // Episode-specific cast
  episodeCredits.value = await getTVEpisodeCredits(tv.value.id, ep.season_number, ep.episode_number);

  loading.value = false;
}
</script>

<style scoped></style>
