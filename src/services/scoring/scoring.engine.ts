import { IntentInput, ScoredFilm } from "../../types/film.types";

export class ScoringEngine {
  private static readonly WEIGHTS = {
    runtimeFit: 0.25,
    moodOverlap: 0.35,
    complexityDistance: 0.2,
    completionProbability: 0.2,
  };

  /**
   * Main scoring function
   */
  static scoreFilm(
    film: {
      film_id: number;
      runtime?: number;
      complexity_score?: number;
      mood_tags: string[];
    },
    intent: IntentInput,
    userHistory: {
      avgComplexity: number;
      completionRate: number;
    },
  ): ScoredFilm {
    const runtimeFit = this.calculateRuntimeFit(
      film.runtime || 120,
      intent.timeAvailable,
    );
    const moodOverlap = this.calculateMoodOverlap(film.mood_tags, [
      intent.mood,
    ]);

    const targetComplexity = this.mapComplexityTolerance(
      intent.complexityTolerance,
    );
    const complexityDistance = this.calculateComplexityDistance(
      film.complexity_score || 5,
      targetComplexity,
    );

    const completionProbability = this.calculateCompletionProbability(
      film.complexity_score || 5,
      userHistory.avgComplexity,
      userHistory.completionRate,
    );

    const totalScore =
      runtimeFit * this.WEIGHTS.runtimeFit +
      moodOverlap * this.WEIGHTS.moodOverlap +
      complexityDistance * this.WEIGHTS.complexityDistance +
      completionProbability * this.WEIGHTS.completionProbability;

    const explanations = this.generateExplanations(
      runtimeFit,
      moodOverlap,
      complexityDistance,
      completionProbability,
      intent,
    );

    return {
      film_id: film.film_id,
      score: Math.round(totalScore * 100),
      explanations,
      matchDetails: {
        runtimeFit,
        moodOverlap,
        complexityDistance,
        completionProbability,
      },
    };
  }

  private static calculateRuntimeFit(
    filmRuntime: number,
    availableTime: number,
  ): number {
    if (filmRuntime <= availableTime) return 1.0;
    if (filmRuntime <= availableTime * 1.2) return 0.7;
    return 0.3;
  }

  private static calculateMoodOverlap(
    filmMoods: string[],
    desiredMoods: string[],
  ): number {
    if (!desiredMoods.length || !filmMoods.length) return 0.5;
    const overlap = filmMoods.filter((m) =>
      desiredMoods.some((d) => d.toLowerCase() === m.toLowerCase()),
    ).length;
    return overlap / Math.max(filmMoods.length, desiredMoods.length);
  }

  private static mapComplexityTolerance(
    tolerance: "simple" | "balanced" | "complex",
  ): number {
    const maps = {
      simple: 2.5,
      balanced: 5.0,
      complex: 7.5,
    };
    return maps[tolerance];
  }

  private static calculateComplexityDistance(
    filmComplexity: number,
    targetComplexity: number,
  ): number {
    const distance = Math.abs(filmComplexity - targetComplexity);
    return Math.max(0, 1 - distance / 5); // Higher score for lower distance
  }

  private static calculateCompletionProbability(
    filmComplexity: number,
    userAvgComplexity: number,
    userCompletionRate: number,
  ): number {
    const diff = Math.abs(filmComplexity - userAvgComplexity);
    const penalty = diff > 2 ? 0.2 : 0;
    return Math.max(0, userCompletionRate - penalty);
  }

  private static generateExplanations(
    runtimeFit: number,
    moodOverlap: number,
    complexityDistance: number,
    completionProbability: number,
    intent: IntentInput,
  ): string[] {
    const explanations: string[] = [];

    if (runtimeFit > 0.8)
      explanations.push("Fits perfectly into your schedule.");
    if (moodOverlap > 0.5)
      explanations.push(`Matches your ${intent.mood} mood.`);
    if (complexityDistance > 0.8)
      explanations.push("Matches your preferred complexity levels.");
    if (completionProbability > 0.8)
      explanations.push("High likelihood you'll finish this.");

    return explanations.slice(0, 3);
  }
}
