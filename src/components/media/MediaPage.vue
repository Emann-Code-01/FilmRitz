<template>
    <div class="min-h-screen text-white py-10 mt-18 transition-all duration-900 animate-fade-up">
        <!-- Hero Section -->
        <div class="px-6 md:px-10 mb-6">
            <div class="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <!-- Title & Description -->
                <div class="flex flex-col items-center text-center">
                    <h1 class="text-3xl font-[Gilroy-Bold]">
                        {{ isMoviePage ? "Discover Movies" : "Discover TV Shows" }}
                    </h1>
                    <p class="mt-2 text-gray-300 font-[Gilroy-Medium] max-w-xl">
                        Explore the trending and top-rated {{ isMoviePage ? "movies" : "TV shows" }}.
                    </p>
                </div>

                <swiper :modules="[EffectCards, Autoplay]" effect="cards" :grab-cursor="true" loop
                    class="h-64 rounded-xl mx-auto" :autoplay="{ delay: 3000, disableOnInteraction: true }">
                    <swiper-slide v-for="item in filteredMedia" :key="item.id + item.media_type"
                        class="rounded-xl overflow-hidden">
                        <img :src="getPoster(item.poster_path)" :alt="item.title || item.name"
                            class="w-48 h-64 object-cover rounded-xl" />
                    </swiper-slide>
                </swiper>
            </div>
        </div>

        <!-- Local Filter Panel -->
        <div class="mt-6 flex flex-col md:flex-row gap-4 items-start px-6 md:px-10">
            <div class="flex flex-wrap gap-3">
                <!-- Genre -->
                <select v-model="appliedFilters.genre"
                    class="bg-gray-800 rounded px-3 py-1 outline-none cursor-pointer">
                    <option value="">All Genres</option>
                    <option v-for="g in genres" :key="g.id" :value="g.id">
                        {{ g.name }}
                    </option>
                </select>

                <!-- Year -->
                <input type="number" v-model.number="appliedFilters.year" placeholder="Year"
                    class="bg-gray-800 rounded px-3 py-1 w-24 outline-none" />
                <input type="number" v-model.number="appliedFilters.rating" min="0" max="10" step="0.1"
                    placeholder="0 - 10" class="p-2 rounded bg-gray-800 text-white w-24 outline-none" />

                <select v-model="appliedFilters.sort" class="bg-gray-800 rounded px-3 py-1 outline-none cursor-pointer">
                    <option value="">Sort By</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="topRated">Top Rated</option>
                </select>

                <button @click="clearFilters"
                    class="bg-red-600 hover:bg-red-700 transition-all duration-900 cursor-pointer px-3 py-1 disabled:cursor-not-allowed rounded">
                    Clear
                </button>
            </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex gap-4 mt-6 overflow-x-auto px-6 md:px-10 cursor-pointer">
            <button v-for="cat in categories" :key="cat.value" @click="selectedCategory = cat.value" :class="[
                'px-4 py-2 rounded-lg font-semibold whitespace-nowrap',
                selectedCategory === cat.value
                    ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    : 'bg-gray-800 hover:bg-gray-700 cursor-pointer',
            ]">
                {{ cat.label }}
            </button>
        </div>

        <!-- Media Grid -->
        <div v-if="loading"
            class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
            <div v-for="n in 10" :key="n" class="bg-gray-700 h-60 rounded-lg"></div>
        </div>

        <div v-else-if="error" class="mt-6 text-center text-red-500">
            {{ error }}
        </div>

        <div v-else class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-6 md:px-10">
            <div v-for="item in filteredMedia" :key="item.id + item.media_type"
                @click.prevent.stop="modalStore.open(item.media_type, { id: item.id })"
                class="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg">
                <img :src="getPoster(item.poster_path)" alt="poster"
                    class="w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    @click="openModal(item)" />
                <div
                    class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <h3 class="text-lg font-[Gilroy-SemiBold] line-clamp-2">
                        {{ item.title || item.name }}
                    </h3>
                    <div class="flex gap-2 items-center text-xs mt-1 flex-wrap">
                        <span
                            class="px-2 py-1 bg-[#b20710]/70 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">
                            {{ item.vote_average?.toFixed(1) }}
                        </span>
                        <span class="px-2 py-1 text-white bg-white/10 rounded-md text-sm font-[Gilroy-SemiBold]">{{
                            item.media_type.toUpperCase() }}</span>
                        <span class="text-sm font-[Gilroy-Medium]">
                            {{ (item.release_date || item.first_air_date)?.slice(0, 4) }}
                        </span>
                        <router-link v-for="genreName in getGenreNames(item.genre_ids)" :key="genreName"
                            :to="{ name: 'GenreView', params: { name: genreName.toLowerCase() } }" @click.stop
                            class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200 cursor-pointer">
                            {{ genreName }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-8 gap-2">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                Prev
            </button>
            <span class="px-3 py-1 bg-gray-900 rounded">{{ currentPage }}</span>
            <button @click="nextPage" :disabled="filteredMedia.length < perPage"
                class="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                Next
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMedia } from "../../composables/useMedia";
import { useModalStore } from "../../stores/modalStore";
import { genreMap } from "../../types/genres";
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
    year: null,
    rating: null,
    sort: "",
});

// Categories
const categories = [
    { label: "All", value: "all" },
    { label: "Trending", value: "trending" },
    { label: "Top Rated", value: "topRated" },
    { label: "Upcoming", value: "upcoming" },
];

// Filtered & Paginated Media
const filteredMedia = computed(() => {
    let data = trendingAll.value.filter((m) =>
        isMoviePage.value ? m.media_type === "movie" : m.media_type === "tv"
    );

    // Apply category filter
    if (selectedCategory.value === "topRated") {
        data = data.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (selectedCategory.value === "upcoming") {
        data = data.filter(
            (m) => (m.release_date || "") >= new Date().toISOString().slice(0, 10)
        );
    }

    // Apply user filters
    data = data.filter((m) => {
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

    // Apply sorting
    if (appliedFilters.value.sort === "newest") {
        data = data.sort((a, b) =>
            (b.release_date || b.first_air_date || "").localeCompare(
                a.release_date || a.first_air_date || ""
            )
        );
    } else if (appliedFilters.value.sort === "oldest") {
        data = data.sort((a, b) =>
            (a.release_date || a.first_air_date || "").localeCompare(
                b.release_date || b.first_air_date || ""
            )
        );
    } else if (appliedFilters.value.sort === "topRated") {
        data = data.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }

    // Pagination
    const start = (currentPage.value - 1) * perPage;
    return data.slice(start, start + perPage);
});


// Methods
function clearFilters() {
    appliedFilters.value = { genre: "", year: null, rating: null, sort: "" };
    currentPage.value = 1;
}

function openModal(item: any) {
    modalStore.open(item.media_type, { id: item.id });
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
    currentPage.value++;
}

// Fetch initial trending
onMounted(async () => {
    if (!trendingAll.value.length) {
        try {
            await getTrendingAll();
        } catch (err) {
            console.error("Failed fetching trending media", err);
        }
    }
});

// Helpers
function getPoster(path: string | null) {
    if (!path) return "/no-poster.jpg";
    return `https://image.tmdb.org/t/p/w500${path}`;
}

function getGenreNames(genreIds?: number[]) {
    if (!genreIds || !genreIds.length) return ["Unknown"];
    return genreIds.map((id) => genreMap[id]).filter(Boolean);
}
</script>

<style scoped>
/* Prevent Swiper from centering itself */
.swiper {
    width: 100% !important;
    max-width: 18rem;
    height: 16rem;
    background: transparent !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
}

/* Prevent slide background */
.swiper-slide {
    border-radius: 1rem;
    overflow: hidden;
    background: transparent !important;
}

/* Remove Swiper’s shadows */
.swiper-slide-shadow-left,
.swiper-slide-shadow-right,
.swiper-slide-shadow-top,
.swiper-slide-shadow-bottom {
    background: transparent !important;
}

/* Remove internal forced centering */
.swiper-wrapper {
    width: auto !important;
}

/* Side preview/scale effect */
.swiper-slide-next,
.swiper-slide-prev {
    transform: scale(0.9) translateY(8px);
    opacity: 0.9;
}
</style>