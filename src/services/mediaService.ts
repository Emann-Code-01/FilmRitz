// src/services/mediaService.ts
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function normalizeItem(item: any) {
  const media_type = item.media_type ?? (item.title ? "movie" : "tv");
  return {
    ...item,
    media_type,
    title: media_type === "movie" ? item.title ?? item.name : item.name ?? item.title,
    release_date:
      media_type === "movie" ? item.release_date ?? item.first_air_date ?? "" : item.first_air_date ?? item.release_date ?? "",
  };
}

export const movieService = {
  // Search multi (movie + tv)
  async searchMulti(query: string, page = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/search/multi`, {
        params: {
          api_key: API_KEY,
          query,
          page, // ✅ TMDB supports pagination
          include_adult: false,
          language: "en-US",
        },
      });
      const raw = response.data.results || [];
      return raw
        .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
        .map(normalizeItem);
    } catch (err) {
      console.error("❌ Movie search failed:", err);
      return [];
    }
  },

  // Discover for movie or tv
  async discover(filters: {
    genre?: number;
    year?: number;
    rating?: number;
    type?: "movie" | "tv";
  }) {
    try {
      const type = filters.type ?? "movie";
      const endpoint = type === "movie" ? "discover/movie" : "discover/tv";

      const params: any = {
        api_key: API_KEY,
        with_genres: filters.genre || "",
        "vote_average.gte": filters.rating || 0,
        with_original_language: "en",
        sort_by: "popularity.desc",
        page: 1,
      };

      if (filters.year) {
        if (type === "movie") params.primary_release_year = filters.year;
        else params.first_air_date_year = filters.year;
      }

      const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
      const results = response.data.results || [];
      return results.map((r: any) => normalizeItem({ ...r, media_type: type }));
    } catch (err) {
      console.error("❌ Discover failed:", err);
      return [];
    }
  },
};
