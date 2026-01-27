<script setup lang="ts">
import {
  SparklesIcon,
  ClockIcon,
  PuzzlePieceIcon,
} from "@heroicons/vue/24/outline";
import type { IntelligenceContext } from "@/types/intelligence";

interface Props {
  context: IntelligenceContext;
}

defineProps<Props>();

const getTrendingColor = (reason: string) => {
  if (reason.includes("Award"))
    return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (reason.includes("Finale"))
    return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (reason.includes("Actor"))
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (reason.includes("Cultural"))
    return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  return "bg-white/10 text-white/70 border-white/20";
};
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Why Trending Badges -->
    <div
      v-for="reason in context.whyTrending"
      :key="reason"
      :class="[
        'flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 hover:scale-105',
        getTrendingColor(reason),
      ]"
    >
      <SparklesIcon class="w-3 h-3 mr-1" />
      {{ reason }}
    </div>

    <!-- Mood & Tone Chips -->
    <div
      v-for="mood in [...context.mood, ...context.tone]"
      :key="mood"
      class="flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-default"
    >
      {{ mood }}
    </div>

    <!-- Complexity Chip -->
    <div
      v-if="context.complexity"
      class="flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
    >
      <PuzzlePieceIcon class="w-3 h-3 mr-1" />
      {{ context.complexity }}
    </div>

    <!-- Commitment Chip -->
    <div
      v-if="context.commitment.label"
      class="flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50 border border-white/10"
    >
      <ClockIcon class="w-3 h-3 mr-1" />
      {{ context.commitment.label }}
    </div>
  </div>
</template>
