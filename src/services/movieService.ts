import axios from "axios";
import { Movie } from "../types/Movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const movieService = {
  async searchMovies(query: string): Promise<Movie[]> {
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

  async getTrending(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
        params: { api_key: API_KEY },
      });
      return response.data.results;
    } catch (err) {
      console.error("❌ Fetch trending failed:", err);
      return [];
    }
  },

  async getTopRated(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: { api_key: API_KEY, language: "en-US" },
      });
      return response.data.results;
    } catch (err) {
      console.error("❌ Fetch top rated failed:", err);
      return [];
    }
  },

  async getUpcoming(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
        params: { api_key: API_KEY, language: "en-US" },
      });
      return response.data.results;
    } catch (err) {
      console.error("❌ Fetch upcoming failed:", err);
      return [];
    }
  },
};
