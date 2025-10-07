<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore"

const props = defineProps<{
  movie: {
    id: number
    title: string
    poster_path: string
  }
}>()

const modalStore = useModalStore()
</script>

<template>
  <div class="cursor-pointer hover:scale-105 transition-transform" @click="modalStore.openMovieModal(movie.id)">
    <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" class="rounded-lg shadow-lg" />
    <h3 class="mt-2 text-white text-sm font-medium">{{ movie.title }}</h3>
  </div>
</template>
