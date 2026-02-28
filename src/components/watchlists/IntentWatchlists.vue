<template>
  <div class="intent-watchlists">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">My Watchlists</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Watchlist
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-400 mt-2">Loading watchlists...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-400">{{ error }}</p>
      <button
        @click="fetchWatchlists"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>
    </div>

    <!-- Watchlists Grid -->
    <div v-else-if="relevantWatchlists.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="watchlist in relevantWatchlists"
        :key="watchlist.id"
        class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
        @click="selectWatchlist(watchlist)"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-white font-semibold truncate">{{ watchlist.name }}</h3>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              {{ Math.round((watchlist.relevance_score || 0) * 100) }}% relevant
            </span>
          </div>
        </div>

        <p v-if="watchlist.description" class="text-gray-400 text-sm mb-3 line-clamp-2">
          {{ watchlist.description }}
        </p>

        <!-- Context Tags -->
        <div class="mb-3">
          <div v-if="watchlist.dominant_intent?.mood?.length" class="flex flex-wrap gap-1 mb-2">
            <span
              v-for="mood in watchlist.dominant_intent.mood.slice(0, 3)"
              :key="mood"
              class="text-xs bg-purple-600 text-white px-2 py-1 rounded"
            >
              {{ mood }}
            </span>
          </div>
          <div v-if="watchlist.dominant_intent?.time_available" class="text-xs text-gray-400">
            {{ watchlist.dominant_intent.time_available }}min sessions
          </div>
        </div>

        <!-- Stats -->
        <div class="flex justify-between items-center text-sm text-gray-400">
          <span>{{ watchlist.items.length }} films</span>
          <span>Used {{ watchlist.usage_frequency }} times</span>
        </div>

        <!-- Quick Actions -->
        <div class="mt-3 flex gap-2">
          <button
            @click.stop="useWatchlist(watchlist)"
            class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            Use Now
          </button>
          <button
            @click.stop="editWatchlist(watchlist)"
            class="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">No watchlists yet</h3>
        <p>Create your first intent-aware watchlist to organize films by mood and context.</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your First Watchlist
      </button>
    </div>

    <!-- Create Watchlist Modal -->
    <CreateWatchlistModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="onWatchlistCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIntentWatchlists } from '@/composables/useIntentWatchlists'
import CreateWatchlistModal from '@/components/watchlists/CreateWatchlistModal.vue'
import type { WatchlistWithItems } from '@/types/intelligence'

const router = useRouter()
const { relevantWatchlists, isLoading, error, fetchWatchlists } = useIntentWatchlists()
const showCreateModal = ref(false)

onMounted(() => {
  fetchWatchlists()
})

const selectWatchlist = (watchlist: WatchlistWithItems) => {
  // Navigate to watchlist detail view
  router.push(`/ng/watchlist/${watchlist.id}`)
}

const useWatchlist = (watchlist: WatchlistWithItems) => {
  // Apply the watchlist's intent to discovery
  router.push({
    name: 'Discovery',
    query: {
      intent: JSON.stringify(watchlist.dominant_intent)
    }
  })
}

const editWatchlist = (watchlist: WatchlistWithItems) => {
  // Open edit modal (not implemented yet)
  console.log('Edit watchlist:', watchlist)
}

const onWatchlistCreated = () => {
  showCreateModal.value = false
  fetchWatchlists()
}
</script>