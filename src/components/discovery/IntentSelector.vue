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
    label: "Background watch",
    icon: "🎧",
    time: 60,
    mood: "Chill",
    commitment: "low",
    complexity: "simple",
  },
  {
    id: "break",
    label: "Quick break",
    icon: "⚡",
    time: 30,
    mood: "Fast-paced",
    commitment: "low",
    complexity: "simple",
  },
];

const moods = [
  {
    id: "relaxing",
    label: "Relaxing",
    emoji: "🌿",
    color: "bg-green-500/20 text-green-400 border-green-500/50",
  },
  {
    id: "intense",
    label: "Intense",
    emoji: "🔥",
    color: "bg-red-500/20 text-red-400 border-red-500/50",
  },
  {
    id: "mind-bending",
    label: "Mind-bending",
    emoji: "🌀",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  },
  {
    id: "epic",
    label: "Epic",
    emoji: "⚔️",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  },
  {
    id: "atmospheric",
    label: "Atmospheric",
    emoji: "🌫️",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  },
  {
    id: "gritty",
    label: "Gritty",
    emoji: "⛓️",
    color: "bg-stone-500/20 text-stone-400 border-stone-500/50",
  },
  {
    id: "heartfelt",
    label: "Heartfelt",
    emoji: "❤️",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/50",
  },
  {
    id: "witty",
    label: "Witty",
    emoji: "🎭",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
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
    class="p-6 bg-stone-900/50 backdrop-blur-xl border border-white/10 rounded-3xl space-y-8 max-w-2xl mx-auto shadow-2xl"
  >
    <div class="space-y-4">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">
        <span class="p-2 bg-indigo-500 rounded-lg">🚀</span>
        Discovery Intent
      </h3>

      <!-- Presets -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="p in presets"
          :key="p.id"
          @click="applyPreset(p)"
          class="p-3 text-sm font-medium rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-stone-400 hover:text-white group flex flex-col items-center gap-2"
        >
          <span class="text-2xl group-hover:scale-110 transition-transform">{{
            p.icon
          }}</span>
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Time Slider -->
    <div class="space-y-4">
      <div class="flex justify-between items-end">
        <label
          class="text-sm font-semibold text-stone-300 uppercase tracking-wider"
          >Time Available</label
        >
        <span class="text-indigo-400 font-mono text-xl tabular-nums"
          >{{ selectedIntent.timeAvailable }} min</span
        >
      </div>
      <input
        type="range"
        v-model.number="selectedIntent.timeAvailable"
        min="30"
        max="180"
        step="15"
        class="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
      <div class="flex justify-between text-[10px] text-stone-500 font-mono">
        <span>30M</span>
        <span>60M</span>
        <span>90M</span>
        <span>120M</span>
        <span>150M</span>
        <span>180M</span>
      </div>
    </div>

    <!-- Mood Pills -->
    <div class="space-y-4">
      <label
        class="text-sm font-semibold text-stone-300 uppercase tracking-wider"
        >Current Mood</label
      >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="m in moods"
          :key="m.id"
          @click="selectedIntent.mood = m.label"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2',
            selectedIntent.mood === m.label
              ? m.color + ' ring-2 ring-white/20 scale-105'
              : 'bg-white/5 text-stone-400 border-transparent hover:bg-white/10',
          ]"
        >
          <span>{{ m.emoji }}</span>
          {{ m.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- Commitment -->
      <div class="space-y-4">
        <label
          class="text-sm font-semibold text-stone-300 uppercase tracking-wider"
          >Commitment</label
        >
        <div class="flex p-1 bg-stone-800/50 rounded-xl border border-white/5">
          <button
            v-for="lv in ['low', 'medium', 'high']"
            :key="lv"
            @click="selectedIntent.commitmentLevel = lv as any"
            :class="[
              'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize',
              selectedIntent.commitmentLevel === lv
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-stone-500 hover:text-stone-300',
            ]"
          >
            {{ lv }}
          </button>
        </div>
      </div>

      <!-- Complexity -->
      <div class="space-y-4">
        <label
          class="text-sm font-semibold text-stone-300 uppercase tracking-wider"
          >Complexity</label
        >
        <div class="flex p-1 bg-stone-800/50 rounded-xl border border-white/5">
          <button
            v-for="cp in ['simple', 'balanced', 'complex']"
            :key="cp"
            @click="selectedIntent.complexityTolerance = cp as any"
            :class="[
              'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize',
              selectedIntent.complexityTolerance === cp
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-stone-500 hover:text-stone-300',
            ]"
          >
            {{ cp }}
          </button>
        </div>
      </div>
    </div>

    <!-- Discover Button -->
    <button
      @click="triggerDiscover"
      class="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
    >
      Deep Discovery
      <span class="group-hover:translate-x-1 transition-transform">→</span>
    </button>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  border: 4px solid #6366f1;
}
</style>
