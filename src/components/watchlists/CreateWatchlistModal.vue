<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
      <h3 class="text-xl font-bold text-white mb-4">Create New Watchlist</h3>

      <form @submit.prevent="createWatchlist">
        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Weekend Binge List"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-300 mb-2">Description</label>
          <textarea
            v-model="form.description"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            rows="3"
            placeholder="Optional description..."
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-300 mb-2">Context (Optional)</label>
          <p class="text-sm text-gray-400 mb-2">Save the intent that inspired this watchlist</p>

          <IntentSelector
            v-model="form.context"
            :compact="true"
          />
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isCreating"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {{ isCreating ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import IntentSelector from '@/components/discovery/IntentSelector.vue'
import { useIntentWatchlists } from '@/composables/useIntentWatchlists'
import type { IntentInput } from '@/types/intelligence'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const { createWatchlist: createWatchlistApi } = useIntentWatchlists()
const isCreating = ref(false)

const form = reactive({
  name: '',
  description: '',
  context: {} as IntentInput
})

const createWatchlist = async () => {
  if (!form.name.trim()) return

  isCreating.value = true
  try {
    await createWatchlistApi(
      form.name.trim(),
      form.description.trim(),
      Object.keys(form.context).length > 0 ? form.context : undefined
    )
    emit('created')
  } catch (error) {
    console.error('Failed to create watchlist:', error)
  } finally {
    isCreating.value = false
  }
}
</script>