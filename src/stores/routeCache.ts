import { defineStore } from "pinia";
import { ref } from "vue";
import { IntelligenceService } from "@/services/intelligenceService";

export const useRouteCacheStore = defineStore("routeCache", () => {
  const prefetchedRoutes = ref<Set<string>>(new Set());

  /**
   * Prefetch data for a specific route based on its parameters
   * This reduces perceived latency by having the data ready before navigation
   */
  const prefetchData = async (
    routeName: string,
    params: Record<string, any>,
  ) => {
    const cacheKey = `${routeName}:${JSON.stringify(params)}`;
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

      prefetchedRoutes.value.add(cacheKey);
    } catch (err) {
      console.warn(`[Prefetch] Failed for ${routeName}`, err);
    }
  };

  const clearCache = () => {
    prefetchedRoutes.value.clear();
  };

  return {
    prefetchedRoutes,
    prefetchData,
    clearCache,
  };
});
