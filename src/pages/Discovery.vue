<template>
  <div
    class="min-h-screen bg-filmritz-dark text-white pb-20 selection:bg-filmritz-primary/30"
  >
    <!-- Hero Background Header -->
    <div class="relative h-[450px] md:h-[500px] overflow-hidden">
      <!-- Animated Background Layers -->
      <div
        class="absolute inset-0 bg-linear-to-b from-filmritz-primary/10 via-filmritz-dark to-filmritz-dark"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(178,7,16,0.15),transparent_50%)]"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(227,33,37,0.08),transparent_50%)]"
      ></div>

      <div
        class="page-container h-full flex flex-col justify-center relative z-10 pt-20"
      >
        <div
          class="space-y-6 animate-in fade-in slide-in-from-top-8 duration-1000"
        >
          <div class="badge-filmritz">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-white"
              ></span>
            </span>
            Neural Discovery Engine
          </div>

          <h1
            class="text-6xl md:text-8xl font-[Gilroy-Bold] tracking-tighter leading-[0.9] text-white"
          >
            THE FUTURE OF <br />
            <span
              class="bg-clip-text text-transparent bg-linear-to-r from-filmritz-primary via-filmritz-accent to-pink-500 animate-gradient-x"
              >FILM INTUITION</span
            >
          </h1>

          <p
            class="text-stone-400 text-lg md:text-xl font-[Gilroy-Medium] max-w-2xl leading-relaxed"
          >
            Eliminate decision paralysis. Our intelligence layer synthesizes
            your mood, time constraints, and aesthetic memory to find your next
            favorite story.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-container relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <!-- Sidebar / Selector -->
        <div class="lg:col-span-4 space-y-10">
          <div class="sticky top-28 space-y-10">
            <template v-if="flags.flags.intentAwareFilters">
              <div class="glass-panel p-2 shadow-2xl">
                <IntentSelector @discover="handleDiscover" />
              </div>
            </template>
            <template v-else>
              <FilterPanel @apply="handleGenericFilter" />
            </template>

            <ContextualWatchlists
              :watchlists="suggestedWatchlists"
              :loading="isLoading"
              @use="handleUseWatchlist"
            />
          </div>
        </div>

        <!-- Main Display / Results -->
        <div class="lg:col-span-8 space-y-16">
          <IntentResults
            :results="results"
            :applied-weights="weights"
            :loading="isLoading"
            @select="handleFilmSelect"
          />

          <!-- Focus Section: Shown when results exist -->
          <div
            v-if="results.length > 0 && !isLoading"
            class="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
          >
            <div class="flex items-center gap-4">
              <div
                class="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent"
              ></div>
              <h3
                class="text-xs font-black uppercase tracking-[0.4em] text-stone-500"
              >
                Intelligence Deep Dive
              </h3>
              <div
                class="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent"
              ></div>
            </div>

            <!-- Deep Dive Panels -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="glass-card">
                <CollaborationGraph
                  :nodes="collaborationData.nodes"
                  :edges="collaborationData.edges"
                />
              </div>
              <div class="glass-card">
                <FilmIntelligencePanel
                  :film-id="results[0].film_id"
                  :intelligence="intelligenceData"
                />
              </div>
            </div>

            <div class="glass-card">
              <VisualSimilarity
                v-if="flags.flags.visualSimilaritySearch"
                :current-film-id="results[0].film_id"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import IntentSelector from "@/components/discovery/IntentSelector.vue";
import IntentResults from "@/components/discovery/IntentResults.vue";
import ContextualWatchlists from "@/components/watchlists/ContextualWatchlists.vue";
import VisualSimilarity from "@/components/discovery/VisualSimilarity.vue";
import CollaborationGraph from "@/components/relationships/CollaborationGraph.vue";
import FilmIntelligencePanel from "@/components/film/FilmIntelligencePanel.vue";
import FilterPanel from "@/components/media/FilterPanel.vue";
import { useFeatureFlagsStore } from "@/stores/featureFlags";
import { IntentInput, ScoredFilm } from "@/types/film.types";
import { WatchlistWithContextResponse } from "@/types/api.types";
import { IntentController } from "@/controllers/intent.controller";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const flags = useFeatureFlagsStore();
const router = useRouter();
const isLoading = ref(false);
const results = ref<ScoredFilm[]>([]);
const weights = ref<Record<string, number>>({});
const suggestedWatchlists = ref<WatchlistWithContextResponse[]>([]);
const decisionStart = ref<number | null>(null);
const showToast = ref(false);

// Real data for the focus sections based on the top result
const topResultCredits = ref<any>(null);
const topResultKeywords = ref<any>(null);

const handleDiscover = async (intent: IntentInput) => {
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
  isLoading.value = true;
  decisionStart.value = Date.now();
  try {
    const response = await IntentController.discoverByIntent({ intent });
    results.value = response.results;
    weights.value = response.appliedWeights;

    // Fetch deep intelligence for the top result
    if (results.value.length > 0) {
      fetchTopResultIntelligence(results.value[0].film_id);
    }
  } catch (err) {
    console.error("Discovery failed:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchTopResultIntelligence = async (id: number) => {
  try {
    const [credits, keywords] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        params: { api_key: API_KEY },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${id}/keywords`, {
        params: { api_key: API_KEY },
      }),
    ]);
    topResultCredits.value = credits.data;
    topResultKeywords.value = keywords.data;
  } catch (e) {
    console.error("Failed to fetch intelligence details", e);
  }
};

const collaborationData = computed(() => {
  if (!topResultCredits.value) return { nodes: [], edges: [] };

  const cast = topResultCredits.value.cast?.slice(0, 5) ?? [];
  const director = topResultCredits.value.crew?.find(
    (c: any) => c.job === "Director",
  );

  const nodes: any[] = [];
  if (director) {
    nodes.push({ id: director.id, name: director.name, type: "director" });
  }
  cast.forEach((c: any) => {
    nodes.push({ id: c.id, name: c.name, type: "actor" });
  });

  const edges = nodes.slice(1).map((n) => ({
    from: nodes[0]?.id || 0,
    to: n.id,
    weight: 1,
    label: "Collaboration",
  }));

  return { nodes, edges };
});

const intelligenceData = computed(() => {
  if (!results.value[0])
    return { themes: [], motifs: [], culturalImpact: { milestones: [] } };

  return {
    themes: results.value[0].explanations.slice(0, 3),
    motifs: (topResultKeywords.value?.keywords ?? [])
      .slice(0, 5)
      .map((k: any) => k.name),
    culturalImpact: {
      milestones: [
        { year: 2024, event: "Intelligence Match Found" },
        { year: 2025, event: "Projected Viewer Satiety" },
      ],
    },
  };
});

const handleUseWatchlist = (id: string) => {
  console.log("Using watchlist:", id);
  // Implementation of using a specific watchlist to seed discovery...
};

onMounted(() => {
  handleDiscover({
    timeAvailable: 90,
    mood: "Mind-bending",
    commitmentLevel: "medium",
    complexityTolerance: "balanced",
  });
});

import { movieService } from "@/services/mediaService";

async function handleGenericFilter(filters: any) {
  isLoading.value = true;
  try {
    const items = await movieService.discover({
      genre: filters.genre ? Number(filters.genre) : undefined,
      year: filters.year,
      rating: filters.rating,
      type: filters.type,
    });
    results.value = items.map((m: any) => ({
      film_id: m.id,
      score: 95, // Default for non-intent discovery
      title: m.title || m.name,
      poster_path: m.poster_path,
      media_type: m.media_type || "movie",
      explanations: ["Direct filter match", "Trending within community"],
      matchDetails: {
        runtimeFit: 1,
        moodOverlap: 1,
        complexityDistance: 1,
        completionProbability: 1,
      },
    }));
    weights.value = {};
    if (results.value.length > 0)
      fetchTopResultIntelligence(results.value[0].film_id);
  } catch (err) {
    console.error("Generic discovery failed", err);
  } finally {
    isLoading.value = false;
  }
}

const handleFilmSelect = (film: ScoredFilm) => {
  if (decisionStart.value) {
    import("@/services/metricsService").then((m) =>
      m.MetricsService.trackDecision({
        mediaId: film.film_id,
        decisionTimeMs: Date.now() - decisionStart.value!,
        confidenceLevelAtDecision: "medium",
        sourceComponent: "DiscoveryResults",
      }),
    );
  }
  const slug = (film.title || "film").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  router.push(`/ng/movie/${slug}-${film.film_id}`);
};
</script>

<style scoped>
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s ease infinite;
}
</style>
