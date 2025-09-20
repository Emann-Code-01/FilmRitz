<script setup>
import { ref, onMounted } from "vue";
import { fetchPopularMovies } from "./api.js";

const movies = ref([]);

onMounted(async () => {
  movies.value = await fetchPopularMovies();
});
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
    <div v-for="movie in movies" :key="movie.id" class="bg-gray-900 rounded-lg overflow-hidden">
      <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" class="w-full h-auto" />
      <div class="p-2 text-white">
        <h2 class="font-semibold">{{ movie.title }}</h2>
        <p class="text-sm text-gray-400">⭐ {{ movie.vote_average }}</p>
      </div>
    </div>
  </div>
</template>