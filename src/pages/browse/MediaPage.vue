<template>
  <div
    class="min-h-screen text-white py-10 mt-10 transition-all duration-900 animate-fade-up"
  >
    <div class="relative py-12 px-6 mx-auto overflow-hidden">
      <!-- Ambient Glow Background -->
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-[1230px] mx-auto justify-between">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Left: Title & Description -->
          <div class="space-y-4">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] leading-tight">
              {{ isMoviePage ? "Discover Movies" : "Discover TV Shows" }}
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] max-w-xl">
              Explore trending, top-rated, and upcoming
              {{ isMoviePage ? "movies" : "shows" }} with trailers.
            </p>
            <!-- Stats -->
            <div class="flex gap-6">
              <div class="text-center flex items-center justify-center gap-2">
                <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                  {{ totalItems }}+
                </div>
                <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                  Items
                </div>
              </div>
              <div class="text-center flex items-center justify-center gap-2">
                <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                  Page
                </div>
                <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                  {{ currentPage }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right: 3D Card Stack -->
          <div class="relative h-full flex-end items-center justify-center">
            <Swiper
              :modules="[EffectCards, Autoplay]"
              effect="cards"
              :grab-cursor="true"
              :loop="true"
              :autoplay="{ delay: 3000, disableOnInteraction: false }"
              class="w-64 h-full"
            >
              <SwiperSlide
                v-for="item in allFilteredMedia.slice(0, 8)"
                :key="item.id"
                class="rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  :src="getPoster(item.poster_path, 'w500')"
                  :alt="item.title || item.name"
                  class="w-full h-full object-cover"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- FILTER PANEL -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 max-w-7xl mx-auto">
        <!-- Category Tabs -->
        <div class="flex gap-3 mb-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="changeCategory(cat.value)"
            class="px-3 md:px-6 py-2 md:py-2.5 rounded-full font-[Gilroy-SemiBold] whitespace-nowrap flex items-center justify-center transition-all duration-500 cursor-pointer"
            :class="
              selectedCategory === cat.value
                ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            "
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Filters Row -->
        <div class="flex flex-wrap gap-3 items-center">
          <!-- Genre Filter -->
          <select
            v-model="appliedFilters.genre"
            @change="currentPage = 1"
            class="px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gray-950 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          >
            <option value="">All Genres</option>
            <option v-for="g in genres" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>

          <!-- Year Filter -->
          <input
            type="number"
            v-model.number="appliedFilters.year"
            @input="currentPage = 1"
            placeholder="Year"
            class="px-3 md:px-4 py-2 md:py-2.5 w-28 rounded-xl bg-gray-950 border border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          />

          <!-- Rating Filter -->
          <input
            type="number"
            v-model.number="appliedFilters.rating"
            @input="currentPage = 1"
            min="0"
            max="10"
            step="0.1"
            placeholder="Min Rating"
            class="px-3 md:px-4 py-2 md:py-2.5 w-32 rounded-xl bg-gray-950 border border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          />

          <!-- Sort Filter -->
          <select
            v-model="appliedFilters.sort"
            @change="currentPage = 1"
            class="px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gray-950 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="topRated">Top Rated</option>
          </select>

          <!-- Clear Filters -->
          <button
            @click="clearFilters"
            class="px-5 md:px-6 py-2 md:py-2.5 rounded-xl bg-red-600/20 border cursor-pointer border-red-600/50 text-red-400 font-[Gilroy-SemiBold] hover:bg-red-600 hover:text-white transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MEDIA GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 mx-auto mt-8 max-w-7xl">
      <!-- Loading Skeleton -->
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

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-xl font-[Gilroy-SemiBold] mb-4">
          {{ error }}
        </p>
        <button
          @click="() => {}"
          class="px-3 md:px-6 py-2 md:py-2.5 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all"
        >
          Retry
        </button>
      </div>

      <!-- Media Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="(item, index) in currentPageItems"
          :key="item.id + item.media_type"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all duration-500 hover:scale-105 animate-fade-up"
          :style="{ animationDelay: `${index * 30}ms` }"
        >
          <!-- Poster -->
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="getPoster(item.poster_path, 'w500')"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <!-- Info Overlay -->
          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          >
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>

            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span
                class="px-2 py-1 bg-[#b20710] rounded-md text-xs font-[Gilroy-SemiBold]"
              >
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
              <span
                class="px-2 py-1 bg-white/20 rounded-md text-xs font-[Gilroy-SemiBold]"
              >
                {{ item.media_type.toUpperCase() }}
              </span>
              <span class="text-xs text-gray-300">
                {{ (item.release_date || item.first_air_date)?.slice(0, 4) }}
              </span>
            </div>

            <!-- Genre Tags -->
            <div class="flex flex-wrap gap-1">
              <router-link
                v-for="genreName in getGenreNames(item.genre_ids).slice(0, 2)"
                :key="genreName"
                :to="{
                  name: 'GenreView',
                  params: { name: genreName.toLowerCase() },
                }"
                @click.stop
                class="px-2 py-0.5 bg-white/10 rounded-md text-xs font-[Gilroy-SemiBold] hover:bg-[#b20710] transition-all"
              >
                {{ genreName }}
              </router-link>
            </div>
          </div>

          <!-- Rank Badge -->
          <div
            class="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#b20710] flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl"
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
            :class="[
              page === currentPage
                ? 'bg-[#b20710]'
                : 'bg-white/10 hover:bg-white/20',
              page === -1 ? 'cursor-default hover:bg-white/10' : '',
            ]"
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
    <AdSlot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { useMedia } from "@/composables/useMedia";
import { useModalStore } from "@/stores/modalStore";
import { genreMap } from "@/types/media";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectCards } from "swiper/modules";
import AdSlot from "@/components/ads/AdSlot.vue";

const route = useRoute();
const isMoviePage = computed(() => route.name === "Movies");

const modalStore = useModalStore();
const { trendingAll, getTrendingAll, loading, error } = useMedia();

const genres = Object.entries(genreMap).map(([id, name]) => ({
  id: Number(id),
  name,
}));

const currentPage = ref(1);
const perPage = 20;
const selectedCategory = ref("all");

const appliedFilters = ref({
  genre: "",
  year: null as number | null,
  rating: null as number | null,
  sort: "",
});

const categories = [
  { label: "All", value: "all" },
  { label: "Trending", value: "trending" },
  { label: "Top Rated", value: "topRated" },
  { label: "Upcoming", value: "upcoming" },
];

const allFilteredMedia = computed(() => {
  let data = trendingAll.value.filter((m: any) =>
    isMoviePage.value ? m.media_type === "movie" : m.media_type === "tv"
  );

  if (selectedCategory.value === "topRated") {
    data = data.sort(
      (a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0)
    );
  } else if (selectedCategory.value === "upcoming") {
    data = data.filter(
      (m: any) =>
        (m.release_date || "") >= new Date().toISOString().slice(0, 10)
    );
  }

  data = data.filter((m: any) => {
    if (
      appliedFilters.value.genre &&
      !m.genre_ids?.includes(Number(appliedFilters.value.genre))
    )
      return false;
    if (appliedFilters.value.year) {
      const year = Number((m.release_date || m.first_air_date)?.slice(0, 4));
      if (year !== appliedFilters.value.year) return false;
    }
    if (
      appliedFilters.value.rating &&
      (m.vote_average || 0) < appliedFilters.value.rating
    )
      return false;
    return true;
  });

  if (appliedFilters.value.sort === "newest") {
    data = data.sort((a: any, b: any) =>
      (b.release_date || b.first_air_date || "").localeCompare(
        a.release_date || a.first_air_date || ""
      )
    );
  } else if (appliedFilters.value.sort === "oldest") {
    data = data.sort((a: any, b: any) =>
      (a.release_date || a.first_air_date || "").localeCompare(
        b.release_date || b.first_air_date || ""
      )
    );
  } else if (appliedFilters.value.sort === "topRated") {
    data = data.sort(
      (a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0)
    );
  }

  return data;
});

const totalPages = computed(() => {
  return Math.ceil(allFilteredMedia.value.length / perPage);
});

const totalItems = computed(() => {
  return allFilteredMedia.value.length;
});

const currentPageItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return allFilteredMedia.value.slice(start, end);
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
      pages.push(-1);
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

function changeCategory(value: string) {
  selectedCategory.value = value;
  currentPage.value = 1;
}

function clearFilters() {
  appliedFilters.value = { genre: "", year: null, rating: null, sort: "" };
  currentPage.value = 1;
}

function openModal(item: any) {
  modalStore.open(item.media_type, { id: item.id });
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getPoster(path: string | null, size: string = "w500") {
  if (!path) return "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return [];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

onMounted(async () => {
  if (!trendingAll.value.length) {
    try {
      await getTrendingAll();
    } catch (err) {
      console.error("Failed fetching trending media", err);
    }
  }
});

const pageTitle = computed(() =>
  isMoviePage.value
    ? "Discover Movies | FilmRitz"
    : "Discover TV Shows | FilmRitz"
);
const pageDescription = computed(
  () =>
    `Explore trending, top-rated, and upcoming ${
      isMoviePage.value ? "movies" : "TV shows"
    } with trailers on FilmRitz.`
);

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: "description", content: pageDescription.value },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: pageTitle.value },
    { property: "og:description", content: pageDescription.value },
  ],
}));
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
