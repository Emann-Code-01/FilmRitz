import { IntentInput, ScoredFilm } from "./film.types";

export interface IntentDiscoveryRequest {
  intent: IntentInput;
  userId?: string;
}

export interface IntentDiscoveryResponse {
  results: ScoredFilm[];
  appliedWeights: Record<string, number>;
  executionTimeMs: number;
}

export interface WatchlistWithContextResponse {
  id: string;
  name: string;
  items: any[];
  creation_context: any;
  usage_frequency: number;
  auto_tags: string[];
  relevance_score: number;
}

export interface SimilarFilmsRequest {
  filmId: number;
  type: "visual" | "thematic" | "relationship";
  limit?: number;
}
