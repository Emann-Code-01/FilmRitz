<!-- src/components/media/MovieCard.vue -->
<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore";

const props = defineProps<{
  movie: {
    id: number;
    title: string;
    poster_path: string;
    media_type?: "movie" | "tv";
  };
}>();

const modalStore = useModalStore();

function openModal() {
  // support both modal API styles (safe-guard)
  if (typeof modalStore.open === "function") {
    modalStore.open("movie", {
      movieId: props.movie.id,
      mediaType: props.movie.media_type ?? "movie",
    });
  } else if (typeof (modalStore as any).openMovieModal === "function") {
    (modalStore as any).openMovieModal(props.movie.id);
  }
}
</script>

<template>
  <div
    class="cursor-pointer hover:scale-105 transition-transform"
    @click="openModal"
  >
    <img
      :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
      :alt="movie.title"
      class="rounded-lg shadow-lg"
    />
    <h3 class="mt-2 text-white text-sm font-medium">{{ movie.title }}</h3>
  </div>
</template>
