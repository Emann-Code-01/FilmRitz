<template>
  <div class="film-intelligence-panel">
    <h2 class="text-2xl font-bold text-white mb-6">Film Intelligence</h2>

    <!-- Film Input -->
    <div class="mb-8">
      <label class="block text-gray-300 mb-2">Select a film:</label>
      <div class="flex gap-4">
        <select
          v-model="selectedFilmId"
          class="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
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
          @click="analyzeFilm"
          :disabled="!selectedFilmId"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Analyze
        </button>
      </div>
    </div>

    <!-- Director Profile -->
    <div v-if="filmData" class="mb-8">
      <h3 class="text-xl font-semibold text-white mb-4">Director Style Profile</h3>
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Themes -->
          <div>
            <h4 class="text-white font-semibold mb-3">Recurring Themes</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="theme in filmData.themes"
                :key="theme"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
              >
                {{ theme }}
              </span>
            </div>
          </div>

          <!-- Visual Motifs -->
          <div>
            <h4 class="text-white font-semibold mb-3">Visual Motifs</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="motif in filmData.visual_motifs"
                :key="motif"
                class="px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
              >
                {{ motif }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thematic Connections -->
    <div v-if="filmData" class="mb-8">
      <h3 class="text-xl font-semibold text-white mb-4">Thematic Connections</h3>
      <div class="bg-gray-800 rounded-lg p-6">
        <p class="text-gray-300 mb-4">Films connected by similar ideas and themes:</p>
        <div class="space-y-2">
          <div
            v-for="connection in filmData.thematic_connections"
            :key="connection.film_id"
            class="flex justify-between items-center py-2 px-3 bg-gray-700 rounded"
          >
            <span class="text-white">Film {{ connection.film_id }}</span>
            <span class="text-blue-400">{{ (connection.similarity * 100).toFixed(0) }}% similar</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Cultural Impact -->
    <div v-if="filmData" class="mb-8">
      <h3 class="text-xl font-semibold text-white mb-4">Cultural Impact</h3>
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Awards -->
          <div>
            <h4 class="text-white font-semibold mb-3">Awards & Recognition</h4>
            <div class="space-y-2">
              <div
                v-for="award in filmData.awards"
                :key="award"
                class="text-sm text-gray-300 py-1"
              >
                🏆 {{ award }}
              </div>
            </div>
          </div>

          <!-- Impact Timeline -->
          <div>
            <h4 class="text-white font-semibold mb-3">Reception & Longevity</h4>
            <div class="space-y-2">
              <div class="text-sm text-gray-300">
                <span class="text-gray-400">Initial Reception:</span>
                <span class="text-green-400 ml-2">{{ filmData.reception }}</span>
              </div>
              <div class="text-sm text-gray-300">
                <span class="text-gray-400">Cultural Longevity:</span>
                <span class="text-blue-400 ml-2">{{ filmData.longevity_score }}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expandable Sections -->
    <div v-if="filmData" class="space-y-4">
      <details class="bg-gray-800 rounded-lg">
        <summary class="px-4 py-3 cursor-pointer text-white font-semibold hover:bg-gray-750 transition-colors">
          Timeline Visualization
        </summary>
        <div class="px-4 py-3 text-gray-300">
          Timeline data would be visualized here showing the film's evolution and cultural moments
        </div>
      </details>

      <details class="bg-gray-800 rounded-lg">
        <summary class="px-4 py-3 cursor-pointer text-white font-semibold hover:bg-gray-750 transition-colors">
          Thematic Navigation
        </summary>
        <div class="px-4 py-3 text-gray-300">
          Navigate between thematically similar films across different genres and eras
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { FilmAttributes } from '@/types/intelligence'

const selectedFilmId = ref<number | null>(null)
const availableFilms = ref<FilmAttributes[]>([])
const filmData = ref<any>(null)

onMounted(async () => {
  const { data } = await supabase
    .from('film_attributes')
    .select('*')
    .limit(50)

  availableFilms.value = data || []
})

const analyzeFilm = () => {
  if (!selectedFilmId.value) return

  // Mock film intelligence data
  filmData.value = {
    themes: ['redemption', 'sacrifice', 'identity'],
    visual_motifs: ['rain', 'shadows', 'mirrors'],
    thematic_connections: [
      { film_id: 456, similarity: 0.92 },
      { film_id: 789, similarity: 0.85 },
      { film_id: 234, similarity: 0.78 }
    ],
    awards: [
      'Academy Award: Best Picture',
      'BAFTA: Best Film',
      'Golden Globe: Best Drama'
    ],
    reception: 'Critical Acclaim',
    longevity_score: 9
  }
}
</script>