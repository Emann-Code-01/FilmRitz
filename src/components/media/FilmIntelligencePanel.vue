<script setup lang="ts">
import {
  SparklesIcon,
  HeartIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import type { Media } from "@/types/media";

interface Props {
  media: Media;
}

defineProps<Props>();
</script>

<template>
  <div
    class="intelligence-panel bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
  >
    <!-- Header -->
    <div
      class="p-4 border-b border-white/10 bg-linear-to-r from-[#b20710]/20 to-transparent"
    >
      <div class="flex items-center gap-2">
        <SparklesIcon class="w-5 h-5 text-[#b20710]" />
        <h3 class="font-[Gilroy-Bold] text-white tracking-wide">
          Film Intelligence
        </h3>
      </div>
    </div>

    <!-- Sections -->
    <div class="p-6 space-y-8">
      <!-- Why This Works For You -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white/80">
            <HeartIcon class="w-4 h-4" />
            <h4 class="text-sm font-[Gilroy-Bold] uppercase tracking-wider">
              Why This Works For You
            </h4>
          </div>
          <span
            class="text-[10px] text-white/40 font-bold uppercase tracking-widest"
            >98% Recommendation Match</span
          >
        </div>
        <div class="grid grid-cols-1 gap-2">
          <div
            class="h-16 rounded-xl border border-white/5 bg-white/5 animate-pulse"
          ></div>
        </div>
      </section>

      <!-- Similar Feelings / Vibes -->
      <section class="space-y-3">
        <div class="flex items-center gap-2 text-white/80">
          <SparklesIcon class="w-4 h-4" />
          <h4 class="text-sm font-[Gilroy-Bold] uppercase tracking-wider">
            Similar Feelings / Vibes
          </h4>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="i in 3"
            :key="i"
            class="h-8 w-24 rounded-full border border-white/5 bg-white/5 animate-pulse"
          ></div>
        </div>
      </section>

      <!-- Commitment Breakdown -->
      <section class="space-y-3">
        <div class="flex items-center gap-2 text-white/80">
          <ClockIcon class="w-4 h-4" />
          <h4 class="text-sm font-[Gilroy-Bold] uppercase tracking-wider">
            Commitment Breakdown
          </h4>
        </div>
        <div class="space-y-2">
          <div class="h-4 w-full rounded-full bg-white/5 overflow-hidden">
            <div class="h-full bg-[#b20710]/40 w-1/3 animate-pulse"></div>
          </div>
          <div
            class="flex justify-between text-[10px] text-white/40 font-medium uppercase tracking-widest"
          >
            <span>Setup</span>
            <span>Climax</span>
            <span>Resolution</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Action -->
    <button
      class="w-full p-4 text-center border-t border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group"
    >
      <span
        class="text-xs font-[Gilroy-Bold] text-white/60 group-hover:text-white uppercase tracking-widest"
        >Deep Dive into Narrative Graph</span
      >
      <ChevronRightIcon
        class="w-4 h-4 text-white/40 group-hover:text-[#b20710] transition-colors"
      />
    </button>
  </div>
</template>

<style scoped>
.intelligence-panel {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
