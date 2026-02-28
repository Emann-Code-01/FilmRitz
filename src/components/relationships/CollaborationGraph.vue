<script setup lang="ts">
defineProps<{
  nodes: { id: number; label: string; type: string }[];
  edges: { from: number; to: number; weight: number; label: string }[];
  loading?: boolean;
}>();
</script>

<template>
  <div
    class="p-6 bg-stone-900 border border-white/5 rounded-3xl space-y-6 overflow-hidden relative"
  >
    <div class="space-y-1 z-10 relative">
      <h3 class="text-xl font-bold text-white">Collaboration Network</h3>
      <p class="text-xs text-stone-500 font-medium">
        Frequent creative partnerships and style overlap
      </p>
    </div>

    <!-- Graph Visualization (Simplified using CSS/SVG for max 8 nodes) -->
    <div class="relative h-64 flex items-center justify-center">
      <div
        v-if="loading"
        class="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"
      ></div>

      <div v-else class="relative w-full h-full">
        <!-- Center Node -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-16 h-16 bg-indigo-500 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center text-white font-bold text-xs text-center p-2 z-20 border-4 border-stone-900"
          >
            YOU
          </div>
        </div>

        <!-- Peer Nodes (Circular Layout) -->
        <div
          v-for="(_, idx) in nodes.slice(1, 7)"
          :key="nodes[idx + 1].id"
          class="absolute transition-all duration-700"
          :style="{
            top: `calc(50% + ${Math.sin(idx * ((2 * Math.PI) / 6)) * 100}px)`,
            left: `calc(50% + ${Math.cos(idx * ((2 * Math.PI) / 6)) * 100}px)`,
            transform: 'translate(-50%, -50%)',
          }"
        >
          <div class="group relative">
            <div
              class="w-12 h-12 bg-stone-800 rounded-full border border-white/10 flex items-center justify-center text-[8px] text-stone-400 font-bold text-center p-1 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-colors"
            >
              {{ nodes[idx + 1].label.split(" ")[0] }}
            </div>

            <!-- Edge Label -->
            <div
              class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[8px] text-indigo-300 font-mono"
            >
              {{ edges[idx]?.label || "Frequent" }}
            </div>
          </div>
        </div>

        <!-- Connections (SVG) -->
        <svg
          class="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        >
          <line
            v-for="(_, idx) in nodes.slice(1, 7)"
            :key="'line-' + idx"
            x1="50%"
            y1="50%"
            :x2="`calc(50% + ${Math.cos(idx * ((2 * Math.PI) / 6)) * 100}px)`"
            :y2="`calc(50% + ${Math.sin(idx * ((2 * Math.PI) / 6)) * 100}px)`"
            stroke="white"
            stroke-width="1"
          />
        </svg>
      </div>
    </div>

    <!-- Explanations -->
    <div class="space-y-3 z-10 relative">
      <div
        class="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3"
      >
        <span class="text-lg">💡</span>
        <p class="text-[11px] text-stone-400 leading-relaxed italic">
          "These creators frequently collaborate on high-intensity projects,
          suggesting a shared creative shorthand."
        </p>
      </div>
    </div>

    <!-- Background Decoration -->
    <div
      class="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent pointer-none"
    ></div>
  </div>
</template>
