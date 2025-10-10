<template>
  <section v-if="movie" class="space-y-8">
    <!-- 🎬 Hero Banner -->
    <div class="relative h-[60vh] rounded-2xl overflow-hidden" :style="{
      backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div class="absolute bottom-8 left-8 max-w-2xl space-y-3">
        <h1 class="text-4xl font-bold">{{ movie.title }}</h1>
        <p class="text-gray-300 text-sm line-clamp-3">{{ movie.overview }}</p>

        <div class="flex gap-3 mt-4">
          <button ref="initialFocus" @click="goToWatch"
            class="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-semibold flex items-center gap-2">
            ▶ Watch
          </button>
          <button ref="initialFocus" @click="toggleWatchlist"
            class="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 flex items-center gap-2">
            <span v-if="inWatchlist">✓ Added</span>
            <span v-else>＋ My List</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 🎭 Cast Carousel -->
    <div v-if="cast.length" class="space-y-3">
      <h2 class="text-xl font-semibold">Cast</h2>
      <div class="flex gap-4 overflow-x-auto pb-3">
        <div v-for="actor in cast" :key="actor.id" class="flex-shrink-0 w-28 text-center">
          <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
            class="rounded-xl mb-1" />
          <p class="text-sm font-medium line-clamp-1">{{ actor.name }}</p>
          <p class="text-xs text-gray-400 line-clamp-1">{{ actor.character }}</p>
        </div>
      </div>
    </div>

    <!-- 🎥 Similar Movies -->
    <div v-if="similar.length" class="space-y-3">
      <h2 class="text-xl font-semibold">Similar Titles</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <router-link v-for="sim in similar" :key="sim.id" :to="`/movie/${sim.id}`" class="group">
          <img :src="`https://image.tmdb.org/t/p/w500${sim.poster_path}`"
            class="rounded-xl group-hover:opacity-80 transition" />
          <p class="mt-1 text-sm line-clamp-1">{{ sim.title }}</p>
        </router-link>
      </div>
    </div>
  </section>

  <!-- 🌀 Loading State -->
  <div v-else class="h-[80vh] flex items-center justify-center text-gray-400">
    Loading movie details...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const movieId = route.params.id as string;

const movie = ref<any>(null);
const cast = ref<any[]>([]);
const similar = ref<any[]>([]);
const inWatchlist = ref(false);

// TMDB v4 API setup
const API_URL = "https://api.themoviedb.org/4";
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

onMounted(async () => {
  try {
    const [movieRes, creditsRes, similarRes] = await Promise.all([
      api.get(`/movie/${movieId}`),
      axios.get(`https://api.themoviedb.org/4/movie/${movieId}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
      axios.get(`https://api.themoviedb.org/4/movie/${movieId}/similar?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
    ]);

    movie.value = movieRes.data;
    cast.value = creditsRes.data.cast.slice(0, 10);
    similar.value = similarRes.data.results.slice(0, 10);
  } catch (err) {
    console.error("Error fetching movie details:", err);
  }
});

function goToWatch() {
  router.push(`/watch/${movieId}`);
}

function toggleWatchlist() {
  inWatchlist.value = !inWatchlist.value;
  // 🔜 Later: connect this with Supabase user favorites
}
</script>
