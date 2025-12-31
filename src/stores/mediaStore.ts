// src/stores/movieStore.ts
import { defineStore } from "pinia";
import { useMedia } from "@/composables/useMedia";
import type { Media } from "@/types/media"; // ✅ Ensure Media includes media_type: "movie" | "tv"

export const useMediaStore = defineStore("movieStore", {
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
      sort: "" as "newest" | "oldest" | "",
    },
    currentPage: 1,
    totalPages: 1,
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
      } = useMedia();

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

    // 🔎 Unified Search for both Movies + TV shows
    async searchMulti(query: string, maxPages = 3) {
      const { searchMulti, searchResults, error } = useMedia();

      if (!query.trim()) {
        this.searchResults = [];
        return;
      }

      this.searching = true;
      this.error = null;

      try {
        // Fetch multiple pages to get more results (approximately 60 items)
        await searchMulti(query, maxPages);
        this.searchResults = searchResults.value;
      } catch (err: any) {
        console.error("❌ Search failed:", err);
        this.error = error.value || "Search failed.";
      } finally {
        this.searching = false;
      }
    },

    // 🎛 Apply Filters (genre, year, rating, type)
    applyFilters() {
      let results = this.searchResults.filter((media: Media) => {
        const { genre, year, rating, type } = this.filter;

        if (genre && !media.genre_ids?.includes(genre)) return false;

        const releaseYear =
          media.release_date?.slice(0, 4) ||
          media.first_air_date?.slice(0, 4) ||
          null;

        if (year && releaseYear !== String(year)) return false;

        if (rating && media.vote_average < rating) return false;

        if (type && media.media_type !== type) return false;

        return true;
      });

      // ✅ Sort by newest/oldest
      if (this.filter.sort === "newest") {
        results = results.sort((a, b) => {
          const dateA =
            new Date(a.release_date || a.first_air_date || 0).getTime() || 0;
          const dateB =
            new Date(b.release_date || b.first_air_date || 0).getTime() || 0;
          return dateB - dateA; // newest first
        });
      } else if (this.filter.sort === "oldest") {
        results = results.sort((a, b) => {
          const dateA =
            new Date(a.release_date || a.first_air_date || 0).getTime() || 0;
          const dateB =
            new Date(b.release_date || b.first_air_date || 0).getTime() || 0;
          return dateA - dateB; // oldest first
        });
      }

      this.filteredResults = results;
    },
  },
});
