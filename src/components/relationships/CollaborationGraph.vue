<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

interface CastMember {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path?: string | null;
  type: "actor" | "director" | "writer" | "peer";
}

interface CollabEdge {
  from: number;
  to: number;
  weight: number;
  label: string;
}

const props = defineProps<{
  nodes: CastMember[];
  edges: CollabEdge[];
  loading?: boolean;
  centralLabel?: string;
}>();

const router = useRouter();

// Take up to 6 peer nodes (skip index 0 which is central)
const peerNodes = computed(() => props.nodes.slice(1, 7));

// Position each peer node in a circle
function peerStyle(idx: number, total: number) {
  const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
  const radius = 95;
  return {
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    transform: "translate(-50%, -50%)",
  };
}

// SVG line endpoints
function lineCoords(idx: number, total: number) {
  const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
  const radius = 95;
  return {
    x2: `${50 + (Math.cos(angle) * radius) / 2.4}%`,
    y2: `${50 + (Math.sin(angle) * radius) / 2.0}%`,
  };
}

const roleColor = (type: string) => {
  switch (type) {
    case "director":
      return "bg-amber-500/20 border-amber-500/50 text-amber-300";
    case "writer":
      return "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
    case "actor":
      return "bg-filmritz-primary/10 border-filmritz-primary/30 text-filmritz-accent";
    default:
      return "bg-gray-500/20 border-white/10 text-stone-300";
  }
};

const centralNode = computed(() => props.nodes[0]);

const navigateToPerson = (node: CastMember) => {
  if (!node.id) return;
  const slug = node.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  router.push({ name: "ActorDetails", params: { name: `${slug}-${node.id}` } });
};
</script>

<template>
  <div class="p-6 glass-card space-y-6 overflow-hidden relative shadow-2xl">
    <div class="space-y-1 z-10 relative">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">
        <span class="text-lg">🕸️</span>
        Collaboration Network
      </h3>
      <p class="text-xs text-stone-500 font-medium">
        Frequent creative partnerships and style overlap
      </p>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div
        class="w-12 h-12 border-4 border-filmritz-primary/20 border-t-filmritz-primary rounded-full animate-spin"
      ></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!nodes || nodes.length === 0"
      class="flex flex-col items-center justify-center h-48 text-stone-600"
    >
      <span class="text-4xl mb-2">🎬</span>
      <p class="text-sm">No collaboration data</p>
    </div>

    <!-- Graph -->
    <div v-else class="relative h-64 flex items-center justify-center">
      <!-- SVG connection lines -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none opacity-25"
      >
        <line
          v-for="(_, idx) in peerNodes"
          :key="`line-${idx}`"
          x1="50%"
          y1="50%"
          v-bind="lineCoords(idx, peerNodes.length)"
          stroke="url(#lineGrad)"
          stroke-width="1.5"
          stroke-dasharray="4 3"
        />
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#b20710" />
            <stop offset="100%" stop-color="#e32125" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Central node -->
      <div class="absolute inset-0 flex items-center justify-center z-20">
        <div
          class="w-16 h-16 bg-filmritz-primary rounded-full shadow-2xl shadow-filmritz-primary/40 flex items-center justify-center border-4 border-stone-950 overflow-hidden cursor-default"
        >
          <img
            v-if="centralNode?.profile_path"
            :src="`https://image.tmdb.org/t/p/w92${centralNode.profile_path}`"
            :alt="centralNode?.name"
            class="w-full h-full object-cover"
          />
          <span
            v-else
            class="text-white font-black text-xs text-center px-1 leading-tight"
          >
            {{ centralNode?.name?.split(" ")[0] || "★" }}
          </span>
        </div>
      </div>

      <!-- Peer nodes -->
      <div
        v-for="(node, idx) in peerNodes"
        :key="node.id"
        class="absolute transition-all duration-700 z-10"
        :style="peerStyle(idx, peerNodes.length)"
      >
        <div class="group relative">
          <div
            @click="navigateToPerson(node)"
            class="w-11 h-11 rounded-full border flex items-center justify-center text-[7px] font-bold text-center group-hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden"
            :class="roleColor(node.type)"
          >
            <img
              v-if="node.profile_path"
              :src="`https://image.tmdb.org/t/p/w92${node.profile_path}`"
              :alt="node.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="px-1 leading-tight text-center">
              {{ node.name.split(" ")[0] }}
            </span>
          </div>

          <!-- Tooltip -->
          <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/90 border border-white/10 px-2 py-1 rounded-lg text-[9px] text-white font-medium z-30 pointer-events-none"
          >
            <div class="font-bold">{{ node.name }}</div>
            <div class="text-stone-400 capitalize">
              {{ node.character || node.job || node.type }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div
      class="flex flex-wrap gap-2 z-10 relative"
      v-if="nodes && nodes.length > 0"
    >
      <span
        v-for="type in ['director', 'actor', 'writer']"
        :key="type"
        class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
        :class="roleColor(type)"
      >
        {{ type }}
      </span>
    </div>

    <!-- Insight blurb -->
    <div
      v-if="nodes && nodes.length > 1"
      class="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 z-10 relative"
    >
      <span class="text-base shrink-0">💡</span>
      <p class="text-[11px] text-stone-400 leading-relaxed italic">
        "These creators frequently collaborate on high-impact projects,
        suggesting a shared creative vision and aesthetic shorthand."
      </p>
    </div>

    <!-- Background glow -->
    <div
      class="absolute inset-0 bg-linear-to-br from-filmritz-primary/5 to-transparent pointer-events-none"
    ></div>
  </div>
</template>
