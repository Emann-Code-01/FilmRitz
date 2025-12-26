import { ref } from "vue";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCachedMedia = () => {
  const isCacheValid = (key: string): boolean => {
    const cached = cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  const getCached = (key: string) => cache.get(key)?.data;
  const setCached = (key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
  };

  return { isCacheValid, getCached, setCached };
};
