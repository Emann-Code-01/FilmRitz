<template>
  <div class="visual-discovery">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white mb-2">Visual Discovery</h2>
      <p class="text-gray-400">Find films that feel visually similar</p>
    </div>

    <!-- Film Selection -->
    <div class="mb-6">
      <label class="block text-gray-300 mb-2"
        >Select a film to find similar ones:</label
      >
      <div class="flex gap-4">
        <select
          v-model="selectedFilmId"
          class="px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Choose a film...</option>
          <option
            v-for="film in availableFilms"
            :key="film.film_id"
            :value="film.film_id"
          >
            Film {{ film.film_id }}
          </option>
        </select>
        <button
          @click="findSimilar"
          :disabled="!selectedFilmId || isLoading"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLoading ? "Finding..." : "Find Similar" }}
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="hasResults" class="mb-6">
      <h3 class="text-xl font-semibold text-white mb-4">
        Films that feel similar:
      </h3>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="film in similarFilms"
          :key="film.film_id"
          class="bg-gray-800 rounded-lg p-4"
        >
          <div class="flex items-start gap-4">
            <!-- Color Palette -->
            <div class="shrink-0">
              <div
                class="w-16 h-16 rounded-lg overflow-hidden border border-gray-600"
              >
                <div class="flex h-full">
                  <div
                    v-for="color in (film.dominant_colors || []).slice(0, 4)"
                    :key="`${color.r}-${color.g}-${color.b}`"
                    class="flex-1"
                    :style="{
                      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    }"
                  />
                </div>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="text-white font-semibold">Film {{ film.film_id }}</h4>
              <div class="text-sm text-gray-400 mb-2">
                {{ Math.round((film.similarity_score || 0) * 100) }}% similar
              </div>

              <!-- Similarity Breakdown -->
              <div class="text-xs text-gray-500 space-y-1">
                <div>
                  🎨 Colors:
                  {{
                    Math.round((film.similarity_breakdown?.color || 0) * 100)
                  }}%
                </div>
                <div>
                  📷 Style:
                  {{
                    Math.round(
                      (film.similarity_breakdown?.cinematography || 0) * 100,
                    )
                  }}%
                </div>
                <div>
                  👁️ Visual:
                  {{
                    Math.round(
                      (film.similarity_breakdown?.visual_style || 0) * 100,
                    )
                  }}%
                </div>
              </div>

              <!-- Tags -->
              <div class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="tag in (film.cinematography_style || []).slice(0, 2)"
                  :key="tag"
                  class="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                >
                  {{ tag }}
                </span>
                <span
                  v-for="tag in film.visual_style_tags.slice(0, 2)"
                  :key="tag"
                  class="text-xs bg-purple-600 text-white px-2 py-1 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-center py-4">
      <p class="text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { useVisualSimilarity } from "@/composables/useVisualSimilarity";
import type { FilmAttributes } from "@/types/intelligence";

const selectedFilmId = ref<number | null>(null);
const availableFilms = ref<FilmAttributes[]>([]);

const { similarFilms, isLoading, error, hasResults, findSimilarFilms } =
  useVisualSimilarity();

onMounted(async () => {
  // Load films with visual data
  const { data } = await supabase
    .from("film_attributes")
    .select("*")
    .not("dominant_colors", "is", null)
    .limit(100);

  availableFilms.value = data || [];
});

const findSimilar = async () => {
  if (!selectedFilmId.value) return;

  try {
    await findSimilarFilms(selectedFilmId.value);
  } catch (err) {
    console.error("Visual similarity search failed:", err);
  }
};
</script>
