export interface TrustRating {
  score: number;
  confidence: "high" | "medium" | "low";
  stability: "stable" | "trending" | "volatile";
  voteCount: number;
  confidenceReason: string;
}

export interface IntelligenceContext {
  mood: string[];
  tone: string[];
  complexity: "simple" | "multi-thread" | "non-linear";
  commitment: {
    runtime?: number;
    bingeHours?: number;
    label: string;
  };
  whyTrending?: string[];
}

export interface IntelligencePayload {
  trustRating: TrustRating;
  context: IntelligenceContext;
}

export type IntentPreset =
  | "watch-tonight"
  | "weekend-binge"
  | "background-viewing";

export interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

// Phase 2 Intelligence Foundation Types

export interface UserEvent {
  id: string;
  user_id: string;
  film_id: number; // TMDB ID
  event_type: 'view' | 'save' | 'skip' | 'finish';
  watch_duration: number; // in seconds
  timestamp: string;
}

export interface FilmAttributes {
  film_id: number; // TMDB ID
  runtime?: number; // in minutes
  complexity_score?: number; // 0-10
  mood_tags: string[];
  pacing_score?: number; // 0-10
  visual_style_tags: string[];
  dominant_colors?: { r: number; g: number; b: number }[]; // RGB color palette
  cinematography_style?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserContextProfile {
  user_id: string;
  avg_watch_time: number; // in minutes
  preferred_complexity?: number; // 0-10
  dominant_moods: string[];
  session_patterns?: Record<string, any>; // JSONB equivalent
  created_at: string;
  updated_at: string;
}

export interface CollaborationEdge {
  id: string;
  person_a_id: number; // TMDB person ID
  person_b_id: number; // TMDB person ID
  collaboration_weight: number;
  created_at: string;
  updated_at: string;
}

// Context Scoring Engine Types
export interface IntentInput {
  time_available?: number; // in minutes
  mood?: string[];
  commitment_level?: 'casual' | 'focused' | 'immersive';
  complexity_tolerance?: number; // 0-10
}

export interface FilmScore {
  film_id: number;
  score: number;
  reasons: {
    runtime_fit: number;
    mood_overlap: number;
    complexity_distance: number;
    historical_completion: number;
  };
}

export interface ContextScoringResult {
  films: FilmScore[];
  total_count: number;
}

// Intent-Aware Watchlists Types
export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  creation_context?: IntentInput;
  dominant_intent?: IntentInput;
  usage_frequency: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  film_id: number;
  added_at: string;
  notes?: string;
  priority: number; // 0=normal, 1=high, 2=urgent
  watched_at?: string;
  user_rating?: number;
}

export interface WatchlistWithItems extends Watchlist {
  items: WatchlistItem[];
  relevance_score?: number;
}

export interface SimilarFilm extends FilmAttributes {
  similarity_score?: number;
  similarity_breakdown?: {
    color: number;
    cinematography: number;
    visual_style: number;
  };
}
