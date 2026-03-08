import { VisualSimilarityService } from "../services/visual-similarity.service";
import { FilmAttributeRepository } from "../repositories/filmAttribute.repository";
import { supabase } from "../lib/supabaseClient";

export class VisualController {
  /**
   * GET /api/films/:id/similar/visual
   */
  static async getVisuallySimilarFilms(filmId: number, limit: number = 8) {
    const targetFilm = await FilmAttributeRepository.findByFilmId(filmId);

    if (
      !targetFilm ||
      !targetFilm.visual_embedding ||
      targetFilm.visual_embedding.length === 0
    ) {
      return [];
    }

    // Fetch potential candidates (all other films with embeddings)
    // In production, use vector search (e.g., pgvector)
    const { data: candidates, error } = await supabase
      .from("film_attributes")
      .select("film_id, visual_embedding")
      .not("film_id", "eq", filmId)
      .not("visual_embedding", "is", null);

    if (error) throw error;

    const ranked = VisualSimilarityService.rankByVisualSimilarity(
      targetFilm.visual_embedding,
      (candidates || []) as any,
    );

    return ranked.slice(0, limit);
  }
}
