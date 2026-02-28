import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Watchlist, WatchlistWithItems, IntentInput } from '@/types/intelligence'

export function useIntentWatchlists() {
  const watchlists = ref<WatchlistWithItems[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch user's watchlists with items
  const fetchWatchlists = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { data: lists, error: listsError } = await supabase
        .from('watchlists')
        .select('*')
        .order('last_used_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (listsError) throw listsError

      // Fetch items for each watchlist
      const watchlistsWithItems = await Promise.all(
        (lists || []).map(async (list) => {
          const { data: items } = await supabase
            .from('watchlist_items')
            .select('*')
            .eq('watchlist_id', list.id)
            .order('priority', { ascending: false })
            .order('added_at', { ascending: false })

          return {
            ...list,
            items: items || [],
            relevance_score: calculateRelevanceScore(list)
          }
        })
      )

      watchlists.value = watchlistsWithItems
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch watchlists'
    } finally {
      isLoading.value = false
    }
  }

  // Create a new intent-aware watchlist
  const createWatchlist = async (
    name: string,
    description: string,
    creationContext?: IntentInput
  ) => {
    try {
      const { data, error: insertError } = await supabase
        .from('watchlists')
        .insert({
          name,
          description,
          creation_context: creationContext,
          dominant_intent: creationContext // Initially same as creation context
        })
        .select()
        .single()

      if (insertError) throw insertError

      await fetchWatchlists() // Refresh the list
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create watchlist'
      throw err
    }
  }

  // Add film to watchlist with context
  const addToWatchlist = async (
    watchlistId: string,
    filmId: number,
    notes?: string,
    priority = 0
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('watchlist_items')
        .insert({
          watchlist_id: watchlistId,
          film_id: filmId,
          notes,
          priority
        })

      if (insertError) throw insertError

      // Update usage frequency and last used
      const { data: currentList } = await supabase
        .from('watchlists')
        .select('usage_frequency')
        .eq('id', watchlistId)
        .single()

      if (currentList) {
        await supabase
          .from('watchlists')
          .update({
            usage_frequency: (currentList.usage_frequency || 0) + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', watchlistId)
      }

      await fetchWatchlists() // Refresh
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add to watchlist'
      throw err
    }
  }

  // Mark item as watched
  const markAsWatched = async (itemId: string, rating?: number) => {
    try {
      const { error: updateError } = await supabase
        .from('watchlist_items')
        .update({
          watched_at: new Date().toISOString(),
          user_rating: rating
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      await fetchWatchlists() // Refresh
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to mark as watched'
      throw err
    }
  }

  // Calculate relevance score for a watchlist based on current context
  const calculateRelevanceScore = (watchlist: Watchlist): number => {
    // This would be more sophisticated in a real implementation
    // For now, base it on usage frequency and recency
    const daysSinceLastUse = watchlist.last_used_at
      ? (Date.now() - new Date(watchlist.last_used_at).getTime()) / (1000 * 60 * 60 * 24)
      : 30

    const recencyScore = Math.max(0, 1 - (daysSinceLastUse / 30)) // Decay over 30 days
    const frequencyScore = Math.min(1, watchlist.usage_frequency / 10) // Cap at 10 uses

    return (recencyScore * 0.6) + (frequencyScore * 0.4)
  }

  // Get watchlists sorted by relevance
  const relevantWatchlists = computed(() =>
    [...watchlists.value].sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
  )

  return {
    watchlists,
    relevantWatchlists,
    isLoading,
    error,
    fetchWatchlists,
    createWatchlist,
    addToWatchlist,
    markAsWatched
  }
}