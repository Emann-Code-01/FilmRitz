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

        <div class="md:flex items-center gap-4 mb-6 hidden">
          <div
            class="w-20 aspect-square rounded-full flex items-center justify-center text-4xl leading-none"
            :style="{
              backgroundColor: `${mood?.color}20`,
              border: `3px solid ${mood?.color}`,
            }"
          >
            {{ mood?.icon }}
          </div>
          <div class="flex-1">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] capitalize">
              {{ mood?.title }}
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              {{ mood?.longDescription }}
            </p>
          </div>
          <!-- Stats -->
          <div class="flex gap-6">
            <div class="text-center flex items-center justify-center gap-2">
              <div
                class="text-3xl font-[Gilroy-Bold]"
                :style="{ color: mood?.color }"
              >
                {{ totalItems }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div
                class="text-3xl font-[Gilroy-Bold]"
                :style="{ color: mood?.color }"
              >
                {{ currentPage }}
              </div>
            </div>
          </div>
        </div>

        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <div
              class="w-20 aspect-square rounded-full flex items-center justify-center text-4xl leading-none"
              :style="{
                backgroundColor: `${mood?.color}20`,
                border: `3px solid ${mood?.color}`,
              }"
            >
              {{ mood?.icon }}
            </div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] capitalize">
              {{ mood?.title }}
            </h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium]">
            {{ mood?.longDescription }}
          </p>
          <!-- Mobile Stats -->
          <div class="flex gap-6 justify-center">
            <div class="text-center flex items-center justify-center gap-2">
              <div
                class="text-2xl font-[Gilroy-Bold]"
                :style="{ color: mood?.color }"
              >
                {{ totalItems }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div
                class="text-2xl font-[Gilroy-Bold]"
                :style="{ color: mood?.color }"
              >
                {{ currentPage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 md:px-10 max-w-7xl mx-auto">
        <div class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="m in moods"
            :key="m.id"
            @click="selectMood(m)"
            class="shrink-0 px-3 md:px-6 py-2 md:py-2.5 rounded-full font-[Gilroy-SemiBold] transition-all duration-500 flex items-center gap-2 cursor-pointer"
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
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="(item, index) in currentPageItems"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 animate-fade-up"
          :style="{
            borderColor: mood?.color + '30',
            animationDelay: `${index * 30}ms`,
          }"
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

          <!-- Mood Badge -->
          <div
            class="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl"
            :style="{ backgroundColor: mood?.color }"
          >
            #{{ (currentPage - 1) * 20 + index + 1 }}
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-4 mb-12"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 md:px-6 py-2 md:py-2.5 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          ← Previous
        </button>

        <div
          class="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-md"
        >
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="page !== -1 && changePage(page)"
            class="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl font-[Gilroy-Bold] text-white transition-all cursor-pointer"
            :class="[page === -1 ? 'cursor-default hover:bg-white/10' : '']"
            :style="
              page === currentPage
                ? { backgroundColor: mood?.color }
                : { backgroundColor: 'rgba(255,255,255,0.1)' }
            "
            :disabled="page === -1"
          >
            {{ page === -1 ? "..." : page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 md:px-6 py-2 md:py-2.5 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import { COLLECTIONS, type CollectionDefinition } from "@/types/media";
import AdSlot from "@/components/ads/AdSlot.vue";

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const currentPage = ref(1);
const itemsPerPage = 20;

const moods = ref<CollectionDefinition[]>(COLLECTIONS);
const mood = ref<CollectionDefinition | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(true);

const totalPages = computed(() => {
  return Math.ceil(moodItems.value.length / itemsPerPage);
});

const totalItems = computed(() => {
  return moodItems.value.length;
});

const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return moodItems.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1); // Ellipsis
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push(-1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push(-1);
      pages.push(total);
    }
  }

  return pages;
});

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

const selectMood = (m: CollectionDefinition) => {
  currentPage.value = 1;
  router.push({ name: "Mood", params: { slug: m.slug } });
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const fetchDiscover = async (
  type: "movie" | "tv",
  genreIds: number[],
  maxPages = 4
) => {
  const key = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch multiple pages to get more results
  const pagePromises = Array.from({ length: maxPages }, (_, i) =>
    fetch(
      `https://api.themoviedb.org/3/discover/${type}?api_key=${key}&with_genres=${genreIds.join(
        ","
      )}&sort_by=popularity.desc&page=${i + 1}`
    ).then((res) => res.json())
  );

  const responses = await Promise.all(pagePromises);
  const allResults = responses.flatMap((data) => data.results || []);

  return allResults.map((item: any) => ({ ...item, media_type: type }));
};

const loadMoodItems = async () => {
  loading.value = true;
  currentPage.value = 1;
  const slug = (route.params.slug as string)?.toLowerCase();
  mood.value = COLLECTIONS.find((m) => m.slug === slug) || COLLECTIONS[0];

  if (!mood.value) {
    moodItems.value = [];
    loading.value = false;
    return;
  }

  try {
    // Fetch 3 pages of both movies and TV shows (approximately 60 items each)
    const [movies, tv] = await Promise.all([
      fetchDiscover("movie", mood.value.genreIds, 3),
      fetchDiscover("tv", mood.value.genreIds, 3),
    ]);

    // Mix and sort by popularity, no limit on slice
    moodItems.value = [...movies, ...tv].sort(
      (a, b) => b.popularity - a.popularity
    );
  } catch (err) {
    console.error("Mood load failed:", err);
  } finally {
    loading.value = false;
  }
};

watch(() => route.params.slug, loadMoodItems);
onMounted(loadMoodItems);
</script>

<style scoped>
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.5s ease-out forwards;
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
