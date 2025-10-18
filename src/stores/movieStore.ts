import { defineStore } from "pinia";
import { useMovies } from "../composables/useMovie";
import { Movie } from "../types/Movie";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    trending: [] as Movie[],
    topRated: [] as Movie[],
    upcoming: [] as Movie[],
    searchResults: [] as Movie[],
    loading: false,
    searching: false,
    error: null as string | null,
    lastFetched: 0,
  }),

  getters: {
    hasMovies: (state) => state.trending.length > 0,
  },

  actions: {
    async loadMovies(force = false) {
      const {
        getTrending,
        getTopRated,
        getUpcoming,
        trending,
        topRated,
        upcoming,
        error,
      } = useMovies();

      const now = Date.now();
      const CACHE_TTL = 1000 * 60 * 10; // 10 min cache

      if (!force && this.hasMovies && now - this.lastFetched < CACHE_TTL)
        return;

      this.loading = true;
      this.error = null;

      try {
        await Promise.all([getTrending(), getTopRated(), getUpcoming()]);
        this.trending = trending.value;
        this.topRated = topRated.value;
        this.upcoming = upcoming.value;
        this.lastFetched = now;
      } catch (err: any) {
        console.error("❌ Failed to load movies:", err);
        this.error = error.value || "Failed to load movie data.";
      } finally {
        this.loading = false;
      }
    },

    async searchMovies(query: string) {
      const { searchMovies, searchResults, error } = useMovies();
      if (!query.trim()) {
        this.searchResults = [];
        return;
      }

      this.searching = true;
      this.error = null;
      try {
        await searchMovies(query);
        this.searchResults = searchResults.value;
      } catch (err: any) {
        console.error("❌ Search failed:", err);
        this.error = error.value || "Search failed.";
      } finally {
        this.searching = false;
      }
    },
  },
});
