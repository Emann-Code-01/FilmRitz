<script setup lang="ts">
import { ref } from "vue";
import { IntentInput } from "@/types/film.types";

const emit = defineEmits<{
  (e: "discover", intent: IntentInput): void;
}>();

const presets = [
  {
    id: "tonight",
    label: "Watch tonight",
    icon: "🌙",
    time: 90,
    mood: "Relaxing",
    commitment: "low",
    complexity: "simple",
  },
  {
    id: "weekend",
    label: "Weekend binge",
    icon: "🍿",
    time: 180,
    mood: "Epic",
    commitment: "high",
    complexity: "balanced",
  },
  {
    id: "bg",
    label: "Background",
    icon: "🎧",
    time: 60,
    mood: "Atmospheric",
    commitment: "low",
    complexity: "simple",
  },
  {
    id: "break",
    label: "Quick break",
    icon: "⚡",
    time: 30,
    mood: "Witty",
    commitment: "low",
    complexity: "simple",
  },
];

const moods = [
  {
    id: "relaxing",
    label: "Relaxing",
    emoji: "🌿",
    color: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  {
    id: "intense",
    label: "Intense",
    emoji: "🔥",
    color: "bg-red-500/10 text-red-400 border-red-500/30",
  },
  {
    id: "mind-bending",
    label: "Mind-bending",
    emoji: "🌀",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "epic",
    label: "Epic",
    emoji: "⚔️",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "atmospheric",
    label: "Atmospheric",
    emoji: "🌫️",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "gritty",
    label: "Gritty",
    emoji: "⛓️",
    color: "bg-stone-500/10 text-stone-400 border-stone-500/30",
  },
  {
    id: "heartfelt",
    label: "Heartfelt",
    emoji: "❤️",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  },
  {
    id: "witty",
    label: "Witty",
    emoji: "🎭",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
];

const selectedIntent = ref<IntentInput>({
  timeAvailable: 90,
  mood: "Relaxing",
  commitmentLevel: "low",
  complexityTolerance: "simple",
});

const applyPreset = (preset: (typeof presets)[0]) => {
  selectedIntent.value = {
    timeAvailable: preset.time,
    mood: preset.mood,
    commitmentLevel: preset.commitment as any,
    complexityTolerance: preset.complexity as any,
  };
};

const triggerDiscover = () => {
  emit("discover", { ...selectedIntent.value });
};
</script>

<template>
  <div
    class="p-8 bg-stone-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] space-y-10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
  >
    <!-- Top-level visual accent -->
    <div
      class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-50"
    ></div>

    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3
          class="text-xl font-[Gilroy-Bold] text-white flex items-center gap-3"
        >
          <span
            class="p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/40"
            >🚀</span
          >
          Targeting Intent
        </h3>
        <p
          class="text-[10px] text-stone-600 font-mono uppercase tracking-widest hidden sm:block"
        >
          Neural Weights: v2.4.0
        </p>
      </div>

      <!-- Presets -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          v-for="p in presets"
          :key="p.id"
          @click="applyPreset(p)"
          class="p-4 text-[11px] font-[Gilroy-Bold] rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-stone-400 hover:text-white group flex flex-col items-center gap-3 uppercase tracking-widest"
        >
          <span
            class="text-3xl group-hover:scale-125 transition-transform duration-500 drop-shadow-lg"
            >{{ p.icon }}</span
          >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Time Slider -->
    <div class="space-y-5">
      <div class="flex justify-between items-end">
        <label
          class="text-xs font-[Gilroy-Bold] text-stone-400 uppercase tracking-widest"
          >Temporal Slot (minutes)</label
        >
        <span
          class="text-indigo-400 font-[Gilroy-Bold] text-3xl tabular-nums drop-shadow-[0_0_10px_#6366f140]"
          >{{ selectedIntent.timeAvailable
          }}<span class="text-sm ml-1 text-stone-600">M</span></span
        >
      </div>
      <div class="relative pt-2">
        <input
          type="range"
          v-model.number="selectedIntent.timeAvailable"
          min="30"
          max="180"
          step="15"
          class="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>
      <div
        class="flex justify-between text-[9px] text-stone-600 font-black uppercase tracking-widest"
      >
        <span>Short</span>
        <span>Standard</span>
        <span>Feature</span>
        <span>Epic</span>
      </div>
    </div>

    <!-- Mood Pills -->
    <div class="space-y-5 px-1">
      <label
        class="text-xs font-[Gilroy-Bold] text-stone-400 uppercase tracking-widest"
        >Aesthetic Vibe</label
      >
      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="m in moods"
          :key="m.id"
          @click="selectedIntent.mood = m.label"
          :class="[
            'px-5 py-2.5 rounded-2xl text-xs font-[Gilroy-Bold] border transition-all duration-500 flex items-center gap-2.5 uppercase tracking-wider',
            selectedIntent.mood === m.label
              ? m.color +
                ' border-white/20 shadow-xl shadow-indigo-500/10 -translate-y-1'
              : 'bg-stone-900 border-white/5 text-stone-500 hover:text-stone-300 hover:border-white/10 hover:bg-stone-800/50',
          ]"
        >
          <span class="text-lg filter saturate-150">{{ m.emoji }}</span>
          {{ m.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <!-- Commitment -->
      <div class="space-y-5">
        <label
          class="text-xs font-[Gilroy-Bold] text-stone-400 uppercase tracking-widest"
          >Engagement Level</label
        >
        <div
          class="flex p-1.5 bg-stone-950/40 rounded-2xl border border-white/5"
        >
          <button
            v-for="lv in ['low', 'medium', 'high']"
            :key="lv"
            @click="selectedIntent.commitmentLevel = lv as any"
            :class="[
              'flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500',
              selectedIntent.commitmentLevel === lv
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                : 'text-stone-600 hover:text-stone-400',
            ]"
          >
            {{ lv }}
          </button>
        </div>
      </div>

      <!-- Complexity -->
      <div class="space-y-5">
        <label
          class="text-xs font-[Gilroy-Bold] text-stone-400 uppercase tracking-widest"
          >Cognitive Load</label
        >
        <div
          class="flex p-1.5 bg-stone-950/40 rounded-2xl border border-white/5"
        >
          <button
            v-for="cp in ['simple', 'balanced', 'complex']"
            :key="cp"
            @click="selectedIntent.complexityTolerance = cp as any"
            :class="[
              'flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500',
              selectedIntent.complexityTolerance === cp
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                : 'text-stone-600 hover:text-stone-400',
            ]"
          >
            {{ cp }}
          </button>
        </div>
      </div>
    </div>

    <!-- Discover Button -->
    <div class="pt-2">
      <button
        @click="triggerDiscover"
        class="w-full h-16 bg-linear-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[size:200%_auto] hover:bg-right text-white font-[Gilroy-Bold] rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 transition-all duration-700 active:scale-[0.97] flex items-center justify-center gap-4 group overflow-hidden relative"
      >
        <span
          class="relative z-10 flex items-center gap-4 uppercase tracking-[0.2em] text-sm"
        >
          Initiate Synthesis
          <span
            class="group-hover:translate-x-1.5 transition-transform duration-500"
            >→</span
          >
        </span>

        <!-- Animated Background Glint -->
        <div
          class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"
        ></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  border: 5px solid #6366f1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.bg-linear-to-r {
  transition: background-position 0.7s ease;
}
</style>
