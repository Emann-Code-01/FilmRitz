export class VisualSimilarityService {
  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const result = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return isNaN(result) ? 0 : result;
  }

  /**
   * Rank films by visual similarity to a target film
   */
  static rankByVisualSimilarity(
    targetEmbedding: number[],
    candidates: { film_id: number; visual_embedding: number[] }[],
  ): { film_id: number; score: number }[] {
    return candidates
      .map((c) => ({
        film_id: c.film_id,
        score: this.cosineSimilarity(targetEmbedding, c.visual_embedding),
      }))
      .sort((a, b) => b.score - a.score);
  }
}
