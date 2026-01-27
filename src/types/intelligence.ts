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
