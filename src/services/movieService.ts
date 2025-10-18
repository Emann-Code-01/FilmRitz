import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const movieService = {
  async searchMovies(query: string) {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query,
          include_adult: false,
          language: "en-US",
        },
      });
      return response.data.results;
    } catch (err) {
      console.error("❌ Movie search failed:", err);
      return [];
    }
  },

  async discoverMovies(filters: {
    genre?: number;
    year?: number;
    rating?: number;
    type?: "movie" | "tv";
  }) {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          with_genres: filters.genre || "",
          primary_release_year: filters.year || "",
          "vote_average.gte": filters.rating || 0,
          with_original_language: "en",
          sort_by: "popularity.desc",
        },
      });
      return response.data.results;
    } catch (err) {
      console.error("❌ Discover movies failed:", err);
      return [];
    }
  },
};
