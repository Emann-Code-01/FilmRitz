import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "./auth";

export interface FeatureFlagConfig {
  enabled: boolean;
  percentage?: number; // 0-100
  allowedUsers?: string[]; // email whitelist
  forceOff?: boolean; // Global kill switch
}

export const useFeatureFlagsStore = defineStore("featureFlags", () => {
  const authStore = useAuthStore();

  // load persisted config if available
  const persisted = localStorage.getItem("featureFlagConfigs");
  const flagConfigs = ref<Record<string, FeatureFlagConfig>>(persisted
    ? JSON.parse(persisted)
    : {
        trustWeightedRatings: { enabled: true, percentage: 100 },
        intelligenceChips: { enabled: true, percentage: 100 },
        routeCaching: { enabled: true, percentage: 50 },
        whyTrendingBadges: { enabled: true },
        dataNormalization: { enabled: true },
        toneMoodChips: { enabled: true },
        intentAwareFilters: { enabled: false }, // Phase 2
        visualSimilaritySearch: { enabled: false },
        relationshipGraph: { enabled: false },
      }
  );

  // load server flags and merge on start
  async function loadServerFlags() {
    try {
      const rows = await import('@/services/featureFlagService').then(m => m.featureFlagService.fetchAll());
      rows.forEach((r: any) => {
        flagConfigs.value[r.name] = {
          enabled: r.enabled,
          percentage: r.percentage ?? undefined,
          allowedUsers: r.allowed_users ?? undefined,
          forceOff: r.force_off || false,
        };
      });
    } catch (e) {
      console.warn('Failed to load server flags', e);
    }
  }
  loadServerFlags();

  // watch for changes and persist
  watch(
    () => flagConfigs.value,
    (newVal) => {
      localStorage.setItem("featureFlagConfigs", JSON.stringify(newVal));
    },
    { deep: true }
  );

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

  const setFlagConfig = async (
    flagName: string,
    config: Partial<FeatureFlagConfig>,
  ) => {
    if (flagConfigs.value[flagName]) {
      flagConfigs.value[flagName] = {
        ...flagConfigs.value[flagName],
        ...config,
      };
      // persist to localStorage
      localStorage.setItem("featureFlagConfigs", JSON.stringify(flagConfigs.value));
      // send update to backend (only if user is admin?)
      try {
        await import('@/services/featureFlagService').then(m =>
          m.featureFlagService.upsert({
            name: flagName,
            enabled: flagConfigs.value[flagName].enabled,
            percentage: flagConfigs.value[flagName].percentage ?? null,
            allowed_users: flagConfigs.value[flagName].allowedUsers || null,
            force_off: flagConfigs.value[flagName].forceOff || false,
          }),
        );
      } catch (e) {
        console.warn('failed to update flag on server', e);
      }
    }
  };

  return {
    flags,
    flagConfigs,
    isEnabled,
    setFlagConfig,
  };
});
