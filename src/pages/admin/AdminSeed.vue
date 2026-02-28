<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-red-500">Admin: Seed Data</h1>
      <p class="mb-4 text-gray-400">
        Use this tool to populate the `film_attributes` and
        `collaboration_edges` tables with data from TMDB + Mock Intelligence
        data. This is required for the Discovery Engine to work.
      </p>

      <div class="space-y-6">
        <!-- Seed Films -->
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 class="text-xl font-semibold mb-4">1. Seed Films & Attributes</h2>
          <div class="flex items-center gap-4">
            <button
              @click="seedFilms"
              :disabled="isSeeding || !canSeed"
              class="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {{ isSeeding ? "Seeding..." : "Fetch & Seed Films" }}
            </button>
            <span class="text-sm text-gray-400" v-if="seedStatus">{{
              seedStatus
            }}</span>
          </div>
          <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-500 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Seed Collaborations -->
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 class="text-xl font-semibold mb-4">2. Seed Collaborations</h2>
          <div class="flex items-center gap-4">
            <button
              @click="seedCollaborations"
              :disabled="isSeeding || !canSeed"
              class="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {{ isSeeding ? "Building Graph..." : "Build Graph" }}
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2">
            Requires films to be seeded first.
          </p>
        </div>
      </div>

      <div
        class="mt-8 p-4 bg-black/30 rounded border border-white/5 font-mono text-xs h-64 overflow-y-auto"
      >
        <div v-for="(log, i) in logs" :key="i" class="mb-1">{{ log }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { movieService } from "@/services/mediaService";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const isSeeding = ref(false);
const progress = ref(0);
const seedStatus = ref("");
const logs = ref<string[]>([]);

const canSeed = computed(() => !!authStore.user);

const log = (msg: string) => {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
};

// Sample data for mock intelligence
const MOODS = [
  "relaxing",
  "exciting",
  "thought-provoking",
  "funny",
  "dramatic",
  "romantic",
  "scary",
  "inspiring",
  "mysterious",
  "action-packed",
  "dark",
  "feel-good",
];
const STYLES = [
  "cinematic",
  "gritty",
  "colorful",
  "minimalist",
  "surreal",
  "realistic",
  "noir",
  "vintage",
];

function getRandomSubset(arr: string[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomScore() {
  return Math.round((Math.random() * 9 + 1) * 10) / 10; // 1.0 to 10.0
}

async function seedFilms() {
  if (isSeeding.value) return;
  isSeeding.value = true;
  progress.value = 0;
  logs.value = [];

  try {
    log("Starting seed process...");

    // Fetch popular films (5 pages)
    const filmsToSeed: any[] = [];

    for (let page = 1; page <= 5; page++) {
      log(`Fetching page ${page} from TMDB...`);
      const results = await movieService.discover({
        type: "movie",
        rating: 5,
        page,
      });
      filmsToSeed.push(...results);
      await new Promise((r) => setTimeout(r, 200));
    }

    // Process films
    const total = filmsToSeed.length;
    log(`Found ${total} films to process.`);

    for (let i = 0; i < total; i++) {
      const film = filmsToSeed[i];
      progress.value = ((i + 1) / total) * 100;
      seedStatus.value = `Processing ${i + 1}/${total}: ${film.title}`;

      // Check if exists
      const { data: existing } = await supabase
        .from("film_attributes")
        .select("film_id")
        .eq("film_id", film.id)
        .single();

      if (existing) {
        log(`Skipping ${film.title} (already seeded)`);
        continue;
      }

      // Fetch details (runtime)
      const details = await movieService.getMediaById(film.id, "movie");
      if (!details) continue;

      // Generate Mock Intelligence Data
      const attributes = {
        film_id: film.id,
        runtime: details.runtime || 120, // runtime from details
        complexity_score: getRandomScore(),
        pacing_score: getRandomScore(),
        mood_tags: getRandomSubset(MOODS, 3),
        visual_style_tags: getRandomSubset(STYLES, 2),
        cinematography_style: getRandomSubset(STYLES, 1),
        dominant_colors: [
          // Mock RGB
          {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
          },
          {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
          },
        ],
      };

      // Insert
      const { error } = await supabase
        .from("film_attributes")
        .insert(attributes);

      if (error) {
        log(`Error inserting ${film.title}: ${error.message}`);
      } else {
        log(`Seeded: ${film.title}`);
      }

      // delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 100));
    }

    log("Film seeding complete!");
  } catch (err) {
    log(`Error: ${err}`);
  } finally {
    isSeeding.value = false;
    seedStatus.value = "Finished";
  }
}

async function seedCollaborations() {
  log("Collaboration seeding not implemented yet (requires credits endpoint)");
}
</script>
