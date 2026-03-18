<script setup lang="ts">
import { WatchlistWithContextResponse } from "@/types/api.types";

defineProps<{
  watchlists: WatchlistWithContextResponse[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "use", id: string): void;
}>();

const handleUse = (id: string) => {
  emit("use", id);
};
</script>

<template>
  <div
    class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000"
  >
    <div class="flex items-center justify-between border-b border-white/5 pb-6">
      <div class="space-y-1">
        <h3
          class="text-2xl font-[Gilroy-Bold] text-white flex items-center gap-3"
        >
          <span class="text-xl">⚡</span>
          Contextual Memory
        </h3>
        <p
          class="text-xs font-medium text-stone-500 uppercase tracking-[0.2em]"
        >
          Pattern-matched against your current vibe
        </p>
      </div>

      <div
        class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-filmritz-primary/10 border border-filmritz-primary/20 rounded-full"
      >
        <div
          class="w-1.5 h-1.5 rounded-full bg-filmritz-primary animate-pulse"
        ></div>
        <span
          class="text-[9px] font-black text-filmritz-primary uppercase tracking-widest"
          >Active Scan</span
        >
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-44 bg-stone-900/40 border border-white/5 rounded-3xl animate-pulse"
      ></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="watchlists.length === 0"
      class="p-12 border border-dashed border-white/10 rounded-[2.5rem] text-center bg-stone-900/20 flex flex-col items-center gap-4 group hover:bg-stone-900/40 transition-all"
    >
      <div
        class="text-4xl opacity-20 group-hover:opacity-40 transition-opacity grayscale"
      >
        🛸
      </div>
      <p
        class="text-stone-500 font-[Gilroy-Medium] text-sm max-w-xs leading-relaxed italic"
      >
        "Your historical intent doesn't match this exact vibe yet. A new memory
        path begins."
      </p>
    </div>

    <!-- Watchlists Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="wl in watchlists"
        :key="wl.id"
        class="group p-6 glass-card hover:border-filmritz-primary/40 transition-all duration-700 hover:bg-white/10 relative overflow-hidden flex flex-col justify-between"
      >
        <!-- Top Metadata -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in wl.auto_tags.slice(0, 2)"
              :key="tag"
              class="px-2.5 py-1 bg-white/5 text-[9px] text-stone-400 font-black uppercase tracking-wider rounded-lg border border-white/10"
            >
              #{{ tag }}
            </span>
          </div>

          <div
            class="px-2 py-1 rounded-lg text-[10px] font-black text-filmritz-primary bg-filmritz-primary/5 transition-all group-hover:bg-filmritz-primary group-hover:text-white"
          >
            {{ wl.relevance_score }}% Match
          </div>
        </div>

        <!-- content Info -->
        <div class="space-y-4">
          <div class="space-y-2">
            <h4 class="text-xl font-[Gilroy-Bold] text-white leading-tight">
              {{ wl.name }}
            </h4>
            <p
              class="text-[10px] text-stone-500 font-mono uppercase tracking-widest"
            >
              Memory strength: {{ wl.usage_frequency }} sessions
            </p>
          </div>

          <button @click="handleUse(wl.id)" class="btn-secondary py-3 text-xs">
            Reconnect Pattern
          </button>
        </div>

        <!-- Abstract Visual Accent -->
        <div
          class="absolute -bottom-16 -right-16 w-32 h-32 bg-filmritz-primary/5 blur-[50px] rounded-full group-hover:bg-filmritz-primary/15 transition-all duration-1000"
        ></div>

        <div
          class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-filmritz-primary via-filmritz-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        ></div>
      </div>
    </div>
  </div>
</template>
