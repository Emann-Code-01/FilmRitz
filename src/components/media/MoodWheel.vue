<template>
  <section class="relative py-8 md:py-12 overflow-hidden rounded-2xl">
    <!-- Local ambient effect (in addition to global) -->
    <div
      v-if="selectedMood"
      class="absolute inset-0 blur-3xl opacity-30 transition-all duration-700 rounded-2xl"
      :style="{ backgroundColor: selectedMood.color }"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-10 items-start">
        <!-- LEFT -->
        <div class="flex flex-col items-center gap-6">
          <!-- Mood name beside wheel -->
          <div class="text-center min-h-20 flex flex-col justify-center">
            <h2
              class="text-2xl md:text-3xl font-bold text-white transition-all duration-500"
            >
              {{ selectedMood?.name || "Mood Wheel" }}
            </h2>
            <p
              v-if="selectedMood"
              class="text-gray-400 text-sm mt-1 transition-all duration-500"
            >
              {{ selectedMood.description }}
            </p>
          </div>

          <div
            class="relative w-72 h-72 md:w-96 md:h-96 transition-transform duration-500"
            :class="{ 'animate-fast-spin': isShuffling }"
          >
            <!-- Outer glow ring -->
            <div
              class="absolute inset-0 rounded-full transition-all duration-500"
              :style="{
                boxShadow: selectedMood
                  ? `0 0 60px ${selectedMood.color}40, 0 0 100px ${selectedMood.color}20`
                  : '0 0 30px rgba(255,255,255,0.1)',
              }"
            ></div>

            <div
              class="absolute inset-0 rounded-full border-4 border-white/10"
            ></div>

            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g
                v-for="(mood, i) in moods"
                :key="mood.id"
                @click="selectMood(mood)"
                @mouseenter="hoveredMoodId = mood.id"
                @mouseleave="hoveredMoodId = null"
                class="cursor-pointer transition-all duration-500"
                style="transform-origin: center"
              >
                <path
                  :d="
                    getSegmentPath(
                      i,
                      moods.length,
                      mood.id === selectedMood?.id || mood.id === hoveredMoodId
                    )
                  "
                  :fill="mood.color"
                  :opacity="
                    selectedMood?.id === mood.id
                      ? 1
                      : hoveredMoodId === mood.id
                      ? 0.95
                      : 0.75
                  "
                  class="transition-all duration-500"
                  :style="{
                    filter:
                      hoveredMoodId === mood.id || selectedMood?.id === mood.id
                        ? 'url(#glow) brightness(1.2)'
                        : 'none',
                    stroke:
                      hoveredMoodId === mood.id ? mood.color : 'transparent',
                    strokeWidth: hoveredMoodId === mood.id ? '0.5' : '0',
                  }"
                />
              </g>
            </svg>

            <!-- Center circle with mood info -->
            <div
              class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-36 md:h-36 rounded-full bg-linear-to-br from-gray-900 to-black border-4 transition-all duration-500 flex flex-col items-center justify-center shadow-2xl"
              :style="{
                borderColor: selectedMood?.color || 'rgba(255,255,255,0.2)',
                boxShadow: selectedMood
                  ? `0 0 30px ${selectedMood.color}60, inset 0 0 20px ${selectedMood.color}20`
                  : '0 0 20px rgba(255,255,255,0.1)',
              }"
            >
              <span
                class="text-4xl md:text-5xl transition-transform duration-500 hover:scale-110"
              >
                {{ selectedMood?.icon || "🎬" }}
              </span>
              <span
                class="text-white text-xs font-bold text-center mt-1 px-2 transition-all duration-500"
              >
                {{ selectedMood?.name || "Spin!" }}
              </span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="shuffleMoods"
              :disabled="isShuffling"
              class="px-6 py-3 bg-linear-to-r from-[#b20710] to-[#e32125] hover:from-[#e32125] hover:to-[#b20710] rounded-xl text-white font-semibold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">🔀</span>
                <span>{{
                  isShuffling ? "Shuffling..." : "Shuffle Moods"
                }}</span>
              </span>
            </button>
          </div>

          <!-- Quick tip -->
          <p class="text-gray-500 text-xs text-center max-w-xs leading-relaxed">
            💡 Click any segment to explore movies, or press
            <kbd class="px-2 py-1 bg-white/10 rounded text-white">Space</kbd> to
            shuffle
          </p>
        </div>

        <!-- RIGHT -->
        <div>
          <!-- Default state -->
          <div
            v-if="!selectedMood"
            class="text-center py-20 transition-all duration-500"
          >
            <div class="text-7xl opacity-50 animate-pulse">🎭</div>
            <h3 class="text-3xl font-bold text-white mt-4">Choose Your Mood</h3>
            <p class="text-gray-400 mt-2 max-w-md mx-auto">
              Click on any color segment to discover movies that match your
              current vibe
            </p>
          </div>

          <!-- Mood Info -->
          <template v-else>
            <div
              class="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6 transition-all duration-500 hover:border-white/30 shadow-xl"
              :style="{
                boxShadow: `0 10px 40px ${selectedMood.color}20`,
              }"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="text-5xl transition-transform duration-500 hover:scale-110 cursor-default"
                  :style="{
                    filter: `drop-shadow(0 0 10px ${selectedMood.color}80)`,
                  }"
                >
                  {{ selectedMood.icon }}
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                    {{ selectedMood.name }}
                  </h3>
                  <p class="text-gray-300 text-sm leading-relaxed">
                    {{ selectedMood.description }}
                  </p>
                </div>
              </div>

              <div
                v-if="selectedMood.tags && selectedMood.tags.length"
                class="flex flex-wrap gap-2 mb-4"
              >
                <span
                  v-for="tag in selectedMood.tags"
                  :key="tag"
                  class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-gray-200 transition-all duration-200 cursor-default border border-white/10"
                >
                  {{ tag }}
                </span>
              </div>

              <button
                @click="viewMood"
                class="w-full px-6 py-3 bg-linear-to-r from-[#b20710] to-[#e32125] hover:from-[#e32125] hover:to-[#b20710] rounded-xl text-white font-semibold transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore All {{ selectedMood.name }}</span>
                <span class="text-lg">→</span>
              </button>
            </div>

            <!-- Skeleton Loading -->
            <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div
                v-for="i in 6"
                :key="i"
                class="aspect-2/3 rounded-xl bg-white/10 animate-pulse"
              ></div>
            </div>

            <!-- Movie Grid -->
            <div
              v-else-if="moodItems.length"
              class="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              <div
                v-for="item in moodItems.slice(0, 6)"
                :key="item.id"
                @click="openModal(item)"
                class="group cursor-pointer"
              >
                <div
                  class="relative overflow-hidden rounded-xl aspect-2/3 bg-white/5 transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl"
                  :style="{ boxShadow: 'none' }"
                  @mouseenter="onCardMouseEnter"
                  @mouseleave="onCardMouseLeave"
                >
                  <img
                    :src="getImageUrl(item.poster_path)"
                    :alt="item.title || item.name"
                    class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4"
                  >
                    <div
                      class="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      <h4
                        class="text-white text-sm font-bold line-clamp-2 mb-2"
                      >
                        {{ item.title || item.name }}
                      </h4>
                      <div
                        class="flex justify-between items-center text-xs text-gray-300"
                      >
                        <span class="flex items-center gap-1">
                          <span class="text-yellow-400">⭐</span>
                          <span class="font-semibold">{{
                            item.vote_average?.toFixed(1)
                          }}</span>
                        </span>
                        <span class="bg-white/20 px-2 py-0.5 rounded">
                          {{
                            new Date(
                              item.release_date || item.first_air_date
                            ).getFullYear()
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-else class="text-center py-12">
              <span class="text-5xl block mb-3">🎬</span>
              <p class="text-gray-400">No movies found for this mood</p>
              <button
                @click="shuffleMoods"
                class="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Try Another Mood
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import { useAmbient } from "@/composables/useAmbient";
import { COLLECTIONS, type CollectionDefinition } from "@/types/media";

const router = useRouter();
const modalStore = useModalStore();

const { updateColor } = useAmbient();

const moods = ref<CollectionDefinition[]>(COLLECTIONS);
const selectedMood = ref<CollectionDefinition | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(false);
const isShuffling = ref(false);
const hoveredMoodId = ref<string | number | null>(null);

const onCardMouseEnter = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement | null;
  if (!el) return;
  if (selectedMood?.value?.color) {
    el.style.boxShadow = `0 10px 40px ${selectedMood.value.color}40`;
  }
};

const onCardMouseLeave = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement | null;
  if (!el) return;
  el.style.boxShadow = "none";
};

const getImageUrl = (p: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : "https://placehold.co/342x513";

const getSegmentPath = (i: number, t: number, isActive: boolean = false) => {
  const a = 360 / t;
  const s = ((i * a - 90) * Math.PI) / 180;
  const e = (((i + 1) * a - 90) * Math.PI) / 180;
  const r1 = isActive ? 50 : 48;
  const r2 = 28;

  return `
    M ${50 + r1 * Math.cos(s)} ${50 + r1 * Math.sin(s)}
    A ${r1} ${r1} 0 0 1 ${50 + r1 * Math.cos(e)} ${50 + r1 * Math.sin(e)}
    L ${50 + r2 * Math.cos(e)} ${50 + r2 * Math.sin(e)}
    A ${r2} ${r2} 0 0 0 ${50 + r2 * Math.cos(s)} ${50 + r2 * Math.sin(s)}
    Z
  `;
};

const fetchMoodMovies = async (mood: CollectionDefinition) => {
  try {
    const key = import.meta.env.VITE_TMDB_API_KEY;
    if (!key) return [];

    const genreIds = mood.genreIds || [];
    if (!genreIds.length) return [];

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${key}&sort_by=popularity.desc&with_genres=${genreIds.join(
        ","
      )}`
    );

    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
};

const shuffleMoods = () => {
  if (isShuffling.value) return;

  isShuffling.value = true;
  selectedMood.value = null;
  moodItems.value = [];
  hoveredMoodId.value = null;
  localStorage.removeItem("lastMood");

  setTimeout(() => {
    const shuffled = [...COLLECTIONS].sort(() => Math.random() - 0.5);
    moods.value = shuffled.slice(0, 8);
    isShuffling.value = false;
  }, 600);
};

const selectMood = async (mood: CollectionDefinition) => {
  if (isShuffling.value) return;

  selectedMood.value = mood;
  loading.value = true;

  if (mood.color) updateColor(mood.color);

  try {
    moodItems.value = await fetchMoodMovies(mood);
    localStorage.setItem("lastMood", mood.slug);
  } finally {
    loading.value = false;
  }
};

const viewMood = () => {
  if (!selectedMood.value) return;

  router.push({
    name: "Mood", // ensure your route has name: "Mood"
    params: {
      slug: selectedMood.value.slug, // use slug from COLLECTIONS
    },
  });
};

const openModal = (item: any) => {
  if (!item?.id) return;
  modalStore.open("movie", { movieId: item.id, mediaType: "movie" });
};

const handleKey = (e: KeyboardEvent) => {
  if (e.code === "Space" && !isShuffling.value) {
    e.preventDefault();
    shuffleMoods();
  }
};

watch(selectedMood, (m) => {
  if (m?.color) updateColor(m.color);
});

onMounted(() => {
  shuffleMoods();
  window.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKey);
});
</script>

<style scoped>
@keyframes fast-spin {
  to {
    transform: rotate(720deg);
  }
}

.animate-fast-spin {
  animation: fast-spin 0.6s ease-in-out;
}

kbd {
  font-family: monospace;
  font-size: 0.875em;
}
</style>
