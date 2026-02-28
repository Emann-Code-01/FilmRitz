import prisma from "../lib/prisma";
import { FilmAttributeDTO } from "../types/film.types";

export class FilmAttributeRepository {
  static async upsert(data: FilmAttributeDTO) {
    return prisma.filmAttribute.upsert({
      where: { film_id: data.film_id },
      update: {
        runtime: data.runtime,
        complexity_score: data.complexity_score,
        mood_tags: data.mood_tags,
        pacing_score: data.pacing_score,
        visual_style_tags: data.visual_style_tags,
        dominant_colors: data.dominant_colors,
        cinematography_style: data.cinematography_style,
        updated_at: new Date(),
      },
      create: {
        film_id: data.film_id,
        runtime: data.runtime,
        complexity_score: data.complexity_score,
        mood_tags: data.mood_tags,
        pacing_score: data.pacing_score,
        visual_style_tags: data.visual_style_tags,
        dominant_colors: data.dominant_colors,
        cinematography_style: data.cinematography_style,
      },
    });
  }

  static async findByFilmId(filmId: number) {
    return prisma.filmAttribute.findUnique({
      where: { film_id: filmId },
    });
  }

  static async findByMoodTags(tags: string[]) {
    return prisma.filmAttribute.findMany({
      where: {
        mood_tags: {
          hasSome: tags,
        },
      },
    });
  }
}
