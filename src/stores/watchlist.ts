// src/stores/watchlist.ts
import { defineStore } from "pinia";
import { WatchItem } from "@/types/media";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "./auth";

export const useWatchlistStore = defineStore("watchlist", {
  state: () => ({
    items: [] as WatchItem[],
    syncing: false,
  }),
  actions: {
    async addToWatchlist(item: WatchItem) {
      if (!this.items.find(i => i.id === item.id)) {
        this.items.push(item);
        await this.syncToCloud();
      }
    },
    async removeFromWatchlist(id: number) {
      this.items = this.items.filter(i => i.id !== id);
      await this.syncToCloud();
    },
    isInWatchlist(id: number) {
      return this.items.some(i => i.id === id);
    },
    async loadFromLocalStorage() {
      const stored = localStorage.getItem("filmritz-watchlist");
      if (stored) this.items = JSON.parse(stored);
    },
    saveToLocalStorage() {
      localStorage.setItem("filmritz-watchlist", JSON.stringify(this.items));
    },
    async loadFromCloud() {
      const authStore = useAuthStore();
      if (!authStore.user?.id) return;

      try {
        this.syncing = true;
        const { data, error } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", authStore.user.id);

        if (error) {
          console.error("Error loading watchlist from cloud:", error);
          await this.loadFromLocalStorage();
        } else {
          this.items = (data || []).map((item: any) => JSON.parse(item.item_data));
          this.saveToLocalStorage();
        }
      } catch (err) {
        console.error("Exception loading watchlist:", err);
        await this.loadFromLocalStorage();
      } finally {
        this.syncing = false;
      }
    },
    async syncToCloud() {
      const authStore = useAuthStore();
      if (!authStore.user?.id) {
        this.saveToLocalStorage();
        return;
      }

      try {
        this.syncing = true;
        
        // Delete existing watchlist for this user
        await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", authStore.user.id);

        // Insert current watchlist
        if (this.items.length > 0) {
          const itemsToInsert = this.items.map((item) => ({
            user_id: authStore.user.id,
            tmdb_id: item.id,
            media_type: item.media_type,
            item_data: JSON.stringify(item),
          }));

          const { error } = await supabase
            .from("watchlist")
            .insert(itemsToInsert);

          if (error) {
            console.error("Error syncing watchlist to cloud:", error);
            this.saveToLocalStorage();
          } else {
            this.saveToLocalStorage();
          }
        } else {
          this.saveToLocalStorage();
        }
      } catch (err) {
        console.error("Exception syncing watchlist:", err);
        this.saveToLocalStorage();
      } finally {
        this.syncing = false;
      }
    },
  },
});
