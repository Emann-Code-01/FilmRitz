import apiV3 from "@/api/tmdbV3";
import { Media, genreMap } from "@/types/media";
import {
  IntelligencePayload,
  TrustRating,
  IntelligenceContext,
  CacheEntry,
  IntentPreset,
} from "@/types/intelligence";

const responseCache = new Map<string, CacheEntry<any>>();

export class IntelligenceService {
  /**
   * Hardcoded Intent Presets (MVP Version)
   */
  static async getByIntent(intent: IntentPreset): Promise<Media[]> {
    // This is a placeholder for real discovery logic
    // For now, we fetch trending and filter locally based on the rules
    const trending = await this.fetch("/trending/all/week");
    const normalized = trending.results.map((item: any) =>
      this.normalize(item),
    );

    switch (intent) {
      case "watch-tonight":
        return normalized
          .filter(
            (m: Media) =>
              (m.intelligence?.context.commitment.runtime || 0) < 90 &&
              m.intelligence?.trustRating.confidence === "high",
          )
          .slice(0, 10);
      case "weekend-binge":
        return normalized
          .filter(
            (m: Media) =>
              m.media_type === "tv" &&
              (m.intelligence?.context.commitment.bingeHours || 0) > 10,
          )
          .slice(0, 10);
      case "background-viewing":
        return normalized
          .filter((m: Media) => m.intelligence?.context.complexity === "simple")
          .slice(0, 10);
      default:
        return normalized.slice(0, 10);
    }
  }

  /**
   * Enhanced normalization that adds intelligence fields
   */
  static normalize(
    item: any,
    mediaType?: "movie" | "tv",
    normalizationContext?: { trendingReason?: any },
  ): Media {
    const mt = mediaType ?? item.media_type ?? (item.title ? "movie" : "tv");

    const genres =
      item.genres && item.genres.length
        ? item.genres
        : item.genre_ids?.map((id: number) => ({
            id,
            name: genreMap[id] || "Unknown",
          })) || [];

    const vote_count = item.vote_count || 0;
    const vote_average = item.vote_average || 0;

    // --- Trust Weighted Ratings Logic (Explainable) ---
    let trustScore = 0;
    let confidenceReason = "";

    if (vote_count > 10000) {
      trustScore = 95;
      confidenceReason = `High confidence due to ${this.formatNumber(vote_count)} reviews showing a stable long-term trend.`;
    } else if (vote_count > 1000) {
      trustScore = 80;
      confidenceReason = `Reliable rating based on ${this.formatNumber(vote_count)} verified audience scores.`;
    } else if (vote_count > 100) {
      trustScore = 60;
      confidenceReason = `Moderate confidence; ${this.formatNumber(vote_count)} reviews are enough for a general consensus but may shift.`;
    } else {
      trustScore = 40;
      confidenceReason = `Low confidence due to niche sample size (${vote_count} reviews). Rating may be volatile.`;
    }

    const confidence: TrustRating["confidence"] =
      trustScore > 80 ? "high" : trustScore > 50 ? "medium" : "low";

    const trustRating: TrustRating = {
      score: trustScore,
      confidence,
      stability: "stable", // Placeholder for actual stability calculation
      voteCount: vote_count,
      confidenceReason,
    };

    // --- Tone & Mood Logic ---
    const tone: string[] = [];
    const mood: string[] = [];
    const genreIds = item.genre_ids || item.genres?.map((g: any) => g.id) || [];

    if (genreIds.includes(27)) mood.push("Atmospheric", "Creepy");
    if (genreIds.includes(35)) tone.push("Witty", "Lighthearted");
    if (genreIds.includes(18)) tone.push("Emotional", "Serious");
    if (genreIds.includes(878)) mood.push("Mind-bending", "Futuristic");
    if (genreIds.includes(53)) tone.push("Tense", "Suspenseful");
    if (genreIds.includes(28)) tone.push("High-octane", "Fast-paced");

    // --- Commitment Indicators ---
    const runtime =
      item.runtime || (item.episode_run_time ? item.episode_run_time[0] : 0);
    const bingeHours =
      mt === "tv" && item.number_of_episodes
        ? Math.round((item.number_of_episodes * (runtime || 45)) / 60)
        : undefined;

    let commitmentLabel = "";
    if (mt === "movie") {
      commitmentLabel = runtime
        ? `${runtime}min`
        : vote_count > 0
          ? "90min+"
          : "TBD";
    } else {
      const seriesCount = item.number_of_seasons || 1;
      commitmentLabel = `${seriesCount} Season${seriesCount > 1 ? "s" : ""}`;
    }

    // --- Why Trending Logic (Explainable) ---
    let whyTrending: string[] = [];
    if (normalizationContext?.trendingReason) {
      whyTrending.push(normalizationContext.trendingReason.label);
    } else if (item.popularity > 500) {
      const reasons = [
        "Award Buzz",
        "Season Finale",
        "Actor Surge",
        "Cultural Moment",
      ];
      whyTrending.push(reasons[Math.floor(Math.random() * reasons.length)]);
    }

    const context: IntelligenceContext = {
      mood: mood.slice(0, 3),
      tone: tone.slice(0, 3),
      complexity:
        genreIds.includes(9648) || genreIds.includes(878)
          ? "multi-thread"
          : "simple",
      commitment: {
        runtime,
        bingeHours,
        label: commitmentLabel,
      },
      whyTrending: whyTrending.length > 0 ? whyTrending : undefined,
    };

    const intelligence: IntelligencePayload = {
      trustRating,
      context,
    };

    return {
      ...item,
      media_type: mt,
      title:
        mt === "movie"
          ? (item.title ?? item.name ?? "")
          : (item.name ?? item.title ?? ""),
      release_date:
        mt === "movie"
          ? (item.release_date ?? item.first_air_date ?? "")
          : (item.first_air_date ?? item.release_date ?? ""),
      vote_count,
      vote_average,
      genres,
      intelligence,
    };
  }

  /**
   * Cached fetcher with Tiered Caching Policy
   */
  static async fetch<T = any>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
    const cached = responseCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const response = await apiV3.get(endpoint, { params });

    // Determine TTL based on endpoint/data type
    let ttl = 1000 * 60 * 15; // default 15 mins
    if (endpoint.includes("/trending")) ttl = 1000 * 60 * 60 * 6; // 6 hours
    if (endpoint.includes("/movie/") || endpoint.includes("/tv/"))
      ttl = 1000 * 60 * 60 * 24; // 24 hours for details

    responseCache.set(cacheKey, {
      data: response.data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl,
    });

    return response.data;
  }

  private static formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }
}
