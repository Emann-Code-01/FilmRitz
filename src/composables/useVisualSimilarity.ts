import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { FilmAttributes, SimilarFilm } from '@/types/intelligence'

export function useVisualSimilarity() {
  const similarFilms = ref<SimilarFilm[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Calculate color similarity using Euclidean distance
  const calculateColorSimilarity = (colors1: any[], colors2: any[]): number => {
    if (!colors1?.length || !colors2?.length) return 0

    let totalSimilarity = 0
    let comparisons = 0

    // Compare each color from set 1 with each color from set 2
    for (const c1 of colors1) {
      for (const c2 of colors2) {
        const distance = Math.sqrt(
          Math.pow(c1.r - c2.r, 2) +
          Math.pow(c1.g - c2.g, 2) +
          Math.pow(c1.b - c2.b, 2)
        )
        // Convert distance to similarity (0-1, where 1 is identical)
        const similarity = Math.max(0, 1 - (distance / 441.67)) // Max distance for RGB is ~441.67
        totalSimilarity += similarity
        comparisons++
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0
  }

  // Calculate style similarity
  const calculateStyleSimilarity = (styles1: string[], styles2: string[]): number => {
    if (!styles1?.length || !styles2?.length) return 0

    const overlap = styles1.filter(style =>
      styles2.some(s2 => s2.toLowerCase() === style.toLowerCase())
    ).length

    const maxPossible = Math.max(styles1.length, styles2.length)
    return overlap / maxPossible
  }

  // Find visually similar films
  const findSimilarFilms = async (sourceFilmId: number, limit = 10) => {
    isLoading.value = true
    error.value = null

    try {
      // Get source film attributes
      const { data: sourceFilm, error: sourceError } = await supabase
        .from('film_attributes')
        .select('*')
        .eq('film_id', sourceFilmId)
        .single()

      if (sourceError) throw sourceError
      if (!sourceFilm) throw new Error('Source film not found')

      // Get all films with visual data
      const { data: allFilms, error: filmsError } = await supabase
        .from('film_attributes')
        .select('*')
        .not('film_id', 'eq', sourceFilmId)
        .not('dominant_colors', 'is', null)
        .limit(1000) // Large pool for similarity matching

      if (filmsError) throw filmsError

      // Calculate similarity scores
      const scoredFilms = (allFilms || []).map((film: FilmAttributes) => {
        const colorSimilarity = calculateColorSimilarity(
          sourceFilm.dominant_colors || [],
          film.dominant_colors || []
        )

        const styleSimilarity = calculateStyleSimilarity(
          sourceFilm.cinematography_style || [],
          film.cinematography_style || []
        )

        const visualStyleSimilarity = calculateStyleSimilarity(
          sourceFilm.visual_style_tags,
          film.visual_style_tags
        )

        // Weighted combination
        const totalSimilarity = (
          colorSimilarity * 0.5 +
          styleSimilarity * 0.3 +
          visualStyleSimilarity * 0.2
        )

        return {
          ...film,
          similarity_score: totalSimilarity,
          similarity_breakdown: {
            color: colorSimilarity,
            cinematography: styleSimilarity,
            visual_style: visualStyleSimilarity
          }
        }
      })

      // Sort by similarity and limit
      const topSimilar = scoredFilms
        .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
        .slice(0, limit)

      similarFilms.value = topSimilar
      return topSimilar

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to find similar films'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const hasResults = computed(() => similarFilms.value.length > 0)

  return {
    similarFilms,
    isLoading,
    error,
    hasResults,
    findSimilarFilms
  }
}