<script setup lang="ts">
import { ScoredFilm } from "@/types/film.types";

defineProps<{
  results: ScoredFilm[];
  appliedWeights: Record<string, number>;
  loading?: boolean;
}>();

const formatWeight = (val: number) => Math.round(val * 100) + "%";
</script>

<template>
  <div class="space-y-8 min-h-[400px]">
    <!-- Result Header & Weights -->
    <div
      v-if="results.length > 0"
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-white">Top Recommendations</h2>
        <p class="text-stone-400 text-sm">
          Based on your current intent and taste profile
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="(val, key) in appliedWeights"
          :key="key"
          class="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2"
        >
          <span class="text-[10px] uppercase font-bold text-stone-500">{{
            key.replace(/([A-Z])/g, " $1")
          }}</span>
          <span class="text-xs font-mono text-indigo-400">{{
            formatWeight(val)
          }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="i in 8"
        :key="i"
        class="aspect-2/3 bg-stone-800/50 rounded-2xl animate-pulse"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="results.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center space-y-4"
    >
      <div class="text-6xl text-stone-700">🔍</div>
      <div class="space-y-1">
        <h3 class="text-lg font-medium text-white">No matches found</h3>
        <p class="text-stone-500 max-w-xs mx-auto">
          Try adjusting your time or mood to find more results.
        </p>
      </div>
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="film in results"
        :key="film.film_id"
        class="group relative bg-stone-900 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        <!-- Match Score Badge -->
        <div class="absolute top-4 right-4 z-10">
          <div
            class="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg flex flex-col items-center"
          >
            <span class="text-[10px] text-stone-400 font-bold uppercase"
              >Match</span
            >
            <span class="text-lg font-black text-white leading-none"
              >{{ film.score }}%</span
            >
          </div>
        </div>

        <!-- Poster Placeholder (until real images integrated) -->
        <div
          class="aspect-2/3 bg-stone-800 relative group-hover:scale-105 transition-transform duration-500"
        >
          <!-- Note: In a real app, this would be an Img component with TMDB URL -->
          <div
            class="absolute inset-0 flex items-center justify-center text-stone-700 font-bold italic"
          >
            Poster #{{ film.film_id }}
          </div>

          <!-- Overlay Gradient -->
          <div
            class="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent opacity-80"
          ></div>
        </div>

        <!-- Film Info -->
        <div class="p-4 space-y-3 relative">
          <div class="space-y-2">
            <h4
              class="font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors"
            >
              Film Title
            </h4>

            <!-- Progress Bar -->
            <div class="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-linear-to-r from-indigo-600 to-indigo-400 transition-all duration-1000"
                :style="{ width: film.score + '%' }"
              ></div>
            </div>
          </div>

          <!-- Explanations -->
          <div class="space-y-1.5 min-h-[60px]">
            <div
              v-for="(expl, idx) in film.explanations"
              :key="idx"
              class="flex items-start gap-2 text-[11px] text-stone-400 leading-tight"
            >
              <span
                class="mt-1 w-1 h-1 rounded-full bg-indigo-500 shrink-0"
              ></span>
              {{ expl }}
            </div>
          </div>
        </div>

        <!-- Quick Action Overlay -->
        <div
          class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-stone-950/90 backdrop-blur-sm border-t border-white/10"
        >
          <button
            class="w-full py-2 bg-indigo-500 text-white text-xs font-bold rounded-lg hover:bg-indigo-400 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
