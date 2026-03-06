import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFeatureFlagsStore } from "./featureFlags";
import { featureFlagService } from "@/services/featureFlagService";

vi.mock("@/services/featureFlagService", () => ({
  featureFlagService: {
    fetchAll: vi
      .fn()
      .mockResolvedValue([
        {
          name: "testFlag",
          enabled: true,
          percentage: 50,
          allowed_users: null,
          force_off: false,
        },
      ]),
    upsert: vi.fn().mockResolvedValue(null),
  },
}));

describe("featureFlags store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("loads server flags on init", async () => {
    const store = useFeatureFlagsStore();
    // await a tick to allow loadServerFlags to complete
    await new Promise((r) => setTimeout(r, 0));
    expect(store.flagConfigs.testFlag.enabled).toBe(true);
    expect(store.flagConfigs.testFlag.percentage).toBe(50);
  });

  it("setFlagConfig updates and calls service", async () => {
    const store = useFeatureFlagsStore();
    await store.setFlagConfig("trustWeightedRatings", { enabled: false });
    expect(store.flagConfigs.trustWeightedRatings.enabled).toBe(false);
    expect(featureFlagService.upsert).toHaveBeenCalled();
  });
});
