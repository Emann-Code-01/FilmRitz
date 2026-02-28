export interface UserEventDTO {
  id?: string;
  user_id: string;
  film_id: number;
  event_type: "view" | "save" | "skip" | "finish";
  watch_duration?: number;
  timestamp?: string | Date;
}

export interface FilmAttributeDTO {
  film_id: number;
  runtime?: number;
  complexity_score?: number;
  mood_tags: string[];
  pacing_score?: number;
  visual_style_tags: string[];
  dominant_colors?: any;
  cinematography_style?: string[];
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface UserContextProfileDTO {
  user_id: string;
  avg_watch_time?: number;
  preferred_complexity?: number;
  dominant_moods: string[];
  session_patterns?: any;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface CollaborationEdgeDTO {
  id?: string;
  person_a_id: number;
  person_b_id: number;
  collaboration_weight?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface IntentInput {
  timeAvailable: number; // in minutes
  mood: string;
  commitmentLevel: "low" | "medium" | "high";
  complexityTolerance: "simple" | "balanced" | "complex";
}

export interface ScoredFilm {
  film_id: number;
  score: number;
  explanations: string[];
  matchDetails: {
    runtimeFit: number;
    moodOverlap: number;
    complexityDistance: number;
    completionProbability: number;
  };
}
