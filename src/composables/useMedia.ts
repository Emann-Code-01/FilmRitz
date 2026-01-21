// src/composables/useMedia.ts
import { ref } from "vue";
import { defineStore } from "pinia";
import { movieService } from "../services/mediaService";
import type { Media, Genre } from "@/types/media";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchTrendingTV,
  fetchTopRatedTV,
  fetchOnTheAir,
  // fetchTrendingMedia,
} from "../api/tmdb";
import { useMediaCache } from "./useMediaCache";
import logger from "@/utils/logger";

// Request deduplication map to prevent duplicate API calls
const pendingRequests = new Map<string, Promise<any>>();

export const useMediaStore = defineStore("media", () => {
  const trendingMovies = ref<Media[]>([]);
  const genres = ref<Genre[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const getGenreNames = (genreIds: number[]): string[] => {
    return genreIds
      .map((id) => genres.value.find((g) => g.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  };

  const getGenreColor = (genreName: string): string => {
    const colorMap: Record<string, string> = {
      Horror: "#DC2626",
      Action: "#F59E0B",
      Adventure: "#FBBF24",
      "Sci-Fi": "#3B82F6",
      Romance: "#EC4899",
      Comedy: "#10B981",
      Drama: "#8B5CF6",
    };

    return colorMap[genreName] || "#6B7280";
  };

  const fetchTrending = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/trending");
      const data = await response.json();
      trendingMovies.value = data.results;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    trendingMovies,
    genres,
    isLoading,
    error,
    getGenreNames,
    getGenreColor,
    fetchTrending,
  };
});

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

  // 🎬 MOVIES
  const getTrending = async (force = false) => {
    const cacheKey = "trending-movies-week";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    // Check cache first
    if (!force && isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        trending.value = cached;
        logger.log("✅ Using cached trending movies");
        return;
      }
    }

    // Check if request is already pending (deduplication)
    if (pendingRequests.has(cacheKey)) {
      logger.log("⏳ Waiting for pending trending movies request");
      trending.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // Create and store the promise for deduplication
      const promise = fetchTrendingMovies("week", 3);
      pendingRequests.set(cacheKey, promise);

      trending.value = await promise;

      // Cache the result
      setCached(cacheKey, trending.value);
      logger.log("✅ Fetched and cached trending movies");
    } catch (err: any) {
      logger.error("❌ Failed to fetch trending movies:", err);
      error.value = "Failed to fetch trending movies.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  const getTopRated = async () => {
    const cacheKey = "top-rated-movies";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    if (isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        topRated.value = cached;
        logger.log("✅ Using cached top rated movies");
        return;
      }
    }

    if (pendingRequests.has(cacheKey)) {
      topRated.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    try {
      const promise = fetchTopRatedMovies(3);
      pendingRequests.set(cacheKey, promise);
      topRated.value = await promise;
      setCached(cacheKey, topRated.value);
      logger.log("✅ Fetched and cached top rated movies");
    } catch (err: any) {
      logger.error("❌ Top rated movies failed:", err);
      error.value = "Failed to fetch top rated movies.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  const getUpcoming = async () => {
    const cacheKey = "upcoming-movies";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    if (isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        upcoming.value = cached;
        logger.log("✅ Using cached upcoming movies");
        return;
      }
    }

    if (pendingRequests.has(cacheKey)) {
      upcoming.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    try {
      const promise = fetchUpcomingMovies(3);
      pendingRequests.set(cacheKey, promise);
      upcoming.value = await promise;
      setCached(cacheKey, upcoming.value);
      logger.log("✅ Fetched and cached upcoming movies");
    } catch (err: any) {
      logger.error("❌ Upcoming movies failed:", err);
      error.value = "Failed to fetch upcoming movies.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  // 📺 TV
  const getTrendingTV = async (force = false) => {
    const cacheKey = "trending-tv-week";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    if (!force && isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        trendingTV.value = cached;
        logger.log("✅ Using cached trending TV");
        return;
      }
    }

    if (pendingRequests.has(cacheKey)) {
      trendingTV.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const promise = fetchTrendingTV("week", 3);
      pendingRequests.set(cacheKey, promise);
      trendingTV.value = await promise;
      setCached(cacheKey, trendingTV.value);
      logger.log("✅ Fetched and cached trending TV");
    } catch (err: any) {
      logger.error("❌ Failed to fetch trending TV:", err);
      error.value = "Failed to fetch trending TV shows.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  const getTopRatedTV = async () => {
    const cacheKey = "top-rated-tv";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    if (isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        topRatedTV.value = cached;
        logger.log("✅ Using cached top rated TV");
        return;
      }
    }

    if (pendingRequests.has(cacheKey)) {
      topRatedTV.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    try {
      const promise = fetchTopRatedTV(3);
      pendingRequests.set(cacheKey, promise);
      topRatedTV.value = await promise;
      setCached(cacheKey, topRatedTV.value);
      logger.log("✅ Fetched and cached top rated TV");
    } catch (err: any) {
      logger.error("❌ Top rated TV failed:", err);
      error.value = "Failed to fetch top rated TV shows.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  const getUpcomingTV = async () => {
    const cacheKey = "upcoming-tv";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    if (isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        upcomingTV.value = cached;
        logger.log("✅ Using cached upcoming TV");
        return;
      }
    }

    if (pendingRequests.has(cacheKey)) {
      upcomingTV.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    try {
      const promise = fetchOnTheAir(3);
      pendingRequests.set(cacheKey, promise);
      upcomingTV.value = await promise;
      setCached(cacheKey, upcomingTV.value);
      logger.log("✅ Fetched and cached upcoming TV");
    } catch (err: any) {
      logger.error("❌ Upcoming TV failed:", err);
      error.value = "Failed to fetch upcoming TV shows.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  const fetchTrendingMedia = async (
    timeWindow: string = "week",
    page: number = 1,
  ) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Use your env variable
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/all/${timeWindow}?page=${page}&api_key=${API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results; // Return the results array, not the full response
  };

  const getTrendingAll = async (force = false) => {
    const cacheKey = "trending-all-week";
    const { getCached, setCached, isCacheValid } = useMediaCache();

    if (!force && isCacheValid(cacheKey)) {
      const cached = getCached<Media[]>(cacheKey);
      if (cached) {
        trendingAll.value = cached;
        logger.log("✅ Using cached trending all");
        return;
      }
    }

    if (pendingRequests.has(cacheKey)) {
      trendingAll.value = await pendingRequests.get(cacheKey);
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // Fetch multiple pages to get 60+ items
      const promise = Promise.all([
        fetchTrendingMedia("week", 1),
        fetchTrendingMedia("week", 2),
        fetchTrendingMedia("week", 3),
      ]).then(([page1, page2, page3]) => {
        // Combine all results and remove duplicates based on id + media_type
        const allResults = [...page1, ...page2, ...page3];
        return allResults.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) => t.id === item.id && t.media_type === item.media_type,
            ),
        );
      });

      pendingRequests.set(cacheKey, promise);
      trendingAll.value = await promise;
      setCached(cacheKey, trendingAll.value);
      logger.log("✅ Fetched and cached trending all");
    } catch (err: any) {
      logger.error("❌ Combined trending failed:", err);
      error.value = "Failed to fetch combined media.";
    } finally {
      loading.value = false;
      pendingRequests.delete(cacheKey);
    }
  };

  const searchMulti = async (query: string, maxPages = 4) => {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      // Fetch multiple pages to get more search results (approximately 60 items)
      const results = await movieService.searchMulti(query, maxPages);
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
