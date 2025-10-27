<!-- src/views/TvDetails.vue -->
<template>
  <div class="min-h-screen text-white py-10 px-6 md:px-10 mt-10">
    <div v-if="tv">
      <!-- ✅ Hero Block for Latest Season -->
      <div
        v-if="latestSeason"
        class="relative h-[70vh] mb-10 rounded-2xl overflow-hidden"
        :style="{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            latestSeason.poster_path || tv.backdrop_path
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
        ></div>
        <div
          class="absolute bottom-0 left-0 p-6 md:p-10 max-w-3xl space-y-3 animate-fade-up"
        >
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
          <router-link
            :to="`/ng/tv/${tv.id}`"
            class="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition"
          >
            View Full Details
          </router-link>
        </div>
      </div>

      <!-- ✅ Seasons Section -->
      <h2 class="text-2xl font-[Gilroy-SemiBold] mb-4">Seasons</h2>

      <div
        v-for="(season, index) in displayedSeasons"
        :key="season.id"
        class="mb-8"
      >
        <div
          class="bg-white/10 p-4 rounded-xl mb-3 cursor-pointer hover:bg-white/20 transition"
          @click="loadEpisodes(season.season_number)"
        >
          <div class="flex gap-2 items-center">
            <p class="text-lg font-[Gilroy-Bold]">{{ season.name }}</p>
            <span class="text-[Gilroy-Bold] text-3xl">·</span>
            <p class="text-gray-400 font-[Gilroy-SemiBold]">
              {{ season.episode_count }} Episodes
            </p>
          </div>
          <p class="text-gray-400 font-[Gilroy-Medium] line-clamp-3">
            {{ season.overview }}
          </p>
        </div>

        <!-- ✅ Episode List -->
        <div
          v-if="selectedSeason === season.season_number && episodes.length"
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pl-3 border-l border-white/10"
        >
          <div
            v-for="ep in episodes"
            :key="ep.id"
            class="flex gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <img
              v-if="ep.still_path"
              :src="`https://image.tmdb.org/t/p/w300${ep.still_path}`"
              alt="Episode thumbnail"
              class="w-28 h-20 object-cover rounded-md"
              loading="lazy"
            />
            <div>
              <p class="font-[Gilroy-Medium]">
                {{ ep.episode_number }}. {{ ep.name }}
              </p>
              <p class="text-sm text-gray-400 font-[Gilroy-Regular] line-clamp-2">
                {{ ep.overview }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ View More / View Less Button -->
      <div v-if="tv.seasons.length > 2" class="mt-4 text-center">
        <button
          @click="toggleSeasons"
          class="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition cursor-pointer"
        >
          {{ showAllSeasons ? "View Less" : "View More" }}
        </button>
      </div>
    </div>

    <div v-else class="text-gray-400 text-center mt-10">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getTVDetails, getTVSeasonDetails } from "../../api/tmdb";
import type { TVShow, Episode } from "../../types/media";

const route = useRoute();
const tv = ref<TVShow | null>(null);
const episodes = ref<Episode[]>([]);
const selectedSeason = ref<number | null>(null);
const showAllSeasons = ref(false);
const latestSeason = ref<any | null>(null);

// ✅ Fetch TV details
onMounted(async () => {
  const id = Number(route.params.id);
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
</script>
