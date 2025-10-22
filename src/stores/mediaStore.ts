// src/stores/movieStore.ts
import { defineStore } from "pinia";
import { useMedia } from "../composables/useMedia";
import type { Media } from "../types/media"; // ✅ Ensure Media includes media_type: "movie" | "tv"

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
    async searchMulti(query: string) {
      const { searchMulti, searchResults, error } = useMedia(); // ✅ use searchMulti instead of searchMulti
      if (!query.trim()) {
        this.searchResults = [];
        this.filteredResults = [];
        return;
      }

      this.searching = true;
      this.error = null;
      try {
        // 🔹 searchMulti should fetch both "movie" + "tv"
        await searchMulti(query);

        // Normalize results to always include media_type
        this.searchResults = searchResults.value.map((item: Media) => ({
          ...item,
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        }));

        this.applyFilters();
      } catch (err: any) {
        console.error("❌ Search failed:", err);
        this.error = error.value || "Search failed.";
      } finally {
        this.searching = false;
      }
    },

    // 🎛 Apply Filters (genre, year, rating, type)
    applyFilters() {
      this.filteredResults = this.searchResults.filter((media: Media) => {
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
    },
  },
});
