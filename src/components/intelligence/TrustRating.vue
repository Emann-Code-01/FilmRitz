<script setup lang="ts">
import { computed } from "vue";
import { StarIcon } from "@heroicons/vue/24/solid";
import {
  ShieldCheckIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import type { TrustRating } from "@/types/intelligence";

interface Props {
  rating: number;
  trust: TrustRating;
}

const props = defineProps<Props>();

const ratingColorClass = computed(() => {
  if (props.rating >= 8) return "text-emerald-400";
  if (props.rating >= 6) return "text-amber-400";
  return "text-rose-400";
});

const trustStyles = computed(() => {
  switch (props.trust.confidence) {
    case "high":
      return {
        container: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
        icon: "text-emerald-500",
        badge: "bg-emerald-500/10 border-emerald-500/20",
      };
    case "medium":
      return {
        container: "bg-blue-500/5 border-blue-500/30 text-blue-400",
        icon: "text-blue-500",
        badge: "bg-blue-500/5 border-blue-500/20",
      };
    case "low":
      return {
        container: "bg-white/5 border-white/10 border-dashed text-white/40",
        icon: "text-white/20",
        badge: "bg-white/5 border-white/10",
      };
    default:
      return {
        container: "bg-white/5 border-white/10",
        icon: "text-white/40",
        badge: "bg-white/5 border-white/10",
      };
  }
});

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};
</script>

<template>
  <div class="flex flex-col gap-1 group cursor-default">
    <div class="flex items-center gap-2">
      <!-- Star Rating -->
      <div
        class="flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"
      >
        <StarIcon class="w-4 h-4 mr-1" :class="ratingColorClass" />
        <span class="text-lg font-bold tracking-tight text-white">{{
          rating.toFixed(1)
        }}</span>
      </div>

      <!-- Trust Indicator (Visual Confidence Hierarchy) -->
      <div
        class="flex items-center px-2 py-1 rounded-lg border transition-all duration-300"
        :class="trustStyles.container"
      >
        <ShieldCheckIcon class="w-4 h-4 mr-1" :class="trustStyles.icon" />
        <span class="text-xs font-medium"
          >{{ formatNumber(trust.voteCount) }} reviews</span
        >
      </div>
    </div>

    <!-- Explainability Layer -->
    <div class="mt-1">
      <div
        class="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
      >
        <InformationCircleIcon class="w-3.5 h-3.5" :class="trustStyles.icon" />
        <span
          class="text-[10px] uppercase tracking-widest font-bold"
          :class="trustStyles.container"
        >
          {{ trust.confidence }} Confidence
        </span>
      </div>

      <!-- Reason (Explainability Tooltip-like behavior) -->
      <p
        class="text-[10px] text-white/30 font-medium leading-tight mt-0.5 max-w-[200px] hidden group-hover:block animate-in fade-in slide-in-from-top-1"
      >
        {{ trust.confidenceReason }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
</style>
