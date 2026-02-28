// FilmRitz Phase 2: Context Scoring Engine Formulas
// Locked formulas for intent-aware discovery

export interface ScoringWeights {
  runtime_fit: number;
  mood_overlap: number;
  complexity_distance: number;
  historical_completion: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  runtime_fit: 0.25,
  mood_overlap: 0.35,
  complexity_distance: 0.20,
  historical_completion: 0.20
};

// Runtime Fit Score (0-1)
// How well the film's runtime matches user's available time
export function calculateRuntimeFit(
  filmRuntime: number, // in minutes
  availableTime: number // in minutes
): number {
  if (!availableTime || !filmRuntime) return 0.5; // neutral

  const ratio = filmRuntime / availableTime;

  if (ratio <= 0.8) return 1.0; // perfect fit
  if (ratio <= 1.0) return 0.9; // good fit
  if (ratio <= 1.2) return 0.7; // acceptable
  if (ratio <= 1.5) return 0.4; // stretch
  return 0.1; // too long
}

// Mood Overlap Score (0-1)
// How much the film's mood tags match user's desired mood
export function calculateMoodOverlap(
  filmMoods: string[],
  desiredMoods: string[]
): number {
  if (!desiredMoods.length || !filmMoods.length) return 0.5;

  const overlap = filmMoods.filter(mood =>
    desiredMoods.some(desired => desired.toLowerCase() === mood.toLowerCase())
  ).length;

  const maxPossible = Math.max(filmMoods.length, desiredMoods.length);
  return overlap / maxPossible;
}

// Complexity Distance Score (0-1)
// How close the film's complexity is to user's tolerance
export function calculateComplexityDistance(
  filmComplexity: number, // 0-10
  userTolerance: number // 0-10
): number {
  if (filmComplexity === undefined || userTolerance === undefined) return 0.5;

  const distance = Math.abs(filmComplexity - userTolerance);
  const maxDistance = 10;

  // Closer is better, score decreases with distance
  return Math.max(0, 1 - (distance / maxDistance));
}

// Historical Completion Rate Score (0-1)
// User's likelihood to complete based on past behavior
export function calculateHistoricalCompletion(
  filmComplexity: number,
  userAvgComplexity: number,
  userCompletionRate: number = 0.7 // default 70%
): number {
  if (filmComplexity === undefined || userAvgComplexity === undefined) return userCompletionRate;

  const complexityDiff = Math.abs(filmComplexity - userAvgComplexity);
  const adjustment = complexityDiff > 2 ? -0.2 : complexityDiff > 1 ? -0.1 : 0.1;

  return Math.max(0, Math.min(1, userCompletionRate + adjustment));
}

// Overall Film Score
export function calculateFilmScore(
  film: {
    runtime?: number;
    complexity_score?: number;
    mood_tags: string[];
  },
  userProfile: {
    avg_watch_time: number;
    preferred_complexity?: number;
    dominant_moods: string[];
  },
  intent: {
    time_available?: number;
    mood?: string[];
    complexity_tolerance?: number;
  },
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): number {
  const runtimeFit = calculateRuntimeFit(
    film.runtime || 120,
    intent.time_available || userProfile.avg_watch_time
  );

  const moodOverlap = calculateMoodOverlap(
    film.mood_tags,
    intent.mood || userProfile.dominant_moods
  );

  const complexityDistance = calculateComplexityDistance(
    film.complexity_score || 5,
    intent.complexity_tolerance || userProfile.preferred_complexity || 5
  );

  const historicalCompletion = calculateHistoricalCompletion(
    film.complexity_score || 5,
    userProfile.preferred_complexity || 5
  );

  const score = (
    runtimeFit * weights.runtime_fit +
    moodOverlap * weights.mood_overlap +
    complexityDistance * weights.complexity_distance +
    historicalCompletion * weights.historical_completion
  );

  return Math.round(score * 100) / 100; // round to 2 decimal places
}

// Intent Definitions (Locked)
export const INTENT_PRESETS = {
  'watch-tonight': {
    time_available: 120, // 2 hours
    mood: ['relaxing', 'light', 'feel-good'],
    commitment_level: 'casual' as const,
    complexity_tolerance: 3
  },
  'weekend-binge': {
    time_available: 480, // 8 hours
    mood: ['engaging', 'epic', 'dramatic'],
    commitment_level: 'immersive' as const,
    complexity_tolerance: 7
  },
  'background-viewing': {
    time_available: 60, // 1 hour
    mood: ['mindless', 'funny', 'light-hearted'],
    commitment_level: 'casual' as const,
    complexity_tolerance: 2
  }
} as const;