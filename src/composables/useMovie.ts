import { ref } from "vue";
import { Movie } from "../types/Movie";
import { movieService } from "../services/movieService";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../api/tmdb";

export function useMovies() {
  const trending = ref<Movie[]>([]);
  const topRated = ref<Movie[]>([]);
  const upcoming = ref<Movie[]>([]);
  const searchResults = ref<Movie[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Cache timestamps
  const lastFetched = ref<number>(0);
  const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

  const getTrending = async (force = false) => {
    const now = Date.now();
    if (!force && trending.value.length && now - lastFetched.value < CACHE_TTL)
      return;

    loading.value = true;
    error.value = null;

    try {
      trending.value = await fetchTrendingMovies("week");
      lastFetched.value = now;
    } catch (err: any) {
      console.error("❌ Failed to fetch trending:", err);
      error.value = "Failed to fetch trending movies.";
    } finally {
      loading.value = false;
    }
  };

  const getTopRated = async () => {
    loading.value = true;
    try {
      topRated.value = await fetchTopRatedMovies();
    } catch (err: any) {
      console.error("❌ Failed to fetch top rated:", err);
      error.value = "Failed to fetch top rated movies.";
    } finally {
      loading.value = false;
    }
  };

  const getUpcoming = async () => {
    loading.value = true;
    try {
      upcoming.value = await fetchUpcomingMovies();
    } catch (err: any) {
      console.error("❌ Failed to fetch upcoming:", err);
      error.value = "Failed to fetch upcoming movies.";
    } finally {
      loading.value = false;
    }
  };

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const results = await movieService.searchMovies(query);
      searchResults.value = results;
    } catch (err: any) {
      console.error("❌ Search failed:", err);
      error.value = "Failed to search movies.";
      searchResults.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    trending,
    topRated,
    upcoming,
    searchResults,
    loading,
    error,
    getTrending,
    getTopRated,
    getUpcoming,
    searchMovies,
  };
}
