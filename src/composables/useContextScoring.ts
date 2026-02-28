import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { IntentInput, ContextScoringResult } from '@/types/intelligence'

export function useContextScoring() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<ContextScoringResult | null>(null)

  const scoreFilms = async (intent: IntentInput, limit = 20) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: funcError } = await supabase.functions.invoke('context-scoring', {
        body: { intent, limit }
      })

      if (funcError) throw funcError

      results.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to score films'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const topFilms = computed(() => results.value?.films || [])
  const hasResults = computed(() => topFilms.value.length > 0)

  return {
    isLoading,
    error,
    results,
    scoreFilms,
    topFilms,
    hasResults
  }
}