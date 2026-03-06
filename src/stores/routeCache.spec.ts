import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRouteCacheStore, ROUTE_CACHE_TTL } from "./routeCache";

describe("routeCache store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("isPrefetched returns false for stale entry and removes it", () => {
    const store = useRouteCacheStore();
    const key = 'MovieDetails:{"id":1}';
    // simulate old timestamp
    const oldTs = Date.now() - ROUTE_CACHE_TTL - 1000;
    store.prefetchedRoutes.set(key, oldTs);

    const result = store.isPrefetched("MovieDetails", { id: 1 });
    expect(result).toBe(false);
    expect(store.prefetchedRoutes.has(key)).toBe(false);
  });

  it("isPrefetched returns true for fresh entry", () => {
    const store = useRouteCacheStore();
    const key = 'MovieDetails:{"id":2}';
    store.prefetchedRoutes.set(key, Date.now());

    const result = store.isPrefetched("MovieDetails", { id: 2 });
    expect(result).toBe(true);
  });
});
