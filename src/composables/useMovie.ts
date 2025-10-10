import { ref } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_TMDB_BASE_URL as string;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string;

// Create a preconfigured axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
    accept: "application/json",
  },
});

export function useMovies() {
  const trending = ref<any[]>([]);
  const topRated = ref<any[]>([]);
  const upcoming = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getTrending = async () => {
    try {
      loading.value = true;
      const res = await api.get("/trending/movie/week");
      trending.value = res.data.results;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch trending movies.";
    } finally {
      loading.value = false;
    }
  };

  const getTopRated = async () => {
    try {
      loading.value = true;
      const res = await api.get("/movie/top_rated", {
        params: { language: "en-US" },
      });
      topRated.value = res.data.results;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch top-rated movies.";
    } finally {
      loading.value = false;
    }
  };

  const getUpcoming = async () => {
    try {
      loading.value = true;
      const res = await api.get("/movie/upcoming", {
        params: { language: "en-US" },
      });
      upcoming.value = res.data.results;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch upcoming movies.";
    } finally {
      loading.value = false;
    }
  };

  return {
    trending,
    topRated,
    upcoming,
    loading,
    error,
    getTrending,
    getTopRated,
    getUpcoming,
  };
}
