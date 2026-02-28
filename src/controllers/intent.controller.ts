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
      candidateFilms = await FilmAttributeRepository.findByMoodTags([]); // Should return some films or handle empty
      // If still empty, we use hardcoded mock IDs to ensure UI isn't empty in dev
      if (candidateFilms.length === 0) {
        candidateFilms = [
          {
            film_id: 550,
            runtime: 139,
            complexity_score: 8.5,
            mood_tags: ["Mind-bending", "Dark"],
          } as any,
          {
            film_id: 27205,
            runtime: 148,
            complexity_score: 9.5,
            mood_tags: ["Intense", "Atmospheric"],
          } as any,
          {
            film_id: 155,
            runtime: 152,
            complexity_score: 7.5,
            mood_tags: ["Tense", "Gritty"],
          } as any,
          {
            film_id: 157336,
            runtime: 169,
            complexity_score: 8.0,
            mood_tags: ["Epic", "Atmospheric"],
          } as any,
        ];
      }
    }

    // 2. Get user history for probability adjustments
    let userHistory = { avgComplexity: 5, completionRate: 0.7 };
    if (userId) {
      const [, completionRate] = await Promise.all([
        UserEventRepository.getAvgWatchTime(userId),
        UserEventRepository.getCompletionRate(userId),
      ]);
      // Simple heuristic: adjust complexity based on history
      userHistory = {
        avgComplexity: 5, // Default for now
        completionRate: completionRate / 100,
      };
    }

    // 3. Score candidates
    const scoredFilms = candidateFilms
      .map((film: any) =>
        ScoringEngine.scoreFilm(
          {
            film_id: film.film_id,
            runtime: film.runtime || undefined,
            complexity_score: film.complexity_score || undefined,
            mood_tags: film.mood_tags,
          },
          intent,
          userHistory,
        ),
      )
      .sort((a: any, b: any) => b.score - a.score)
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
