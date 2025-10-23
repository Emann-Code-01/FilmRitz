<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 capitalize">
      {{ genreName }} Movies & Shows
    </h1>

    <div v-if="loading" class="text-gray-400 text-center mt-8">Loading...</div>

    <div
      v-else-if="media.length"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <MediaCard v-for="(item, index) in media" :key="index" :media="item" />
    </div>

    <div v-else class="text-gray-400 text-center mt-8">
      No results found for "{{ genreName }}".
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getMoviesByGenre, getShowsByGenre } from "../lib/discover";
import { genreNameToId } from "../types/genres";
import { Media } from "../types/media";
import MediaCard from "../components/media/MediaCard.vue";

const route = useRoute();

// ✅ Fix: safely extract genre name
const genreParam = route.params.name;
const genreName = Array.isArray(genreParam) ? genreParam[0] : genreParam;

// ✅ Still convert to ID using your helper
const genreId = genreNameToId[genreName.toLowerCase()] ?? null;

const media = ref<Media[]>([]);
const loading = ref(true);

onMounted(async () => {
  if (!genreId) return;
  const movies = await getMoviesByGenre(genreId);
  const shows = await getShowsByGenre(genreId);
  media.value = [...movies, ...shows];
  loading.value = false;
});
</script>
