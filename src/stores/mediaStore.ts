// src/stores/movieStore.ts
import { defineStore } from "pinia";
import { useMedia } from "../composables/useMedia";
import { Media } from "../types/media";

export const useMediatore = defineStore("movieStore", {
  state: () => ({
    trending: [] as Media[],
    topRated: [] as Media[],
    upcoming: [] as Media[],
    searchResults: [] as Media[],
    filteredResults: [] as Media[],
    loading: false,
    searching: false,
    error: null as string | null,
    lastFetched: 0,
    filter: {
      genre: null as number | null,
      type: "" as "movie" | "tv" | "",
      year: null as number | null,
      rating: 0,
    },
  }),

  getters: {
    hasMovies: (state) => state.trending.length > 0,
  },

  actions: {
    async loadMovies(force = false) {
      const { getTrending, getTopRated, getUpcoming, trending, topRated, upcoming, error } = useMedia();
      const now = Date.now();
      const CACHE_TTL = 1000 * 60 * 10;

      if (!force && this.hasMovies && now - this.lastFetched < CACHE_TTL) return;

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
      const { searchMovies, searchResults, error } = useMedia();
      if (!query.trim()) {
        this.searchResults = [];
        this.filteredResults = [];
        return;
      }

      this.searching = true;
      this.error = null;
      try {
        await searchMovies(query);
        this.searchResults = searchResults.value;
        this.applyFilters();
      } catch (err: any) {
        console.error("❌ Search failed:", err);
        this.error = error.value || "Search failed.";
      } finally {
        this.searching = false;
      }
    },

    applyFilters() {
      this.filteredResults = this.searchResults.filter((movie) => {
        if (this.filter.genre && !movie.genre_ids?.includes(this.filter.genre)) return false;
        if (this.filter.year && new Date((movie.release_date || "").slice(0, 10)).getFullYear() !== this.filter.year) return false;
        if (this.filter.rating && movie.vote_average < this.filter.rating) return false;
        // Use normalized media_type
        if (this.filter.type && movie.media_type !== this.filter.type) return false;
        return true;
      });
    },
  },
});
