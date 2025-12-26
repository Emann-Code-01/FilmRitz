<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
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
            class="w-20 aspect-square rounded-full flex items-center justify-center text-4xl leading-none"
            :style="{
              backgroundColor: `${mood?.color}20`,
              border: `3px solid ${mood?.color}`,
            }"
          >
            {{ mood?.icon }}
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] capitalize">
              {{ mood?.title }}
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              {{ moodItems.length }} perfect matches
            </p>
          </div>
        </div>

        <p class="text-xl text-gray-300 font-[Gilroy-Regular] max-w-3xl">
          {{ mood?.longDescription }}
        </p>
      </div>
    </div>

    <div
      class="sticky top-18 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="m in moods"
            :key="m.id"
            @click="selectMood(m)"
            class="shrink-0 px-6 py-3 rounded-full font-[Gilroy-SemiBold] transition-all duration-500 flex items-center gap-2 cursor-pointer"
            :style="
              mood?.id === m.id
                ? { backgroundColor: m.color, color: 'white' }
                : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'gray' }
            "
          >
            <span class="text-xl">{{ m.icon }}</span>
            <span>{{ m.title }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 max-w-7xl mx-auto mt-8">
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
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          >
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs"
                >⭐ {{ item.vote_average?.toFixed(1) }}</span
              >
              <span class="text-gray-300 text-xs">{{
                new Date(
                  item.release_date || item.first_air_date || ""
                ).getFullYear()
              }}</span>
            </div>
          </div>
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
import { COLLECTIONS, type CollectionDefinition } from "@/types/media";
import AdSlot from "@/components/ads/AdSlot.vue";

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();

const moods = ref<CollectionDefinition[]>(COLLECTIONS);
const mood = ref<CollectionDefinition | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(true);

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

const selectMood = (m: CollectionDefinition) => {
  router.push({ name: "Mood", params: { slug: m.slug } });
};

const fetchDiscover = async (type: "movie" | "tv", genreIds: number[]) => {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/${type}?api_key=${key}&with_genres=${genreIds.join(
      ","
    )}&sort_by=popularity.desc`
  );
  const data = await res.json();
  return data.results.map((item: any) => ({ ...item, media_type: type }));
};

const loadMoodItems = async () => {
  loading.value = true;
  const slug = (route.params.slug as string)?.toLowerCase();
  mood.value = COLLECTIONS.find((m) => m.slug === slug) || COLLECTIONS[0];

  if (!mood.value) {
    moodItems.value = [];
    loading.value = false;
    return;
  }

  try {
    const [movies, tv] = await Promise.all([
      fetchDiscover("movie", mood.value.genreIds),
      fetchDiscover("tv", mood.value.genreIds),
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

watch(() => route.params.slug, loadMoodItems);
onMounted(loadMoodItems);
</script>
