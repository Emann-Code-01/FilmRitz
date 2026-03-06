import { ScoringEngine } from "../services/scoring/scoring.engine";
import {
  IntentDiscoveryRequest,
  IntentDiscoveryResponse,
} from "../types/api.types";
import { FilmAttributeRepository } from "../repositories/filmAttribute.repository";
import { UserEventRepository } from "../repositories/userEvent.repository";

export class IntentController {
  /**
   * POST /api/discovery/intent
   */
  static async discoverByIntent(
    req: IntentDiscoveryRequest,
  ): Promise<IntentDiscoveryResponse> {
    const startTime = Date.now();
    const { intent, userId } = req;

    // 1. Fetch films that match the mood or generic trending
    let candidateFilms = await FilmAttributeRepository.findByMoodTags([
      intent.mood,
    ]);

    // Fallback if no matching films found (for demo/UX reliability)
    if (candidateFilms.length === 0) {
      candidateFilms = await FilmAttributeRepository.findByMoodTags([]);
      if (candidateFilms.length === 0) {
        candidateFilms = [
          {
            film_id: 550, // Fight Club
            runtime: 139,
            complexity_score: 8.5,
            mood_tags: ["Mind-bending", "Dark"],
            title: "Fight Club",
            poster_path: "/pB8BM79uySvm6SKPxt7ZKgpR76P.jpg",
            media_type: "movie",
          } as any,
          {
            film_id: 27205, // Inception
            runtime: 148,
            complexity_score: 9.5,
            mood_tags: ["Intense", "Atmospheric"],
            title: "Inception",
            poster_path: "/oYuS4V5C7uLp9K7CslpQuGq8N8o.jpg",
            media_type: "movie",
          } as any,
          {
            film_id: 155, // The Dark Knight
            runtime: 152,
            complexity_score: 7.5,
            mood_tags: ["Tense", "Gritty"],
            title: "The Dark Knight",
            poster_path: "/qJ2tW6WMUDp9s1vSafeRrg6uRTM.jpg",
            media_type: "movie",
          } as any,
          {
            film_id: 157336, // Interstellar
            runtime: 169,
            complexity_score: 8.0,
            mood_tags: ["Epic", "Atmospheric"],
            title: "Interstellar",
            poster_path: "/gEU2QniE6EUnUvP6lzpC6LsbhA0.jpg",
            media_type: "movie",
          } as any,
        ];
      }
    }

    // 2. Get user history for probability adjustments
    let userHistory = { avgComplexity: 5, completionRate: 0.7 };
    if (userId) {
      const completionRate =
        await UserEventRepository.getCompletionRate(userId);
      userHistory = {
        avgComplexity: 5,
        completionRate: (completionRate || 70) / 100,
      };
    }

    // 3. Score candidates
    const scoredFilms = candidateFilms
      .map((film: any) => {
        const scored = ScoringEngine.scoreFilm(
          {
            film_id: film.film_id,
            runtime: film.runtime || undefined,
            complexity_score: film.complexity_score || undefined,
            mood_tags: film.mood_tags,
          },
          intent,
          userHistory,
        );
        // Hydrate with metadata if present
        return {
          ...scored,
          title: film.title,
          poster_path: film.poster_path,
          media_type: film.media_type || "movie",
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    return {
      results: scoredFilms,
      appliedWeights: {
        runtimeFit: 0.25,
        moodOverlap: 0.35,
        complexityDistance: 0.2,
        completionProbability: 0.2,
      },
      executionTimeMs: Date.now() - startTime,
    };
  }
}
