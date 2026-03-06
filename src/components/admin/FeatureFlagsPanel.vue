<template>
  <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
    <h2 class="text-xl font-semibold mb-4">Feature Flags</h2>
    <div class="space-y-4">
      <div
        v-for="(config, key) in flagConfigs"
        :key="key"
        class="flex items-center justify-between"
      >
        <span class="capitalize">{{ key }}</span>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="config.enabled"
            @change="toggleFlag(key)"
            class="h-4 w-4"
          />
          <button
            v-if="config.percentage !== undefined"
            class="text-xs text-gray-400 hover:underline"
            @click="adjustPercentage(key)"
          >
            {{ config.percentage }}%
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFeatureFlagsStore } from "@/stores/featureFlags";

const flagsStore = useFeatureFlagsStore();
const flagConfigs = flagsStore.flagConfigs;

function toggleFlag(flag: string) {
  const current = flagConfigs[flag];
  if (current) {
    flagsStore.setFlagConfig(flag, { enabled: !current.enabled });
  }
}

function adjustPercentage(flag: string) {
  const current = flagConfigs[flag];
  const input = prompt(
    "Enter rollout percentage (0-100)",
    String(current.percentage || 0),
  );
  const num = parseInt(input || "", 10);
  if (!isNaN(num)) {
    flagsStore.setFlagConfig(flag, {
      percentage: Math.min(100, Math.max(0, num)),
    });
  }
}
</script>
