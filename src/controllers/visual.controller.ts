import { VisualSimilarityService } from "../services/visual-similarity.service";
import { FilmAttributeRepository } from "../repositories/filmAttribute.repository";
import prisma from "../lib/prisma";

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
    const candidates = await prisma.filmAttribute.findMany({
      where: {
        film_id: { not: filmId },
        visual_embedding: { isEmpty: false },
      },
      select: {
        film_id: true,
        visual_embedding: true,
      },
    });

    const ranked = VisualSimilarityService.rankByVisualSimilarity(
      targetFilm.visual_embedding,
      candidates as any,
    );

    return ranked.slice(0, limit);
  }
}
