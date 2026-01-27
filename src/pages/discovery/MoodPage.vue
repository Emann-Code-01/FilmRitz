<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 blur-3xl opacity-40 transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 50% 50%, ${mood?.color}60, transparent 70%)`,
        }"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
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
          <div class="flex gap-6">
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
      <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
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

    <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto mt-8">
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
        <MediaCard
          v-for="(item, index) in pagedItems"
          :key="item.id"
          :media="item"
          :rank="(currentPage - 1) * perPage + index + 1"
          class="animate-fade-up"
          :style="{
            animationDelay: `${index * 30}ms`,
          }"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mb-12 flex items-center justify-center">
        <Pagination
          :model-value="currentPage"
          @update:modelValue="changePage"
          :total-items="totalItems"
          :per-page="perPage"
          :theme-color="mood?.color"
          :max-buttons="7"
          aria-label-prev="Previous page"
          aria-label-next="Next page"
        />
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { COLLECTIONS, type CollectionDefinition } from "@/types/media";
import AdSlot from "@/components/ads/AdSlot.vue";
import Pagination from "@/components/ui/Pagination.vue";
import MediaCard from "@/components/media/MediaCard.vue";
import { usePagination } from "@/composables/usePagination";
import { IntelligenceService } from "@/services/intelligenceService";

const route = useRoute();
const router = useRouter();

const moods = ref<CollectionDefinition[]>(COLLECTIONS);
const mood = ref<CollectionDefinition | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(true);

// Client-side pagination using composable over moodItems
const {
  perPage,
  currentPage,
  totalItems,
  totalPages,
  pagedItems,
  changePage,
  reset,
} = usePagination<any>(moodItems, {
  perPage: 20,
  mode: "client",
  scrollOnChange: true,
});

const selectMood = (m: CollectionDefinition) => {
  reset();
  router.push({ name: "Mood", params: { slug: m.slug } });
};

const fetchDiscover = async (type: "movie" | "tv", genreIds: number[]) => {
  const endpoint = `/discover/${type}`;
  const params = {
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    page: 1,
  };

  const data = await IntelligenceService.fetch(endpoint, params);
  const results = data.results || [];

  return results.map((item: any) => IntelligenceService.normalize(item, type));
};

const loadMoodItems = async () => {
  loading.value = true;
  reset();
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
      fetchDiscover("movie", mood.value.genreIds),
      fetchDiscover("tv", mood.value.genreIds),
    ]);

    // Mix and sort by popularity, no limit on slice
    moodItems.value = [...movies, ...tv].sort(
      (a, b) => b.popularity - a.popularity,
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
