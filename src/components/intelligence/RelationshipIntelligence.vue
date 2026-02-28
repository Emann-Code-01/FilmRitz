<template>
  <div class="relationship-intelligence">
    <h2 class="text-2xl font-bold text-white mb-6">Relationship Intelligence</h2>

    <!-- Collaborators Section -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-white mb-4">Find Collaborators</h3>
      <div class="flex gap-4 mb-6">
        <input
          v-model.number="selectedPersonId"
          type="number"
          placeholder="Enter TMDB person ID"
          class="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          @click="searchCollaborators"
          :disabled="!selectedPersonId || isLoading"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLoading ? 'Searching...' : 'Search' }}
        </button>
      </div>

      <!-- Collaborators Grid -->
      <div v-if="hasRelationships()" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="collaboration in relationships"
          :key="`${collaboration.person_a.id}-${collaboration.person_b.id}`"
          class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
        >
          <div class="mb-3">
            <h4 class="text-white font-semibold mb-2">Collaboration</h4>
            <p class="text-sm text-gray-300">
              {{ collaboration.person_a.name }} ↔ {{ collaboration.person_b.name }}
            </p>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-sm">
              <span class="text-gray-400">Weight:</span>
              <span class="text-blue-400 ml-2">{{ collaboration.weight.toFixed(2) }}</span>
            </div>
            <button
              @click="viewCollaborationFilms(collaboration.person_a.id, collaboration.person_b.id)"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Films
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="!isLoading && selectedPersonId" class="text-center py-8">
        <p class="text-gray-400">No collaborators found</p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-center py-4">
      <p class="text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRelationshipIntelligence } from '@/composables/useRelationshipIntelligence'

const selectedPersonId = ref<number | null>(null)
const { relationships, isLoading, error, findCollaborators } = useRelationshipIntelligence()

const searchCollaborators = async () => {
  if (!selectedPersonId.value) return

  try {
    await findCollaborators(selectedPersonId.value)
  } catch (err) {
    console.error('Search failed:', err)
  }
}

const viewCollaborationFilms = (personAId: number, personBId: number) => {
  console.log(`View films with ${personAId} and ${personBId}`)
  // TODO: Implement film viewing
}

const hasRelationships = () => relationships.value.length > 0
</script>