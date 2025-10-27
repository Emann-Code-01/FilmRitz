<!-- src/views/MediaDetails.vue -->
<template>
  <section v-if="media" class="space-y-8">
    <div
      class="relative h-[85vh] overflow-hidden"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'norepeat',
      }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
      ></div>

      <div
        class="absolute bottom-0 hidden md:flex flex-col md:left-8 max-w-5xl space-y-3 transition-all duration-500 animate-fade-up"
      >
        <h1 class="text-4xl font-[Gilroy-Bold]">{{ media.title }}</h1>
        <p class="text-lg text-gray-300 font-[Gilroy-Medium]">
          {{ media.overview }}
        </p>
        <div class="flex items-center gap-4">
          <span
            class="px-2 py-1 bg-green-700 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]"
          >
            {{ media?.vote_average?.toFixed(1) }}
          </span>
          <span class="text-sm font-[Gilroy-Medium]">{{
            new Date(media?.release_date).getFullYear()
          }}</span>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genreName in getGenreNames(getGenreIdsFromMedia(media))"
              :key="genreName"
              class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40 transition-all duration-200"
            >
              {{ genreName }}
            </span>

            <span
              v-if="isTv && media.number_of_seasons"
              class="ml-2 text-lg text-gray-300 font-[Gilroy-SemiBold]"
            >
              {{ media.number_of_seasons }} Season{{
                media.number_of_seasons > 1 ? "s" : ""
              }}
            </span>
          </div>
        </div>

        <div
          class="flex gap-3 mt-4 transition-all duration-500 animate-fade-up"
        >
          <button
            @click="goToWatch"
            class="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-[Gilroy-SemiBold]bold flex items-center gap-2"
          >
            ▶ Watch
          </button>
          <button
            @click="toggleWatchlist"
            class="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 flex items-center gap-2 font-[Gilroy-Medium]"
          >
            <span v-if="inWatchlist">✓ Added</span>
            <span v-else>＋ My List</span>
          </button>
        </div>
      </div>
    </div>

    <div class="md:hidden flex flex-col px-8 -mt-56 relative space-y-3">
      <h1 class="text-4xl font-[Gilroy-Bold]">{{ media.title }}</h1>
      <p class="text-lg text-gray-300 font-[Gilroy-Medium]">
        {{ media.overview }}
      </p>
      <div class="flex items-center gap-4">
        <span
          class="px-2 py-1 bg-green-700 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]"
        >
          {{ media?.vote_average?.toFixed(1) }}
        </span>
        <span class="text-sm font-[Gilroy-Medium]">{{
          new Date(media?.release_date).getFullYear()
        }}</span>
      </div>

      <div class="space-x-3">
        <span
          v-for="genreName in getGenreNames(getGenreIdsFromMedia(media))"
          :key="genreName"
          class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40"
        >
          {{ genreName }}
        </span>
      </div>

      <div class="flex gap-3 transition-all duration-500 animate-fade-up">
        <button
          @click="goToWatch"
          class="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-[Gilroy-SemiBold]bold flex items-center gap-2"
        >
          ▶ Watch
        </button>
        <button
          @click="toggleWatchlist"
          class="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 flex items-center gap-2 font-[Gilroy-Medium]"
        >
          <span v-if="inWatchlist">✓ Added</span>
          <span v-else>＋ My List</span>
        </button>
      </div>
    </div>

    <!-- ✅ Show latest season only for TV shows -->
    <div v-if="isTv && latestSeason" class="px-8 space-y-4 mt-10">
      <h2 class="text-2xl font-[Gilroy-Bold]">Latest Season</h2>

      <div
        class="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
      >
        <div class="flex md:flex-row gap-4">
          <img
            loading="lazy"
            v-if="latestSeason.poster_path"
            :src="`https://image.tmdb.org/t/p/w1280${latestSeason.poster_path}`"
            alt="Season Poster"
            class="w-40 h-56 rounded-xl object-cover"
          />
          <div class="self-end">
            <h3 class="text-xl font-[Gilroy-SemiBold] mb-1">
              {{ latestSeason.name }}
            </h3>
            <p class="text-gray-400 font-[Gilroy-Medium] mb-2">
              {{ latestSeason.episode_count }} Episodes
            </p>
            <p class="text-gray-300 font-[Gilroy-Medium] line-clamp-3">
              {{ latestSeason.overview }}
            </p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <RouterLink
          :to="`/tv/${slugify(media.title)}-${media.id}`"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition"
        >
          View More Seasons →
        </RouterLink>
      </div>
    </div>

    <TvDetails v-if="false" :tv="{ ...media, seasons: [latestSeason] }" />

    <div>
      <div
        v-if="cast.length"
        class="space-y-3 transition-all duration-500 animate-fade-up px-8 py-3"
      >
        <h2 class="text-xl font-[Gilroy-Bold]">Cast</h2>
        <div
          class="flex gap-4 overflow-x-auto pb-3 transition-all duration-900 animate-fade-up"
        >
          <div
            v-for="actor in cast"
            :key="actor.id"
            class="flex-shrink-0 w-28 text-center py-3"
          >
            <img
              v-if="actor.profile_path"
              :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
              loading="lazy"
              class="rounded-xl mb-1 hover:scale-105 transition-all duration-300"
            />
            <p class="text-sm font-[Gilroy-SemiBold] line-clamp-1">
              {{ actor.name }}
            </p>
            <p class="text-xs text-gray-400 font-[Gilroy-Medium] line-clamp-1">
              {{ actor.character }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-if="loading" class="flex space-x-4 overflow-x-auto py-4">
        <div
          v-for="n in 5"
          :key="n"
          class="w-48 h-80 bg-amber-900 rounded-md animate-pulse"
        ></div>
      </div>

      <div v-else>
        <div v-if="similar.length" class="space-y-3 px-8">
          <h2 class="text-xl font-[Gilroy-Bold]">Similar Titles</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <router-link
              v-for="sim in similar"
              :key="sim.id"
              :to="simRoute(sim)"
              class="group"
            >
              <img
                :src="`https://image.tmdb.org/t/p/w500${sim.poster_path}`"
                class="rounded-xl group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div
    v-else
    class="h-[80vh] flex items-center gap-3 justify-center text-gray-400"
  >
    <i class="pi pi-spin pi-spinner"></i>Loading details...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getMediaDetails } from "../../api/tmdb";
import { genreMap } from "../../types/genres";
import { useModalStore } from "../../stores/modalStore";
import TvDetails from "./TvDetails.vue";

const media = ref<any | null>(null);
const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const error = ref<string | null>(null);
const latestSeason = ref<any | null>(null);

const loading = ref(false);
const inWatchlist = ref(false);

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();

const isTv = computed(
  () => route.params.type === "tv" || media.value?.media_type === "tv"
);

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function slugToId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const raw = Array.isArray(param) ? param[0] : param;
  const str = String(raw);
  // match trailing -<digits>
  const m = str.match(/-(\d+)$/);
  if (m) return Number(m[1]);
  // if entire param is numeric
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

const fetchDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const rawParam = route.params.name;
    const idNum = slugToId(rawParam);
    if (!idNum) {
      error.value = "Invalid media identifier.";
      loading.value = false;
      return;
    }

    const isTvPath = route.path.includes("/tv/");
    const mediaType = isTvPath ? "tv" : "movie";

    const [detailsRes, creditsRes, similarRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}/credits`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${idNum}/similar`, {
        params: { api_key: API_KEY, language: "en-US" },
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

    // ✅ Get latest season if TV show
    if (mediaType === "tv" && detailsRes.data.seasons?.length) {
      const seasons = detailsRes.data.seasons;
      latestSeason.value = seasons[seasons.length - 1];
    }
  } catch (err: any) {
    console.error("❌ Error fetching details:", err);
    error.value = "Couldn’t load details. Please refresh.";
  } finally {
    loading.value = false;
  }
};

function getGenreIdsFromMedia(media: any): number[] {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres))
    return media.genres.map((g: { id: number }) => g.id);
  return [];
}

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return ["Unknown"];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

onMounted(fetchDetails);

// watch route.params.name instead of id
watch(
  () => route.params.name,
  (newName) => {
    if (newName) fetchDetails();
  }
);

watch(
  () => modalStore.itemId,
  async (id) => {
    if (!id) {
      media.value = null;
      return;
    }

    try {
      const type = (modalStore.mediaType ?? "movie") as "movie" | "tv";
      media.value = await getMediaDetails(id, type);
    } catch (error) {
      console.error("Failed to fetch media details:", error);
      media.value = null;
    }
  }
);

function goToWatch() {
  const id = route.params.name as string; // updated to name
  router.push(`#`);
}

function toggleWatchlist() {
  inWatchlist.value = !inWatchlist.value;
}

function simRoute(sim: any) {
  return sim.media_type === "tv" ? `/ng/tv/${sim.id}` : `/ng/movie/${sim.id}`;
}
</script>
