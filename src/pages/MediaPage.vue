<template>
  <div
    class="min-h-screen text-white py-10 mt-10 transition-all duration-900 animate-fade-up"
  >
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER WITH DYNAMIC CARDS -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
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
                v-for="item in filteredMedia.slice(0, 8)"
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
      class="sticky top-26 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
    >
      <div class="px-6 max-w-7xl mx-auto">
        <!-- Category Tabs -->
        <div class="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectedCategory = cat.value"
            class="px-6 py-2.5 rounded-full font-[Gilroy-SemiBold] whitespace-nowrap transition-all duration-300 cursor-pointer"
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
            class="px-4 py-2.5 rounded-xl bg-white/5 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
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
            placeholder="Year"
            class="px-4 py-2.5 w-28 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          />

          <!-- Rating Filter -->
          <input
            type="number"
            v-model.number="appliedFilters.rating"
            min="0"
            max="10"
            step="0.1"
            placeholder="Min Rating"
            class="px-4 py-2.5 w-32 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          />

          <!-- Sort Filter -->
          <select
            v-model="appliedFilters.sort"
            class="px-4 py-2.5 rounded-xl bg-white/5 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="topRated">Top Rated</option>
          </select>

          <!-- Clear Filters -->
          <button
            @click="clearFilters"
            class="px-6 py-2.5 rounded-xl bg-red-600/20 border cursor-pointer border-red-600/50 text-red-400 font-[Gilroy-SemiBold] hover:bg-red-600 hover:text-white transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MEDIA GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 mx-auto mt-8">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="relative rounded-2xl overflow-hidden bg-white/5 animate-pulse"
        >
          <div class="aspect-2/3 bg-gray-800"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 text-xl font-[Gilroy-SemiBold] mb-4">
          {{ error }}
        </p>
        <button
          @click="() => {}"
          class="px-6 py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all"
        >
          Retry
        </button>
      </div>

      <!-- Media Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="item in filteredMedia"
          :key="item.id + item.media_type"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all duration-300 hover:scale-105"
        >
          <!-- Poster -->
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="getPoster(item.poster_path, 'w500')"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <!-- linear Overlay -->
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

          <!-- Play Icon (on hover)
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div
              class="w-16 h-16 rounded-full bg-[#b20710] flex items-center justify-center shadow-2xl"
            >
              <span class="text-3xl text-white ml-1">▶</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- PAGINATION -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="flex justify-center items-center gap-4 mt-24">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-[Gilroy-SemiBold]"
      >
        ← Previous
      </button>

      <span class="px-6 py-3 bg-[#b20710] rounded-xl font-[Gilroy-Bold]">
        Page {{ currentPage }}
      </span>

      <button
        @click="nextPage"
        :disabled="filteredMedia.length < perPage"
        class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-[Gilroy-SemiBold]"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { useMedia } from "@/composables/useMedia";
import { useModalStore } from "@/stores/modalStore";
import { genreMap } from "@/types/media";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectCards } from "swiper/modules";

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

const filteredMedia = computed(() => {
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

  const start = (currentPage.value - 1) * perPage;
  return data.slice(start, start + perPage);
});

function clearFilters() {
  appliedFilters.value = { genre: "", year: null, rating: null, sort: "" };
  currentPage.value = 1;
}

function openModal(item: any) {
  modalStore.open(item.media_type, { id: item.id });
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextPage() {
  currentPage.value++;
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
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
