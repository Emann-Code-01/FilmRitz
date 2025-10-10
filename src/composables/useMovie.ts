import { ref } from "vue";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../api/tmdb";

export function useMovies() {
  const trending = ref<any[]>([]);
  const topRated = ref<any[]>([]);
  const upcoming = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getTrending = async () => {
    loading.value = true;
    try {
      trending.value = await fetchTrendingMovies("week");
    } catch (err: any) {
      error.value = "Failed to fetch trending movies.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getTopRated = async () => {
    loading.value = true;
    try {
      topRated.value = await fetchTopRatedMovies();
    } catch (err: any) {
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
      error.value = err.message || "Something went wrong";
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
