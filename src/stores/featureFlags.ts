import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export interface FeatureFlagConfig {
  enabled: boolean;
  percentage?: number; // 0-100
  allowedUsers?: string[]; // email whitelist
  forceOff?: boolean; // Global kill switch
}

export const useFeatureFlagsStore = defineStore("featureFlags", () => {
  const authStore = useAuthStore();

  const flagConfigs = ref<Record<string, FeatureFlagConfig>>({
    trustWeightedRatings: { enabled: true, percentage: 100 },
    intelligenceChips: { enabled: true, percentage: 100 },
    routePrefetching: { enabled: true, percentage: 50 },
    whyTrendingBadges: { enabled: true },
    dataNormalization: { enabled: true },
    toneMoodChips: { enabled: true },
    intentAwareFilters: { enabled: false }, // Phase 2
    visualSimilaritySearch: { enabled: false },
    relationshipGraph: { enabled: false },
  });

  // Basic flags object for backward compatibility and template usage
  const flags = computed(() => {
    const result: Record<string, boolean> = {};
    for (const [key, config] of Object.entries(flagConfigs.value)) {
      result[key] = evaluateFlag(config);
    }
    return result;
  });

  function evaluateFlag(config: FeatureFlagConfig): boolean {
    if (config.forceOff) return false;
    if (!config.enabled) return false;

    // Per-user whitelist
    if (config.allowedUsers && config.allowedUsers.length > 0) {
      const userEmail = authStore.user?.email;
      if (userEmail && config.allowedUsers.includes(userEmail)) return true;
      if (config.allowedUsers.length > 0) return false; // If whitelist exists, only allow whitelisted
    }

    // Percentage rollout
    if (config.percentage !== undefined) {
      if (config.percentage >= 100) return true;
      if (config.percentage <= 0) return false;

      // Use user ID or a random seed for consistent experience
      const seed = authStore.user?.id || Math.random() * 1000;
      const userBucket = Number(seed) % 100;
      return userBucket < config.percentage;
    }

    return config.enabled;
  }

  const isEnabled = (flagName: string) => {
    return computed(() => flags.value[flagName] ?? false);
  };

  const setFlagConfig = (
    flagName: string,
    config: Partial<FeatureFlagConfig>,
  ) => {
    if (flagConfigs.value[flagName]) {
      flagConfigs.value[flagName] = {
        ...flagConfigs.value[flagName],
        ...config,
      };
    }
  };

  return {
    flags,
    flagConfigs,
    isEnabled,
    setFlagConfig,
  };
});
