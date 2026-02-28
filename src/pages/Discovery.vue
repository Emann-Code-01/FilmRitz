<template>
  <div class="min-h-screen bg-black text-white pb-20">
    <!-- Hero Background Header -->
    <div class="relative h-[400px] overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-indigo-600/20 via-black to-black"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"
      ></div>

      <div
        class="container mx-auto px-6 h-full flex flex-col justify-center relative z-10 pt-20"
      >
        <div class="max-w-3xl space-y-4">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400"
          >
            <span class="animate-pulse">●</span> AI Powered Discovery
          </div>
          <h1
            class="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          >
            FIND YOUR <br />
            <span
              class="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-emerald-400"
              >NEXT OBSESSION</span
            >
          </h1>
          <p class="text-stone-400 text-lg md:text-xl font-medium max-w-xl">
            FilmRitz Intelligence analyzes your current mood, time constraints,
            and taste profile to surface films that feel exactly right.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 -mt-20 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Sidebar / Selector -->
        <div class="lg:col-span-4 space-y-8">
          <IntentSelector @discover="handleDiscover" />

          <ContextualWatchlists
            :watchlists="suggestedWatchlists"
            :loading="isLoading"
            @use="handleUseWatchlist"
          />
        </div>

        <!-- Main Display / Results -->
        <div class="lg:col-span-8 space-y-12">
          <IntentResults
            :results="results"
            :applied-weights="weights"
            :loading="isLoading"
          />

          <!-- Secondary Discovery -->
          <div v-if="results.length > 0" class="space-y-12">
            <VisualSimilarity :current-film-id="results[0].film_id" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CollaborationGraph :nodes="mockNodes" :edges="mockEdges" />
              <FilmIntelligencePanel
                :film-id="results[0].film_id"
                :intelligence="mockIntelligence"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import IntentSelector from "@/components/discovery/IntentSelector.vue";
import IntentResults from "@/components/discovery/IntentResults.vue";
import ContextualWatchlists from "@/components/watchlists/ContextualWatchlists.vue";
import VisualSimilarity from "@/components/discovery/VisualSimilarity.vue";
import CollaborationGraph from "@/components/relationships/CollaborationGraph.vue";
import FilmIntelligencePanel from "@/components/film/FilmIntelligencePanel.vue";
import { IntentInput, ScoredFilm } from "@/types/film.types";
import { WatchlistWithContextResponse } from "@/types/api.types";
import { IntentController } from "@/controllers/intent.controller";

const isLoading = ref(false);
const results = ref<ScoredFilm[]>([]);
const weights = ref<Record<string, number>>({});
const suggestedWatchlists = ref<WatchlistWithContextResponse[]>([]);

const handleDiscover = async (intent: IntentInput) => {
  isLoading.value = true;
  try {
    const response = await IntentController.discoverByIntent({ intent });
    results.value = response.results;
    weights.value = response.appliedWeights;
  } catch (err) {
    console.error("Discovery failed:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleUseWatchlist = (id: string) => {
  console.log("Using watchlist:", id);
};

// Mock data for initial layout
const mockNodes = [
  { id: 1, label: "Christopher Nolan", type: "central" },
  { id: 2, label: "Cillian Murphy", type: "peer" },
  { id: 3, label: "Tom Hardy", type: "peer" },
  { id: 4, label: "Hans Zimmer", type: "peer" },
  { id: 5, label: "Hoyte van Hoytema", type: "peer" },
];

const mockEdges = [
  { from: 1, to: 2, weight: 6, label: "6 collaborations" },
  { from: 1, to: 3, weight: 3, label: "3 collaborations" },
  { from: 1, to: 4, weight: 12, label: "12 collaborations" },
];

const mockIntelligence = {
  themes: [
    "Technological Overreach",
    "Personal Sacrifice",
    "Temporal Distortion",
  ],
  motifs: ["Timepieces", "Architectural Symmetry", "Practical Effects"],
  culturalImpact: {
    milestones: [
      { year: 2023, event: "Oppenheimer Release" },
      { year: 2024, event: "Sweeps Awards Season" },
    ],
  },
};

onMounted(() => {
  // Initial demo discovery
  handleDiscover({
    timeAvailable: 90,
    mood: "Mind-bending",
    commitmentLevel: "medium",
    complexityTolerance: "balanced",
  });
});
</script>
