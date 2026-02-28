<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  currentFilmId: number;
  loading?: boolean;
}>();

const similarFilms = ref<
  { film_id: number; title: string; poster_path: string }[]
>([]);

// Mock data generator for demo
const mockSimilar = [
  { film_id: 1, title: "Blade Runner 2049", poster_path: "" },
  { film_id: 2, title: "Dune", poster_path: "" },
  { film_id: 3, title: "The Revenant", poster_path: "" },
  { film_id: 4, title: "Arrival", poster_path: "" },
  { film_id: 5, title: "Interstellar", poster_path: "" },
  { film_id: 6, title: "Sicario", poster_path: "" },
  { film_id: 7, title: "Tron: Legacy", poster_path: "" },
  { film_id: 8, title: "Ex Machina", poster_path: "" },
];
similarFilms.value = mockSimilar;
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between px-4">
      <div class="space-y-1">
        <h3 class="text-xl font-bold text-white">Aesthetic Similarity</h3>
        <p class="text-xs text-stone-500 font-medium">
          Films that share a similar visual language and palette
        </p>
      </div>
      <button class="p-2 hover:bg-white/5 rounded-full transition-colors">
        <span class="text-lg">✨</span>
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
      <div
        v-for="i in 8"
        :key="i"
        class="aspect-2/3 bg-stone-800 rounded-xl animate-pulse"
      ></div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
      <div
        v-for="film in similarFilms"
        :key="film.film_id"
        class="group relative aspect-2/3 bg-stone-900 rounded-xl overflow-hidden hover:ring-2 ring-indigo-500/50 transition-all"
      >
        <!-- In a real app, use TMDB images -->
        <div
          class="absolute inset-0 flex items-center justify-center text-[10px] text-stone-700 font-bold text-center px-4 italic"
        >
          {{ film.title }}
        </div>

        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-stone-950/40 group-hover:bg-transparent transition-colors"
        ></div>

        <div
          class="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-black/60 backdrop-blur-md"
        >
          <p class="text-[10px] font-bold text-white truncate">
            {{ film.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
