<template>
  <section class="relative py-8 md:py-12 overflow-hidden">
    <!-- Ambient -->
    <div
      v-if="selectedMood"
      class="absolute inset-0 blur-3xl opacity-40 transition-all duration-700"
      :style="{ backgroundColor: selectedMood.color }"
    />

    <div class="relative z-10 max-w-7xl mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-10 items-start">
        <!-- LEFT -->
        <div class="flex flex-col items-center gap-6">
          <!-- Mood name beside wheel -->
          <div class="text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-white">
              {{ selectedMood?.name || "Mood Wheel" }}
            </h2>
            <p v-if="selectedMood" class="text-gray-400 text-sm mt-1">
              {{ selectedMood.description }}
            </p>
          </div>

          <div
            class="relative w-72 h-72 md:w-96 md:h-96"
            :class="{ 'animate-fast-spin': isShuffling }"
          >
            <div
              class="absolute inset-0 rounded-full border-4 border-white/10"
            />

            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <g
                v-for="(mood, i) in moods"
                :key="mood.id"
                @click="selectMood(mood)"
              >
                <path
                  :d="getSegmentPath(i, moods.length)"
                  :fill="mood.color"
                  :opacity="selectedMood?.id === mood.id ? 1 : 0.7"
                />
              </g>
            </svg>

            <div
              class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-black border-4 border-white/20 flex flex-col items-center justify-center"
            >
              <span class="text-5xl">{{ selectedMood?.icon || "🎬" }}</span>
              <span class="text-white text-xs font-bold text-center">
                {{ selectedMood?.name || "Choose" }}
              </span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="shuffleMoods"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              🔀 Shuffle
            </button>

            <button
              v-if="selectedMood"
              @click="viewMood"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              View More →
            </button>
          </div>
        </div>

        <!-- RIGHT -->
        <div>
          <!-- Default -->
          <div v-if="!selectedMood" class="text-center py-20">
            <div class="text-7xl opacity-50">🎭</div>
            <h3 class="text-3xl font-bold text-white mt-4">Choose a Mood</h3>
            <p class="text-gray-400 mt-2">
              Spin the wheel to get movie recommendations
            </p>
          </div>

          <!-- Mood Info -->
          <template v-else>
            <div
              class="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-6"
            >
              <div class="flex items-start gap-4 mb-3">
                <span class="text-5xl">{{ selectedMood.icon }}</span>
                <div>
                  <h3 class="text-2xl font-bold text-white">
                    {{ selectedMood.name }}
                  </h3>
                  <p class="text-gray-400 text-sm mt-1">
                    {{ selectedMood.description }}
                  </p>
                </div>
              </div>

              <div
                v-if="selectedMood.tags?.length"
                class="flex flex-wrap gap-2"
              >
                <span
                  v-for="tag in selectedMood.tags"
                  :key="tag"
                  class="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Skeleton Loading -->
            <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div
                v-for="i in 6"
                :key="i"
                class="aspect-[2/3] rounded-xl bg-white/10 animate-pulse"
              />
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
                  class="relative overflow-hidden rounded-xl aspect-[2/3] bg-white/5"
                >
                  <img
                    :src="getImageUrl(item.poster_path)"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                  >
                    <div class="w-full">
                      <h4 class="text-white text-sm font-bold line-clamp-2">
                        {{ item.title || item.name }}
                      </h4>
                      <div
                        class="flex justify-between text-xs text-gray-300 mt-1"
                      >
                        <span>⭐ {{ item.vote_average?.toFixed(1) }}</span>
                        <span>{{
                          new Date(
                            item.release_date || item.first_air_date
                          ).getFullYear()
                        }}</span>
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
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import { COLLECTIONS, type CollectionDefinition } from "@/types/media";

const router = useRouter();
const modalStore = useModalStore();

const moods = ref<CollectionDefinition[]>([]);
const selectedMood = ref<CollectionDefinition | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(false);
const isShuffling = ref(false);

const getImageUrl = (p: string | null) =>
  p ? `https://image.tmdb.org/t/p/w342${p}` : "https://placehold.co/342x513";

const getSegmentPath = (i: number, t: number) => {
  const a = 360 / t;
  const s = ((i * a - 90) * Math.PI) / 180;
  const e = (((i + 1) * a - 90) * Math.PI) / 180;
  const r1 = 48,
    r2 = 28;

  return `
    M ${50 + r1 * Math.cos(s)} ${50 + r1 * Math.sin(s)}
    A ${r1} ${r1} 0 0 1 ${50 + r1 * Math.cos(e)} ${50 + r1 * Math.sin(e)}
    L ${50 + r2 * Math.cos(e)} ${50 + r2 * Math.sin(e)}
    A ${r2} ${r2} 0 0 0 ${50 + r2 * Math.cos(s)} ${50 + r2 * Math.sin(s)}
    Z
  `;
};

const fetchMoodMovies = async (mood: CollectionDefinition) => {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${key}&sort_by=popularity.desc&with_genres=${mood.genreIds?.join(
      ","
    )}`
  );
  const data = await res.json();
  return data.results || [];
};

const shuffleMoods = () => {
  isShuffling.value = true;
  selectedMood.value = null;
  moodItems.value = [];
  localStorage.removeItem("lastMood");

  setTimeout(() => {
    moods.value = [...COLLECTIONS].sort(() => Math.random() - 0.5).slice(0, 8);
    isShuffling.value = false;
  }, 600);
};

const selectMood = async (mood: CollectionDefinition) => {
  selectedMood.value = mood;
  loading.value = true;
  moodItems.value = await fetchMoodMovies(mood);
  loading.value = false;
};

const viewMood = () => {
  if (!selectedMood.value) return;
  router.push({
    name: "Mood",
    params: { name: selectedMood.value.name.toLowerCase() },
  });
};

const openModal = (item: any) => {
  modalStore.open("movie", { movieId: item.id, mediaType: "movie" });
};

const handleKey = (e: KeyboardEvent) => {
  if (e.code === "Space") shuffleMoods();
};

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
</style>
