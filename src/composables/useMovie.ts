import { ref } from "vue";
import axios from "axios";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../api/tmdb";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = "https://api.themoviedb.org/3";

export function useMovies() {
  const trending = ref<any[]>([]);
  const topRated = ref<any[]>([]);
  const upcoming = ref<any[]>([]);
  const searchResults = ref<Movie[]>([]);
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

  const searchMovies = async (query: string) => {
    const { data } = await axios.get(
      `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    );
    searchResults.value = data.results;
  };

  return {
    trending,
    topRated,
    upcoming,
    searchResults,
    error,
    getTrending,
    getTopRated,
    getUpcoming,
    searchMovies,
    loading,
  };
}
