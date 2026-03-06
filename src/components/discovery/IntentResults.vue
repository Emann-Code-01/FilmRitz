<script setup lang="ts">
import { ScoredFilm } from "@/types/film.types";

const emit = defineEmits<{
  (e: "select", film: ScoredFilm): void;
}>();

defineProps<{
  results: ScoredFilm[];
  appliedWeights: Record<string, number>;
  loading?: boolean;
}>();

const formatWeight = (val: number) => Math.round(val * 100) + "%";
const getPosterUrl = (path?: string) =>
  path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : "https://filmritz.vercel.app/filmritzlogo2.png";
</script>

<template>
  <div class="space-y-10 min-h-[400px] animate-in fade-in duration-700">
    <!-- Result Header & Weights -->
    <div
      v-if="results.length > 0"
      class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8"
    >
      <div class="space-y-2">
        <h2 class="text-3xl font-[Gilroy-Bold] text-white">
          Top Recommendations
        </h2>
        <p class="text-stone-500 font-[Gilroy-Medium] text-sm">
          Aesthetic engine matches based on your current intent trajectory.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="(val, key) in appliedWeights"
          :key="key"
          class="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 transition-all hover:bg-white/10"
        >
          <span
            class="text-[9px] uppercase font-black text-stone-500 tracking-widest"
            >{{ key.replace(/([A-Z])/g, " $1") }}</span
          >
          <span class="text-sm font-[Gilroy-Bold] text-indigo-400">{{
            formatWeight(val)
          }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="aspect-2/3 bg-stone-900/50 rounded-[2.5rem] animate-pulse border border-white/5"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="results.length === 0"
      class="flex flex-col items-center justify-center py-24 text-center space-y-6"
    >
      <div class="text-7xl opacity-20 filter grayscale">📽️</div>
      <div class="space-y-2">
        <h3 class="text-2xl font-[Gilroy-Bold] text-white">
          Scanning for matches...
        </h3>
        <p
          class="text-stone-500 font-[Gilroy-Medium] max-w-sm mx-auto leading-relaxed"
        >
          Modify your intent parameters to help our intelligence engine
          triangulate the perfect match.
        </p>
      </div>
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div
        v-for="(film, index) in results"
        :key="film.film_id"
        @click="emit('select', film)"
        class="group relative bg-stone-900 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] cursor-pointer hover:-translate-y-2"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <!-- Match Score Badge -->
        <div class="absolute top-5 right-5 z-20">
          <div
            class="px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col items-center shadow-2xl"
          >
            <span
              class="text-[8px] text-stone-400 font-black uppercase tracking-tighter"
              >Match</span
            >
            <span class="text-base font-[Gilroy-Bold] text-white leading-none"
              >{{ film.score }}%</span
            >
          </div>
        </div>

        <!-- Poster Section -->
        <div class="aspect-2/3 relative overflow-hidden">
          <img
            :src="getPosterUrl(film.poster_path)"
            :alt="film.title || 'Film Poster'"
            class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
          />

          <!-- Overlay Gradient -->
          <div
            class="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"
          ></div>

          <!-- Intent explanation bar (hover) -->
          <div
            class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-linear-to-t from-black to-transparent"
          >
            <div class="space-y-2">
              <div
                v-for="(expl, idx) in (film.explanations || []).slice(0, 2)"
                :key="idx"
                class="flex items-center gap-2"
              >
                <div class="w-1 h-1 rounded-full bg-indigo-500"></div>
                <span class="text-[10px] text-stone-300 font-[Gilroy-Medium]">{{
                  expl
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Film Info -->
        <div class="p-6 pt-5 space-y-4">
          <div class="space-y-1">
            <h4
              class="text-lg font-[Gilroy-Bold] text-white truncate group-hover:text-indigo-400 transition-colors"
            >
              {{ film.title || "Unknown Title" }}
            </h4>
            <div class="flex items-center gap-2">
              <span
                class="text-[10px] text-stone-500 uppercase font-[Gilroy-Bold] tracking-widest"
              >
                {{ film.media_type === "tv" ? "Series" : "Feature" }}
              </span>
              <span class="w-1 h-1 rounded-full bg-stone-700"></span>
              <span class="text-[10px] text-indigo-400 font-mono">
                ID: {{ film.film_id }}
              </span>
            </div>
          </div>

          <!-- Score Bar -->
          <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              class="h-full bg-linear-to-r from-indigo-600 via-indigo-400 to-emerald-400 transition-all duration-[2000ms] delay-500"
              :style="{ width: film.score + '%' }"
            ></div>
          </div>
        </div>

        <!-- Hover Shimmer -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style="
            background: radial-gradient(
              circle at 50% 0%,
              rgba(99, 102, 241, 0.05),
              transparent 70%
            );
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .h-full {
  width: var(--final-width);
}
</style>
