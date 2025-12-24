<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">New Releases</h1>
        <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
          Latest movies and shows
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- RELEASES GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 mx-auto mt-8">
      <!-- Loading -->
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

      <!-- Results -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="item in releases"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <div
            class="absolute inset-0 bg-linear-to-b from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
          <div
            class="absolute top-3 left-3 px-3 py-1 bg-[#b20710] rounded-lg font-[Gilroy-Bold] text-xs"
          >
            NEW
          </div>
          <div
            class="absolute top-3 right-3 text-gray-300 text-base font-[Gilroy-Bold]"
          >
            {{ formatDate(item.release_date || item.first_air_date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { fetchUpcomingMovies, fetchOnTheAir } from "@/api/tmdb";
import AdSlot from "@/components/ads/AdSlot.vue";

const modalStore = useModalStore();

const periods = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 30 Days", value: "30days" },
];

const selectedPeriod = ref("week");
const releases = ref<any[]>([]);
const loading = ref(true);

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
};

const formatDate = (date: string): string => {
  if (!date) return "TBA";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

const loadReleases = async () => {
  loading.value = true;
  try {
    const [movies, shows] = await Promise.all([
      fetchUpcomingMovies(),
      fetchOnTheAir(),
    ]);

    const combined = [
      ...movies.map((m: any) => ({ ...m, media_type: "movie" })),
      ...shows.map((s: any) => ({ ...s, media_type: "tv" })),
    ];
    releases.value = combined.sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date || 0).getTime() -
        new Date(a.release_date || a.first_air_date || 0).getTime()
    );
  } catch (error) {
    console.error("Failed to load releases:", error);
  } finally {
    loading.value = false;
  }
};

watch(selectedPeriod, loadReleases);
onMounted(loadReleases);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
