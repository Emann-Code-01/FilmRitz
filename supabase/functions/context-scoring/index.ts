import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IntentInput {
  time_available?: number;
  mood?: string[];
  commitment_level?: 'casual' | 'focused' | 'immersive';
  complexity_tolerance?: number;
}

interface FilmAttributes {
  film_id: number;
  runtime?: number;
  complexity_score?: number;
  mood_tags: string[];
  pacing_score?: number;
  visual_style_tags: string[];
}

interface UserContextProfile {
  avg_watch_time: number;
  preferred_complexity?: number;
  dominant_moods: string[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { intent, limit = 20 }: { intent: IntentInput; limit?: number } = await req.json()

    // Get user profile
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { data: profile } = await supabaseClient
      .from('user_context_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const userProfile: UserContextProfile = profile || {
      avg_watch_time: 120,
      preferred_complexity: 5,
      dominant_moods: []
    }

    // Get films with attributes
    const { data: films, error } = await supabaseClient
      .from('film_attributes')
      .select('*')
      .limit(1000) // Get a large pool to score

    if (error) throw error

    // Score films
    const scoredFilms = films.map((film: FilmAttributes) => ({
      film_id: film.film_id,
      score: calculateFilmScore(film, userProfile, intent),
      reasons: {
        runtime_fit: calculateRuntimeFit(film.runtime || 120, intent.time_available || userProfile.avg_watch_time),
        mood_overlap: calculateMoodOverlap(film.mood_tags, intent.mood || userProfile.dominant_moods),
        complexity_distance: calculateComplexityDistance(film.complexity_score || 5, intent.complexity_tolerance || userProfile.preferred_complexity || 5),
        historical_completion: calculateHistoricalCompletion(film.complexity_score || 5, userProfile.preferred_complexity || 5)
      }
    }))

    // Sort by score and limit
    const topFilms = scoredFilms
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return new Response(
      JSON.stringify({
        films: topFilms,
        total_count: films.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Scoring functions (same as frontend utils)
function calculateRuntimeFit(filmRuntime: number, availableTime: number): number {
  if (!availableTime || !filmRuntime) return 0.5
  const ratio = filmRuntime / availableTime
  if (ratio <= 0.8) return 1.0
  if (ratio <= 1.0) return 0.9
  if (ratio <= 1.2) return 0.7
  if (ratio <= 1.5) return 0.4
  return 0.1
}

function calculateMoodOverlap(filmMoods: string[], desiredMoods: string[]): number {
  if (!desiredMoods.length || !filmMoods.length) return 0.5
  const overlap = filmMoods.filter(mood =>
    desiredMoods.some(desired => desired.toLowerCase() === mood.toLowerCase())
  ).length
  const maxPossible = Math.max(filmMoods.length, desiredMoods.length)
  return overlap / maxPossible
}

function calculateComplexityDistance(filmComplexity: number, userTolerance: number): number {
  if (filmComplexity === undefined || userTolerance === undefined) return 0.5
  const distance = Math.abs(filmComplexity - userTolerance)
  return Math.max(0, 1 - (distance / 10))
}

function calculateHistoricalCompletion(filmComplexity: number, userAvgComplexity: number): number {
  if (filmComplexity === undefined || userAvgComplexity === undefined) return 0.7
  const complexityDiff = Math.abs(filmComplexity - userAvgComplexity)
  const adjustment = complexityDiff > 2 ? -0.2 : complexityDiff > 1 ? -0.1 : 0.1
  return Math.max(0, Math.min(1, 0.7 + adjustment))
}

function calculateFilmScore(
  film: FilmAttributes,
  userProfile: UserContextProfile,
  intent: IntentInput
): number {
  const weights = { runtime_fit: 0.25, mood_overlap: 0.35, complexity_distance: 0.20, historical_completion: 0.20 }

  const runtimeFit = calculateRuntimeFit(
    film.runtime || 120,
    intent.time_available || userProfile.avg_watch_time
  )

  const moodOverlap = calculateMoodOverlap(
    film.mood_tags,
    intent.mood || userProfile.dominant_moods
  )

  const complexityDistance = calculateComplexityDistance(
    film.complexity_score || 5,
    intent.complexity_tolerance || userProfile.preferred_complexity || 5
  )

  const historicalCompletion = calculateHistoricalCompletion(
    film.complexity_score || 5,
    userProfile.preferred_complexity || 5
  )

  const score = (
    runtimeFit * weights.runtime_fit +
    moodOverlap * weights.mood_overlap +
    complexityDistance * weights.complexity_distance +
    historicalCompletion * weights.historical_completion
  )

  return Math.round(score * 100) / 100
}