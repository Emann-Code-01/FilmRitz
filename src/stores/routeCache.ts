import { defineStore } from "pinia";
import { ref } from "vue";
import { IntelligenceService } from "@/services/intelligenceService";

// duration in milliseconds to keep a prefetched entry before it is considered stale
export const ROUTE_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const useRouteCacheStore = defineStore("routeCache", () => {
  // map of cacheKey -> timestamp of when it was added
  const prefetchedRoutes = ref<Map<string, number>>(new Map());

  /**
   * Prefetch data for a specific route based on its parameters
   * This reduces perceived latency by having the data ready before navigation
   */
  const prefetchData = async (
    routeName: string,
    params: Record<string, any>,
  ) => {
    const cacheKey = `${routeName}:${JSON.stringify(params)}`;
    const now = Date.now();

    // evict expired entries before checking
    for (const [key, ts] of prefetchedRoutes.value.entries()) {
      if (now - ts > ROUTE_CACHE_TTL) {
        prefetchedRoutes.value.delete(key);
      }
    }

    if (prefetchedRoutes.value.has(cacheKey)) return;

    console.log(`[Prefetch] Fetching data for ${routeName}...`);

    try {
      if (routeName === "MovieDetails" || routeName === "TVShowDetails") {
        const id = params.id;
        const type = routeName === "MovieDetails" ? "movie" : "tv";
        if (id) {
          await IntelligenceService.fetch(`/${type}/${id}`);
          await IntelligenceService.fetch(`/${type}/${id}/videos`);
          await IntelligenceService.fetch(`/${type}/${id}/credits`);
        }
      } else if (routeName === "Trending") {
        await IntelligenceService.fetch("/trending/all/week");
      }

      prefetchedRoutes.value.set(cacheKey, Date.now());
    } catch (err) {
      console.warn(`[Prefetch] Failed for ${routeName}`, err);
    }
  };

  const clearCache = (routeName?: string, params?: Record<string, any>) => {
    if (routeName && params) {
      const key = `${routeName}:${JSON.stringify(params)}`;
      prefetchedRoutes.value.delete(key);
    } else {
      prefetchedRoutes.value.clear();
    }
  };

  const isPrefetched = (routeName: string, params: Record<string, any>) => {
    const key = `${routeName}:${JSON.stringify(params)}`;
    const ts = prefetchedRoutes.value.get(key);
    if (!ts) return false;
    if (Date.now() - ts > ROUTE_CACHE_TTL) {
      prefetchedRoutes.value.delete(key);
      return false;
    }
    return true;
  };

  return {
    prefetchedRoutes,
    prefetchData,
    clearCache,
    isPrefetched,
  };
});
