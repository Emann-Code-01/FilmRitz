<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER WITH MOOD THEME -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Dynamic Mood Gradient -->
      <div
        class="absolute inset-0 blur-3xl opacity-40 transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 50% 50%, ${mood?.color}60, transparent 70%)`,
        }"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <router-link
          to="/ng"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-[Gilroy-Medium]"
        >
          ← Back to Home
        </router-link>

        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            :style="{
              backgroundColor: `${mood?.color}20`,
              border: `3px solid ${mood?.color}`,
            }"
          >
            {{ mood?.icon }}
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] capitalize">
              {{ mood?.name }} Mood
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              {{ moodItems.length }} perfect matches
            </p>
          </div>
        </div>

        <p class="text-xl text-gray-300 font-[Gilroy-Regular] max-w-3xl">
          {{ mood?.description }}
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MOOD SELECTOR BAR -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div
      class="sticky top-16 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="m in moods"
            :key="m.id"
            @click="selectMood(m)"
            class="shrink-0 px-6 py-3 rounded-full font-[Gilroy-SemiBold] transition-all duration-300 flex items-center gap-2 cursor-pointer"
            :style="
              mood?.id === m.id
                ? { backgroundColor: m.color, color: 'white' }
                : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'gray' }
            "
          >
            <span class="text-xl">{{ m.icon }}</span>
            <span>{{ m.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MOOD ITEMS GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto mt-8">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <!-- Items Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="item in moodItems"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
          :style="{ borderColor: mood?.color + '20' }"
        >
          <!-- Poster -->
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <!-- Info Overlay -->
          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>

            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
              <span class="text-gray-300 text-xs">
                {{
                  new Date(
                    item.release_date || item.first_air_date || ""
                  ).getFullYear()
                }}
              </span>
            </div>
          </div>

          <!-- Play Icon
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
              :style="{ backgroundColor: mood?.color }"
            >
              <span class="text-3xl text-white ml-1">▶</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import { genreMap } from "@/types/media";
import AdSlot from "@/components/ads/AdSlot.vue";

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
interface Mood {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
  genreId: number;
}

const genreIcons: Record<string, string> = {
  action: "🔥",
  adventure: "🗺️",
  animation: "🎨",
  comedy: "😂",
  crime: "🕵️",
  documentary: "🎥",
  drama: "🎭",
  family: "👨‍👩‍👧",
  fantasy: "✨",
  history: "🏺",
  horror: "😱",
  Music: "🎵",
  mystery: "🧩",
  romance: "💕",
  "science fiction": "🚀",
  thriller: "⚡",
  war: "⚔️",
  western: "🤠",
};

const genreColors: Record<string, string> = {
  action: "#EF4444",
  comedy: "#FBBF24",
  drama: "#8B5CF6",
  horror: "#DC2626",
  romance: "#EC4899",
  thriller: "#F97316",
  fantasy: "#10B981",
  mystery: "#6366F1",
};

const moods = ref<Mood[]>(
  Object.entries(genreMap).map(([id, name]) => {
    const key = name.toLowerCase();
    return {
      id: Number(id),
      genreId: Number(id),
      name,
      icon: genreIcons[key] || "🎬",
      color: genreColors[key] || "#22C55E",
      description: `Top ${name.toLowerCase()} movies and TV shows`,
    };
  })
);

const mood = ref<Mood | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(true);

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

const selectMood = (m: Mood) => {
  router.push(`/ng/mood/${m.name.toLowerCase()}`);
};

const fetchDiscover = async (type: "movie" | "tv", genreId: number) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/${type}?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }&with_genres=${genreId}&sort_by=popularity.desc`
  );
  const data = await res.json();
  return data.results.map((item: any) => ({
    ...item,
    media_type: type,
  }));
};

const loadMoodItems = async () => {
  loading.value = true;

  const moodName = (route.params.name as string)?.toLowerCase();
  mood.value =
    moods.value.find((m) => m.name.toLowerCase() === moodName) ||
    moods.value[0];

  try {
    const [movies, tv] = await Promise.all([
      fetchDiscover("movie", mood.value.genreId),
      fetchDiscover("tv", mood.value.genreId),
    ]);

    moodItems.value = [...movies, ...tv]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);
  } catch (err) {
    console.error("Mood load failed:", err);
  } finally {
    loading.value = false;
  }
};

watch(() => route.params.name, loadMoodItems);
onMounted(loadMoodItems);
</script>
