import { supabase } from "../lib/supabaseClient";
import { FilmAttributeDTO } from "../types/film.types";

export class FilmAttributeRepository {
  static async upsert(data: FilmAttributeDTO) {
    const { data: result, error } = await supabase
      .from("film_attributes")
      .upsert(
        {
          film_id: data.film_id,
          runtime: data.runtime,
          complexity_score: data.complexity_score,
          mood_tags: data.mood_tags,
          pacing_score: data.pacing_score,
          visual_style_tags: data.visual_style_tags,
          dominant_colors: data.dominant_colors,
          cinematography_style: data.cinematography_style,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "film_id",
        },
      )
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async findByFilmId(filmId: number) {
    const { data, error } = await supabase
      .from("film_attributes")
      .select("*")
      .eq("film_id", filmId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows found"
    return data;
  }

  static async findByMoodTags(tags: string[]) {
    if (!tags || tags.length === 0) {
      const { data, error } = await supabase
        .from("film_attributes")
        .select("*")
        .limit(20);
      if (error) throw error;
      return data || [];
    }

    const { data, error } = await supabase
      .from("film_attributes")
      .select("*")
      .overlaps("mood_tags", tags);

    if (error) throw error;
    return data || [];
  }
}
