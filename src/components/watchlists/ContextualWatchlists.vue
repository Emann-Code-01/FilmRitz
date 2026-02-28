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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-bold text-white">
        Suggested for your current vibe
      </h3>
      <span class="text-xs font-medium text-stone-500 uppercase tracking-widest"
        >Contextual Memory</span
      >
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-32 bg-stone-800/50 rounded-2xl animate-pulse"
      ></div>
    </div>

    <div
      v-else-if="watchlists.length === 0"
      class="p-8 border border-dashed border-white/10 rounded-2xl text-center"
    >
      <p class="text-stone-500 italic">
        No historical watchlists match this context yet.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="wl in watchlists"
        :key="wl.id"
        class="group p-5 bg-stone-900 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-stone-800/50 relative overflow-hidden"
      >
        <!-- Relevance Gauge -->
        <div class="absolute top-0 right-0 p-3">
          <div
            class="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"
            ></div>
            <span class="text-[10px] font-bold text-indigo-400"
              >{{ wl.relevance_score }}% Match</span
            >
          </div>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h4
              class="font-bold text-white group-hover:text-indigo-400 transition-colors"
            >
              {{ wl.name }}
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in wl.auto_tags"
                :key="tag"
                class="px-2 py-0.5 bg-white/5 text-[10px] text-stone-500 rounded-md border border-white/5"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-stone-600 font-mono uppercase"
                >Uses: {{ wl.usage_frequency }}</span
              >
            </div>

            <button
              @click="handleUse(wl.id)"
              class="px-4 py-2 bg-white/10 hover:bg-white text-stone-300 hover:text-black text-xs font-bold rounded-xl transition-all"
            >
              Use this now
            </button>
          </div>
        </div>

        <!-- Subtle Background Glow -->
        <div
          class="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-all"
        ></div>
      </div>
    </div>
  </div>
</template>
