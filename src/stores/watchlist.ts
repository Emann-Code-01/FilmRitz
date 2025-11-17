// src/stores/watchlist.ts
import { defineStore } from "pinia";

export interface WatchItem {
  id: number;
  title: string; // For movies and normalized title for tv
  name?: string; // Original tv name (optional)
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string; // release_date or first_air_date normalized into this
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  original_language?: string;
  type?: "movie" | "tv";
  trailerUrl?: string;
  addedToWatchlist?: boolean;
  rating?: number;
  media_type: "movie" | "tv";
}

export const useWatchlistStore = defineStore("watchlist", {
  state: () => ({
    items: [] as WatchItem[],
  }),
  actions: {
    addToWatchlist(item: WatchItem) {
      if (!this.items.find(i => i.id === item.id)) {
        this.items.push(item);
        this.saveToLocalStorage();
      }
    },
    removeFromWatchlist(id: number) {
      this.items = this.items.filter(i => i.id !== id);
      this.saveToLocalStorage();
    },
    isInWatchlist(id: number) {
      return this.items.some(i => i.id === id);
    },
    loadFromLocalStorage() {
      const stored = localStorage.getItem("filmritz-watchlist");
      if (stored) this.items = JSON.parse(stored);
    },
    saveToLocalStorage() {
      localStorage.setItem("filmritz-watchlist", JSON.stringify(this.items));
    },
  },
});
