<template>
  <div class="min-h-screen bg-black text-white py-10 px-6 md:px-10 mt-10">
    <h1 class="text-2xl font-[Gilroy-SemiBold] mb-6">
      Search results for "<span class="text-red-500 font-[Gilroy-Bold]">{{
        query
      }}</span
      >"
    </h1>

    <div
      v-if="loading"
      class="text-gray-400 text-center mt-10 font-[Gilroy-Bold]"
    >
      Loading results...
    </div>

    <div
      v-else-if="searchResults.length === 0"
      class="text-gray-500 text-center mt-10 font-[Gilroy-Bold]"
    >
      No results found.
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <div
        v-for="movie in searchResults"
        :key="movie.id"
        class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40"
        @click="openMovieModal(movie)"
      >
        <img
          :src="getPoster(movie.poster_path)"
          alt=""
          class="w-full h-64 object-cover group-hover:scale-105 transition-all duration-300"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-70 group-hover:opacity-100 transition-all"
        ></div>
        <div class="absolute bottom-3 left-3">
          <h3 class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">
            {{ movie.title }}
          </h3>
          <p class="text-gray-400 text-sm">
            ⭐ {{ movie.vote_average?.toFixed(1) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMovies } from "../composables/useMovie";
import { useModalStore } from "../stores/modalStore";

const route = useRoute();
const modalStore = useModalStore();
const { searchMovies, searchResults, loading } = useMovies();

const query = ref((route.query.q as string) || "");

onMounted(async () => {
  if (query.value.trim()) {
    await searchMovies(query.value);
  }
});

function openMovieModal(movie: any) {
  modalStore.open("movie", { movieId: movie.id });
}

const getPoster = (path: string) =>
  path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://via.placeholder.com/300x450?text=No+Image";
</script>
