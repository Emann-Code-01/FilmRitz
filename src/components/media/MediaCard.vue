<!-- src/components/media/MovieCard.vue -->
<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore";

const props = defineProps<{
  media: {
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
    modalStore.open(props.media.media_type ?? "movie", {
      movieId: props.media.id,
      mediaType: props.media.media_type ?? "movie",
    });
  } else if (typeof (modalStore as any).openMovieModal === "function") {
    (modalStore as any).openMovieModal(props.media.id);
  }
}
</script>

<template>
  <div
    class="cursor-pointer hover:scale-105 transition-transform"
    @click="openModal"
  >
    <img
      :src="`https://image.tmdb.org/t/p/w500${media.poster_path}`"
      :alt="media.title"
      class="rounded-lg shadow-lg"
    />
    <h3 class="mt-2 text-white text-sm font-medium">{{ media.title }}</h3>
  </div>
</template>
