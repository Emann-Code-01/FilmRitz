<template>
  <section v-if="movie" class="space-y-8">
    <div class="relative h-[60vh] overflow-hidden" :style="{
      backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div class="absolute bottom-8 left-8 max-w-2xl space-y-3 transition-all duration-500 animate-fade-up">
        <h1 class="text-4xl font-bold">{{ movie.title }}</h1>
        <p class="text-gray-300 text-sm line-clamp-3">{{ movie.overview }}</p>

        <div class="flex gap-3 mt-4 transition-all duration-500 animate-fade-up">
          <button @click="goToWatch"
            class="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-semibold flex items-center gap-2">
            ▶ Watch
          </button>
          <button @click="toggleWatchlist"
            class="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 flex items-center gap-2">
            <span v-if="inWatchlist">✓ Added</span>
            <span v-else>＋ My List</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 🎭 Cast Carousel -->
    <div v-if="cast.length" class="space-y-3 transition-all duration-500 animate-fade-up px-8">
      <h2 class="text-xl font-semibold">Cast</h2>
      <div class="flex gap-4 overflow-x-auto pb-3 transition-all duration-900 animate-fade-up">
        <div v-for="actor in cast" :key="actor.id" class="flex-shrink-0 w-28 text-center">
          <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`" loading="lazy"
            class="rounded-xl mb-1" />
          <p class="text-sm font-medium line-clamp-1">{{ actor.name }}</p>
          <p class="text-xs text-gray-400 line-clamp-1">{{ actor.character }}</p>
        </div>
      </div>
    </div>

    <!-- 🎞 Similar Titles -->
    <div v-if="similar.length" class="space-y-3 px-8">
      <h2 class="text-xl font-semibold">Similar Titles</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <router-link v-for="sim in similar" :key="sim.id" :to="`/movie/${movie.id}`" class="group">
          <img :src="`https://image.tmdb.org/t/p/w500${sim.poster_path}`"
            class="rounded-xl group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            loading="lazy" />
          <p class="mt-1 text-sm line-clamp-1">{{ sim.title }}</p>
        </router-link>
      </div>
    </div>
  </section>

  <!-- 🌀 Loading State -->
  <div v-else class="h-[80vh] flex items-center gap-3 justify-center text-gray-400">
    <i class="pi pi-spin pi-spinner"></i>Loading movie details...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useModalStore } from "../stores/modalStore"

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}


const modalStore = useModalStore()

const movie = ref<Movie | null>(null);
const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const route = useRoute();
const router = useRouter();
const inWatchlist = ref(false);


const movieId = route.params.id as string;


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchMovieDetails = async () => {
  try {
    const movieId = route.params.id as string | undefined;
    console.log("🎬 Movie ID from route:", movieId);
    if (!movieId || movieId === ":id") {
      console.error("❌ Invalid or missing movie ID in route:", movieId);
      return;
    }

    const [movieRes, creditsRes, similarRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar`, {
        params: { api_key: API_KEY, language: "en-US" },
      }),
    ]);

    movie.value = movieRes.data;
    cast.value = creditsRes.data.cast;
    similar.value = similarRes.data.results;
  } catch (error) {
    console.error("❌ Error fetching movie details:", error);
  }
};

onMounted(fetchMovieDetails);

watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId !== ":id") fetchMovieDetails();
  }
);

function goToWatch() {
  router.push(`/watch/${movieId}`);
}

function toggleWatchlist() {
  inWatchlist.value = !inWatchlist.value;
  // 🔜 Later: connect this with Supabase user favorites
}
</script>
