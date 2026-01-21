/**
 * Enhanced LRU (Least Recently Used) Cache Implementation
 * Prevents memory leaks with size limits and provides cache statistics
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class LRUCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttl: number;
  private hits = 0;
  private misses = 0;

  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  private evictOldest() {
    if (this.cache.size < this.maxSize) return;

    // Find least recently used entry
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Update access count and timestamp (LRU)
    entry.accessCount++;
    entry.timestamp = Date.now();
    this.hits++;

    return entry.data;
  }

  set(key: string, data: T): void {
    this.evictOldest();

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }
}

// Global cache instance
const mediaCache = new LRUCache(100, 10 * 60 * 1000); // 100 items, 10 min TTL

export const useMediaCache = () => {
  const isCacheValid = (key: string): boolean => {
    return mediaCache.has(key);
  };

  const getCached = <T = any>(key: string): T | null => {
    return mediaCache.get(key);
  };

  const setCached = <T = any>(key: string, data: T): void => {
    mediaCache.set(key, data);
  };

  const invalidate = (key: string): void => {
    mediaCache.invalidate(key);
  };

  const invalidatePattern = (pattern: string): void => {
    mediaCache.invalidatePattern(pattern);
  };

  const clearCache = (): void => {
    mediaCache.clear();
  };

  const getStats = (): CacheStats => {
    return mediaCache.getStats();
  };

  return {
    isCacheValid,
    getCached,
    setCached,
    invalidate,
    invalidatePattern,
    clearCache,
    getStats,
  };
};

export default useMediaCache;
