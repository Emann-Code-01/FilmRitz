// src/composables/useMedia.ts
import { ref } from "vue";
import { Media } from "../types/media";
import { movieService } from "../services/mediaService";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchTrendingTV,
  fetchTopRatedTV,
  fetchOnTheAir,
  fetchTrendingMedia,
} from "../api/tmdb";

export function useMedia() {
  const trending = ref<Media[]>([]);
  const topRated = ref<Media[]>([]);
  const upcoming = ref<Media[]>([]);
  const trendingTV = ref<Media[]>([]);
  const topRatedTV = ref<Media[]>([]);
  const upcomingTV = ref<Media[]>([]);
  const trendingAll = ref<Media[]>([]);

  const searchResults = ref<Media[]>([]);
  const discoverResults = ref<Media[]>([]);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const lastFetched = ref<number>(0);
  const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

  // 🎬 MOVIES
  const getTrending = async (force = false) => {
    const now = Date.now();
    if (!force && trending.value.length && now - lastFetched.value < CACHE_TTL) return;
    loading.value = true;
    error.value = null;
    try {
      trending.value = await fetchTrendingMovies("week");
      lastFetched.value = now;
    } catch (err: any) {
      console.error("❌ Failed to fetch trending movies:", err);
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
      console.error("❌ Top rated movies failed:", err);
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
      console.error("❌ Upcoming movies failed:", err);
      error.value = "Failed to fetch upcoming movies.";
    } finally {
      loading.value = false;
    }
  };

  // 📺 TV
  const getTrendingTV = async (force = false) => {
    const now = Date.now();
    if (!force && trendingTV.value.length && now - lastFetched.value < CACHE_TTL) return;
    loading.value = true;
    error.value = null;
    try {
      trendingTV.value = await fetchTrendingTV("week");
      lastFetched.value = now;
    } catch (err: any) {
      console.error("❌ Failed to fetch trending TV:", err);
      error.value = "Failed to fetch trending TV shows.";
    } finally {
      loading.value = false;
    }
  };

  const getTopRatedTV = async () => {
    loading.value = true;
    try {
      topRatedTV.value = await fetchTopRatedTV();
    } catch (err: any) {
      console.error("❌ Top rated TV failed:", err);
      error.value = "Failed to fetch top rated TV shows.";
    } finally {
      loading.value = false;
    }
  };

  const getUpcomingTV = async () => {
    loading.value = true;
    try {
      upcomingTV.value = await fetchOnTheAir();
    } catch (err: any) {
      console.error("❌ Upcoming TV failed:", err);
      error.value = "Failed to fetch upcoming TV shows.";
    } finally {
      loading.value = false;
    }
  };

  // 🔄 Combined
  const getTrendingAll = async (force = false) => {
    const now = Date.now();
    if (!force && trendingAll.value.length && now - lastFetched.value < CACHE_TTL) return;
    loading.value = true;
    error.value = null;
    try {
      trendingAll.value = await fetchTrendingMedia("week");
      lastFetched.value = now;
    } catch (err: any) {
      console.error("❌ Combined trending failed:", err);
      error.value = "Failed to fetch combined media.";
    } finally {
      loading.value = false;
    }
  };

  // 🔍 Use movieService for Searching
  const searchMulti = async (query: string, page = 1) => {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const results = await movieService.searchMulti(query, page); // ✅ pass page to service
      searchResults.value = results;
    } catch (err: any) {
      console.error("❌ Search failed:", err);
      error.value = "Failed to search media/TV.";
    } finally {
      loading.value = false;
    }
  };

  // 🧭 Use movieService for Discovery (genre/year/type filters)
  const discover = async (filters: {
    genre?: number;
    year?: number;
    rating?: number;
    type?: "movie" | "tv";
  }) => {
    loading.value = true;
    error.value = null;
    try {
      discoverResults.value = await movieService.discover(filters);
    } catch (err: any) {
      console.error("❌ Discover failed:", err);
      error.value = "Failed to discover content.";
    } finally {
      loading.value = false;
    }
  };

  return {
    trending,
    topRated,
    upcoming,
    trendingTV,
    topRatedTV,
    upcomingTV,
    trendingAll,
    searchResults,
    discoverResults,
    loading,
    error,
    getTrending,
    getTopRated,
    getUpcoming,
    getTrendingTV,
    getTopRatedTV,
    getUpcomingTV,
    getTrendingAll,
    searchMulti,
    discover, // new
  };
}
