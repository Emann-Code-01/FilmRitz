<!-- src/views/MediaDetails.vue -->
<template>
  <section v-if="media" class="space-y-8">
    <div
      class="relative h-[60vh] overflow-hidden"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
      ></div>

      <div
        class="absolute bottom-8 left-8 max-w-5xl space-y-3 transition-all duration-500 animate-fade-up"
      >
        <h1 class="text-4xl font-[Gilroy-Bold]">{{ media.title }}</h1>
        <p class="text-lg text-gray-300 font-[Gilroy-Medium]">
          {{ media.overview }}
        </p>

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
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getMediaDetails } from "../../api/tmdb";
import { useModalStore } from "../../stores/modalStore";

const media = ref<any | null>(null);
const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const error = ref<string | null>(null);

const loading = ref(false);
const inWatchlist = ref(false);

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const id = route.params.id as string;
    if (!id || id === ":id") return;

    // detect media type from route (e.g., /ng/tv/:id or /ng/movie/:id)
    const isTv = route.path.includes("/tv/");
    const mediaType = isTv ? "tv" : "movie";

    const [detailsRes, creditsRes, similarRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/credits`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/similar`, {
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
  } catch (err: any) {
    console.error("❌ Error fetching details:", err);
    error.value = "Couldn’t load details. Please refresh.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetails);

watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId !== ":id") fetchDetails();
  }
);

watch(
  () => modalStore.itemId, // or modalStore.movieId depending on your store
  async (id) => {
    if (!id) {
      media.value = null;
      return;
    }

    try {
      // ✅ Safe cast here
      const type = (modalStore.mediaType ?? "movie") as "movie" | "tv";
      media.value = await getMediaDetails(id, type);
    } catch (error) {
      console.error("Failed to fetch media details:", error);
      media.value = null;
    }
  }
);

function goToWatch() {
  const id = route.params.id as string;
  router.push(`/watch/${id}`);
}

function toggleWatchlist() {
  inWatchlist.value = !inWatchlist.value;
}

function simRoute(sim: any) {
  return sim.media_type === "tv" ? `/ng/tv/${sim.id}` : `/ng/movie/${sim.id}`;
}
</script>
