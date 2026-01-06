// src/services/mediaRotation.ts
import { 
  fetchTrendingMedia, 
  fetchPopularMedia, 
  fetchTopRatedMedia, 
  fetchUpcomingMedia,
  fetchAllTrailers,
  type TrailerData
} from "@/api/tmdb";
import type { Media } from "@/types/media";

const ROTATION_SIZE = 12;
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

interface CacheEntry<T> {
  timestamp: number;
  items: T[];
}

// Cache keys for different categories
const CACHE_KEYS = {
  trending: "filmritz_trending_rotation",
  popular: "filmritz_popular_rotation",
  topRated: "filmritz_toprated_rotation",
  upcoming: "filmritz_upcoming_rotation",
  trailers: "filmritz_trailers_rotation",
} as const;

// Generic rotation function
async function getRotatedMedia<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T[]>,
  rotationSize: number = ROTATION_SIZE,
  weightedSlice: number = 30
): Promise<T[]> {
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed: CacheEntry<T> = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.items;
      }
    } catch (error) {
      console.error(`Failed to parse cache for ${cacheKey}:`, error);
      localStorage.removeItem(cacheKey);
    }
  }

  // Fetch fresh data
  const allItems = await fetchFunction();

  // Bias toward top results, but rotate
  const weighted = allItems.slice(0, weightedSlice);
  const rotated = shuffle(weighted).slice(0, rotationSize);

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: Date.now(),
      items: rotated,
    })
  );

  return rotated;
}

// Fisher–Yates shuffle (safe & unbiased)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ======================== PUBLIC API ========================

export async function getRotatedTrending(): Promise<Media[]> {
  return getRotatedMedia(
    CACHE_KEYS.trending,
    () => fetchTrendingMedia("week", 2),
    ROTATION_SIZE,
    30
  );
}

export async function getRotatedPopular(): Promise<Media[]> {
  return getRotatedMedia(
    CACHE_KEYS.popular,
    () => fetchPopularMedia(2),
    ROTATION_SIZE,
    30
  );
}

export async function getRotatedTopRated(): Promise<Media[]> {
  return getRotatedMedia(
    CACHE_KEYS.topRated,
    () => fetchTopRatedMedia(2),
    ROTATION_SIZE,
    30
  );
}

export async function getRotatedUpcoming(): Promise<Media[]> {
  return getRotatedMedia(
    CACHE_KEYS.upcoming,
    () => fetchUpcomingMedia(2),
    ROTATION_SIZE,
    30
  );
}

export async function getRotatedTrailers(): Promise<TrailerData[]> {
  return getRotatedMedia(
    CACHE_KEYS.trailers,
    fetchAllTrailers,
    15, // Fewer trailers since they're heavier content
    30
  );
}

/**
 * Clear all rotation caches (useful for manual refresh)
 */
export function clearRotationCache(category?: keyof typeof CACHE_KEYS): void {
  if (category) {
    localStorage.removeItem(CACHE_KEYS[category]);
  } else {
    // Clear all caches
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

/**
 * Check if cache is still valid for a category
 */
export function isCacheValid(category: keyof typeof CACHE_KEYS): boolean {
  const cached = localStorage.getItem(CACHE_KEYS[category]);
  if (!cached) return false;

  try {
    const parsed: CacheEntry<any> = JSON.parse(cached);
    return Date.now() - parsed.timestamp < CACHE_TTL;
  } catch {
    return false;
  }
}