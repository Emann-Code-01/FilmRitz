/**
 * Utility for perceived performance and prefetching
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

/**
 * Simple debounce function for search/filter inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Cache Strategy: Simple LRU Cache placeholder
 */
const cache = new Map<string, { data: any; ttl: number }>();

export const getCachedData = (key: string) => {
  const item = cache.get(key);
  if (item && item.ttl > Date.now()) {
    return item.data;
  }
  return null;
};

export const setCachedData = (
  key: string,
  data: any,
  ttlSeconds: number = 300,
) => {
  cache.set(key, {
    data,
    ttl: Date.now() + ttlSeconds * 1000,
  });
};
