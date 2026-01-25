<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <div v-if="!tv" class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto pt-24">
      <div class="relative h-[70vh] rounded-2xl bg-gray-800/50 animate-pulse mb-8"></div>

      <div class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-gray-800/50 rounded-2xl p-6 animate-pulse">
          <div class="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div class="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="relative h-screen overflow-hidden duration-500 transition-all" :style="{
        backgroundImage:
          latestSeason?.poster_path || tv.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${latestSeason?.poster_path || tv.backdrop_path
            })`
            : 'url(https://placehold.co/1920x1080/0f0f0f/FF0000?text=NO+IMAGE)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }">
        <div class="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent"></div>
        <div class="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>

        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 mx-auto">
          <router-link :to="`/ng/tv/${slugify(tv.name)}-${tv.id}`"
            class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-[Gilroy-Medium] animate-fade-up">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd"
                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd" />
            </svg>

            Back to Show
          </router-link>

          <h1 class="text-4xl md:text-6xl font-[Gilroy-Bold] mb-4 animate-fade-up" style="animation-delay: 0.1s">
            {{ tv.name }}
          </h1>

          <div v-if="latestSeason" class="mb-6 animate-fade-up" style="animation-delay: 0.15s">
            <h2 class="text-2xl md:text-3xl font-[Gilroy-SemiBold] text-gray-300 mb-3">
              {{ latestSeason.name }}
            </h2>
            <div class="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
              <span class="px-4 py-2 bg-[#b20710] rounded-xl font-[Gilroy-SemiBold]">
                {{ latestSeason.episode_count }} Episode{{
                  latestSeason.episode_count > 1 ? "s" : ""
                }}
              </span>
              <span class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-[Gilroy-Medium]">
                {{
                  latestSeason.air_date
                    ? new Date(latestSeason.air_date).getFullYear()
                    : "TBA"
                }}
              </span>
              <span v-if="latestSeason.vote_average"
                class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-[Gilroy-Medium] flex items-center gap-2">
                <span class="text-yellow-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd"
                      d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                      clip-rule="evenodd" />
                  </svg></span>
                {{ latestSeason.vote_average.toFixed(1) }}
              </span>
            </div>
          </div>

          <p class="text-lg md:text-xl text-gray-300 font-[Gilroy-Medium] line-clamp max-w-[1230px] lg:max-w-[1440px] animate-fade-up"
            style="animation-delay: 0.2s">
            {{ latestSeason?.overview || tv.overview }}
          </p>
        </div>
      </div>

      <div class="px-6 md:px-12 mx-auto mt-12 transition-all duration-500">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-[Gilroy-Bold]">All Seasons</h2>
          <span class="text-gray-400 font-[Gilroy-Medium]">
            {{ displayedSeasons.length }} season
          </span>
        </div>

        <div class="space-y-6 transition-all duration-500">
          <div v-for="season in displayedSeasons" :key="season.id"
            class="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#b20710]/50 transition-all duration-500 overflow-hidden">
            <div @click="toggleSeason(season.season_number)"
              class="p-6 cursor-pointer hover:bg-white/5 transition-all duration-500">
              <div class="flex items-start justify-between trasistion-all duration-500">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-2xl font-[Gilroy-Bold]">
                      {{ season.name }}
                    </h3>
                    <span class="px-3 py-1 bg-[#b20710] rounded-lg text-sm font-[Gilroy-SemiBold]">
                      {{ season.episode_count }} EP
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 text-gray-400 font-[Gilroy-Medium] mb-3">
                    <span>{{
                      season.air_date
                        ? new Date(season.air_date).getFullYear()
                        : "TBA"
                    }}</span>
                    <span v-if="season.vote_average">•</span>
                    <span v-if="season.vote_average" class="flex items-center gap-1">
                      <span class="text-yellow-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16" fill="currentColor" class="size-4">
                          <path fill-rule="evenodd"
                            d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                            clip-rule="evenodd" />
                        </svg></span>
                      {{ season.vote_average.toFixed(1) }}
                    </span>
                  </div>

                  <p class="text-gray-300 font-[Gilroy-Regular] line-clamp-2">
                    {{ season.overview || "No description available." }}
                  </p>
                </div>

                <button
                  class="ml-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500 cursor-pointer"
                  :class="selectedSeason === season.season_number && 'rotate-180'
                    ">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill-rule="evenodd"
                      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="selectedSeason === season.season_number" class="border-t border-white/10">
              <div v-if="loadingEpisodes" class="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="n in 6" :key="n" class="flex gap-4 p-3 bg-gray-800/50 rounded-xl animate-pulse">
                  <div class="w-28 h-20 bg-gray-700 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              </div>

              <div v-else-if="episodes.length"
                class="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500">
                <div v-for="ep in episodes" :key="ep.id" @click="openModal(ep)"
                  class="group relative cursor-pointer rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all duration-900">
                  <div class="relative aspect-video overflow-hidden bg-gray-800 transition-all duration-900">
                    <img v-if="ep.still_path" :src="`https://image.tmdb.org/t/p/w500${ep.still_path}`" :alt="ep.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                      loading="lazy" />
                    <div v-else class="w-full h-full flex items-center justify-center text-4xl font-[Gilroy-Bold]">
                      <p>Coming Soon</p>
                    </div>

                    <div
                      class="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg font-[Gilroy-Bold] text-sm">
                      EP {{ ep.episode_number }}
                    </div>
                  </div>

                  <div class="p-4">
                    <h4 class="text-white font-[Gilroy-Bold] text-lg line-clamp-1 mb-2">
                      {{ ep.name }}
                    </h4>
                    <p class="text-gray-400 font-[Gilroy-Regular] text-sm line-clamp-2 mb-2">
                      {{ ep.overview || "No description available." }}
                    </p>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                      <span v-if="ep.air_date">{{
                        new Date(ep.air_date).toLocaleDateString()
                      }}</span>
                      <span v-if="ep.runtime">• {{ ep.runtime }}min</span>
                      <span v-if="ep.vote_average" class="flex items-center gap-1">•
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                          class="size-4 text-yellow-400">
                          <path fill-rule="evenodd"
                            d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                            clip-rule="evenodd" />
                        </svg>
                        {{ ep.vote_average.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="p-6 text-center text-gray-400">
                No episodes available for this season
              </div>
            </div>
          </div>
        </div>

        <div v-if="tv.seasons.length > 3" class="mt-8 text-center">
          <button @click="toggleSeasons"
            class="px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all transform hover:scale-105 cursor-pointer">
            {{ showAllSeasons ? "Show Less ↑" : "View All Seasons ↓" }}
          </button>
        </div>
      </div>

      <TransitionRoot :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50 text-white" :initialFocus="initialFocus">
          <DialogOverlay class="fixed inset-0 bg-black/90 backdrop-blur-sm" />

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen p-4">
              <button ref="initialFocus" class="sr-only" />

              <DialogPanel
                class="relative w-full max-w-[1230px] lg:max-w-[1440px] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                <div v-if="loading" class="animate-pulse">
                  <div class="h-[60vh] bg-gray-800"></div>
                  <div class="p-8 space-y-4">
                    <div class="h-8 bg-gray-700 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div class="h-4 bg-gray-700 rounded w-full"></div>
                  </div>
                </div>

                <div v-else-if="selectedEpisode" class="max-h-[90vh] overflow-y-auto">
                  <div class="relative h-[60vh] bg-cover bg-center" :style="{
                    backgroundImage: selectedEpisode.still_path
                      ? `url(https://image.tmdb.org/t/p/w1280${selectedEpisode.still_path})`
                      : 'url(https://placehold.co/1280x720/0f0f0f/FF0000?text=NO+IMAGE)',
                  }">
                    <div class="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>

                    <button @click="closeModal" class="absolute top-6 right-6">
                      <span class="fixed">
                        <svg viewBox="0 0 36 36" width="36" height="36"
                          class="transform -rotate-45 absolute right-2 p-1 hover:bg-[#b20710]/70 rounded-full transition-all duration-500 z-20 cursor-pointer"
                          fill="currentColor">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" />
                        </svg>
                      </span>
                    </button>
                  </div>

                  <div class="relative -mt-32 p-8 bg-linear-to-t from-black via-black to-transparent">
                    <DialogTitle class="text-4xl font-[Gilroy-Bold] mb-2">
                      {{ selectedEpisode.name }}
                    </DialogTitle>

                    <div class="flex flex-wrap items-center gap-3 mb-4">
                      <span class="text-gray-400 font-[Gilroy-Medium]">
                        Season {{ selectedEpisode.season_number }} • Episode
                        {{ selectedEpisode.episode_number }}
                      </span>
                      <span v-if="selectedEpisode.vote_average"
                        class="px-3 py-1 bg-[#b20710] rounded-lg font-[Gilroy-SemiBold] flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4 text-yellow-400">
                          <path fill-rule="evenodd"
                            d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                            clip-rule="evenodd" />
                        </svg>
                        {{ selectedEpisode.vote_average.toFixed(1) }}
                      </span>
                      <span v-if="selectedEpisode.air_date" class="text-gray-400 font-[Gilroy-Medium]">
                        {{
                          new Date(
                            selectedEpisode.air_date,
                          ).toLocaleDateString()
                        }}
                      </span>
                      <span v-if="selectedEpisode.runtime" class="text-gray-400 font-[Gilroy-Medium]">
                        {{ selectedEpisode.runtime }} min
                      </span>
                    </div>

                    <DialogDescription
                      class="text-lg text-gray-300 font-[Gilroy-Regular] mb-8 max-w-[1230px] lg:max-w-[1440px]">
                      {{
                        selectedEpisode.overview || "No description available."
                      }}
                    </DialogDescription>

                    <div v-if="episodeCredits.length" class="mt-8 text-white">
                      <h3 class="text-2xl font-[Gilroy-Bold] mb-6">
                        Episode Cast ({{ episodeCredits.length }})
                      </h3>
                      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div v-for="actor in episodeCredits" :key="actor.id" @click="goToActor(actor)"
                          class="flex items-center gap-3 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                          <img :src="actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : 'https://placehold.co/80x80/0f0f0f/FF0000?text=NO+IMG'
                            " class="w-14 h-14 rounded-full object-cover" />
                          <div class="flex-1 min-w-0">
                            <p class="font-[Gilroy-SemiBold] text-lg truncate">
                              {{ actor.name }}
                            </p>
                            <p class="text-sm text-gray-400 font-[Gilroy-Regular] truncate">
                              {{ actor.character || "Guest Star" }}
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  getTVDetails,
  getTVSeasonDetails,
  getTVEpisodeDetails,
  getTVEpisodeCredits,
} from "@/api/tmdb";
import type { TVShow, Episode, Season } from "@/types/media";
import { useActorNavigation } from "@/utils/actorHelpers";
import { useHead } from "@unhead/vue";
import {
  TransitionRoot,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@headlessui/vue";

const tv = ref<TVShow | null>(null);
const episodes = ref<Episode[]>([]);
const selectedSeason = ref<number | null>(null);
const showAllSeasons = ref(false);
const loadingEpisodes = ref(false);
const isOpen = ref(false);
const latestSeason = ref<Season | null>(null);
const loading = ref(false);
const selectedEpisode = ref<Episode | null>(null);
const episodeCredits = ref<any[]>([]);
const { goToActor } = useActorNavigation();

const initialFocus = ref<HTMLElement | null>(null);

useHead({
  title: computed(() =>
    tv.value
      ? `${tv.value.name} - All Seasons | FilmRitz`
      : "TV Show Seasons | FilmRitz",
  ),
});

const props = defineProps<{
  name: string;
}>();

const displayedSeasons = computed(() => {
  if (!tv.value) return [];
  const filteredSeasons = tv.value.seasons.filter(
    (s: any) => s.season_number > 0,
  );
  return showAllSeasons.value ? filteredSeasons : filteredSeasons.slice(0, 2);
});

function slugToId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const raw = Array.isArray(param) ? param[0] : param;
  const match = String(raw).match(/-(\d+)$/);
  return match
    ? Number(match[1])
    : /^\d+$/.test(raw as string)
      ? Number(raw)
      : null;
}

function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(
    String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  );
}

async function toggleSeason(seasonNumber: number) {
  if (selectedSeason.value === seasonNumber) {
    selectedSeason.value = null;
    episodes.value = [];
    return;
  }

  selectedSeason.value = seasonNumber;
  await loadEpisodes(seasonNumber);
}

async function loadEpisodes(seasonNumber: number) {
  if (!tv.value) return;

  loadingEpisodes.value = true;
  try {
    const seasonData = await getTVSeasonDetails(tv.value.id, seasonNumber);
    episodes.value = seasonData.episodes || [];
  } catch (error) {
    console.error("Failed to load episodes:", error);
  } finally {
    loadingEpisodes.value = false;
  }
}

function toggleSeasons() {
  showAllSeasons.value = !showAllSeasons.value;
  if (!showAllSeasons.value) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function closeModal() {
  isOpen.value = false;
  selectedEpisode.value = null;
  episodeCredits.value = [];
}

async function openModal(ep: Episode) {
  loading.value = true;
  isOpen.value = true;

  if (!tv.value) return;

  try {
    const [epDetails, credits] = await Promise.all([
      getTVEpisodeDetails(tv.value.id, ep.season_number, ep.episode_number),
      getTVEpisodeCredits(tv.value.id, ep.season_number, ep.episode_number),
    ]);

    selectedEpisode.value = epDetails;
    episodeCredits.value = credits;
  } catch (error) {
    console.error("Failed to load episode details:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const id = slugToId(props.name);
  if (!id) return;

  try {
    tv.value = await getTVDetails(id);
    if (tv.value?.seasons?.length) {
      const regularSeasons = tv.value.seasons.filter(
        (s: any) => s.season_number > 0,
      );
      latestSeason.value = regularSeasons[regularSeasons.length - 1];
    }
  } catch (error) {
    console.error("Failed to load TV show:", error);
  }
});
</script>

<style scoped>
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
