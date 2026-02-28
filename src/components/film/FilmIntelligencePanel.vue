<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  filmId: number;
  intelligence: {
    themes: string[];
    motifs: string[];
    culturalImpact: any;
  };
}>();

const activeTab = ref("themes");
</script>

<template>
  <div
    class="bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
  >
    <!-- Tabs Header -->
    <div class="flex border-b border-white/5 bg-white/5">
      <button
        v-for="tab in ['themes', 'motifs', 'cultural']"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all',
          activeTab === tab
            ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
            : 'text-stone-500 hover:text-stone-300',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="p-6">
      <!-- Themes Section -->
      <div
        v-if="activeTab === 'themes'"
        class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="theme in intelligence.themes"
            :key="theme"
            class="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all"
          >
            #{{ theme }}
          </button>
        </div>
        <p class="text-[11px] text-stone-400 italic leading-relaxed">
          "These thematic pillars define the emotional and philosophical
          backbone of the narrative."
        </p>
      </div>

      <!-- Motifs Section -->
      <div
        v-if="activeTab === 'motifs'"
        class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="motif in intelligence.motifs"
            :key="motif"
            class="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1"
          >
            <span class="text-[10px] font-black text-stone-500 uppercase"
              >Motif</span
            >
            <span class="text-xs font-bold text-white">{{ motif }}</span>
          </div>
        </div>
      </div>

      <!-- Cultural Timeline Section -->
      <div
        v-if="activeTab === 'cultural'"
        class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        <div class="flex flex-col gap-4">
          <div
            v-for="(milestone, idx) in intelligence.culturalImpact.milestones"
            :key="idx"
            class="flex gap-4 relative"
          >
            <!-- Line -->
            <div
              v-if="idx < intelligence.culturalImpact.milestones.length - 1"
              class="absolute left-[13px] top-6 w-0.5 h-full bg-stone-800"
            ></div>

            <!-- Dot -->
            <div
              class="w-7 h-7 bg-stone-800 border-2 border-indigo-500/50 rounded-full shrink-0 flex items-center justify-center z-10"
            >
              <span class="text-[8px] font-black text-white"
                >{{ milestone.year.toString().slice(-2) }}'</span
              >
            </div>

            <div class="pb-6">
              <h5 class="text-xs font-bold text-white">{{ milestone.year }}</h5>
              <p class="text-[10px] text-stone-500">{{ milestone.event }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
