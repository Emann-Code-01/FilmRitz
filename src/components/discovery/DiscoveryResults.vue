<template>
  <div class="discovery-results">
    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="bg-gray-800 rounded-xl p-4 animate-pulse h-64"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="text-center py-12 bg-red-900/10 rounded-xl border border-red-900/50"
    >
      <p class="text-red-400 mb-4">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="hasResults" class="space-y-8">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-white mb-2">Top Picks for You</h2>
        <p class="text-gray-400">Based on your mood, time, and preferences.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="result in enrichedResults"
          :key="result.film_id"
          class="group bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
        >
          <!-- Media Card Wrapper -->
          <div class="relative aspect-2/3 overflow-hidden">
            <MediaCard
              v-if="result.media"
              :media="result.media"
              class="w-full h-full"
            />
            <div v-else class="w-full h-full bg-gray-800 animate-pulse"></div>

            <!-- Match Badge -->
            <div
              class="absolute top-2 right-2 bg-black/80 backdrop-blur border border-white/10 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg"
            >
              {{ (result.score * 100).toFixed(0) }}% Match
            </div>
          </div>

          <!-- Why this film? -->
          <div
            class="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-white/5"
          >
            <div
              class="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2"
            >
              Why it fits
            </div>
            <div class="space-y-2">
              <div
                v-if="result.reasons.runtime_fit > 0.8"
                class="flex items-center gap-2 text-xs text-green-400"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Perfect runtime
              </div>
              <div
                v-if="result.reasons.mood_overlap > 0.6"
                class="flex items-center gap-2 text-xs text-purple-400"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Matches your mood
              </div>
              <div
                v-if="result.reasons.complexity_distance > 0.8"
                class="flex items-center gap-2 text-xs text-blue-400"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Right complexity
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="results && results.total_count > enrichedResults.length"
        class="text-center pt-8"
      >
        <button
          @click="$emit('load-more')"
          class="px-8 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all font-medium border border-gray-700"
        >
          Load More
        </button>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <div class="text-6xl mb-4">🎬</div>
      <h3 class="text-xl font-medium text-white mb-2">Ready to Discover?</h3>
      <p class="text-gray-400">Select your preferences above to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ContextScoringResult, FilmScore } from "@/types/intelligence";
import type { Media } from "@/types/media";
import { movieService } from "@/services/mediaService";
import MediaCard from "@/components/media/MediaCard.vue";

interface Props {
  isLoading: boolean;
  error: string | null;
  results: ContextScoringResult | null;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "retry"): void;
  (e: "load-more"): void;
}>();

interface EnrichedFilmScore extends FilmScore {
  media?: Media;
}

const enrichedResults = ref<EnrichedFilmScore[]>([]);

const hasResults = computed(() => (props.results?.films.length || 0) > 0);

watch(
  () => props.results,
  async (newResults) => {
    if (!newResults?.films) {
      enrichedResults.value = [];
      return;
    }

    // Initialize with existing data or placeholders
    enrichedResults.value = newResults.films.map((film) => ({
      ...film,
      // Keep existing media if we already fetched it (optimization for load-more)
      media: enrichedResults.value.find((e) => e.film_id === film.film_id)
        ?.media,
    }));

    // Fetch missing media
    const fetchPromises = enrichedResults.value
      .filter((item) => !item.media)
      .map(async (item) => {
        try {
          const media = await movieService.getMediaById(item.film_id, "movie");
          if (media) {
            item.media = media as Media;
          }
        } catch (e) {
          console.error(`Failed to fetch media for film ${item.film_id}`, e);
        }
      });

    await Promise.all(fetchPromises);
  },
  { immediate: true, deep: true },
);
</script>
