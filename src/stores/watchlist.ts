// src/stores/watchlist.ts
import { defineStore } from "pinia";
import { WatchItem } from "@/types/media";

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
