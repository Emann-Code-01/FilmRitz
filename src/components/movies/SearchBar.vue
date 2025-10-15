<template>
    <div class="relative z-40 w-full mx-auto">
        <div
            class="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 focus-within:ring-2 ring-red-500/70 transition-all duration-300">
            <i class="pi pi-search text-gray-300 text-lg"></i>
            <input v-model="query" type="text" placeholder="Search for movies, actors, or genres..."
                class="flex-1 bg-transparent outline-none text-white placeholder-gray-400 font-[Gilroy-Medium] text-lg" />
            <button v-if="query" @click="clearSearch"
                class="text-gray-400 hover:text-white transition-all duration-200">
                <i class="pi pi-times text-xl"></i>
            </button>
        </div>

        <div v-if="loading" class="absolute left-0 right-0 text-center py-4 text-gray-400 animate-pulse">
            Searching movies...
        </div>

        <div v-if="error" class="absolute left-0 right-0 text-center py-4 text-red-400">
            {{ error }}
        </div>

        <div v-if="searchResults.length > 0 && query"
            class="absolute top-[110%] w-full bg-black/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto transition-all duration-300">
            <div v-for="movie in searchResults" :key="movie.id"
                class="flex items-center gap-4 p-3 hover:bg-white/10 cursor-pointer transition-all duration-200"
                @click="openMovieModal(movie)">
                <img :src="getPoster(movie.poster_path)" alt="poster"
                    class="w-14 h-20 object-cover rounded-lg shadow-md" />
                <div class="flex flex-col justify-center">
                    <h3 class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">{{ movie.title }}</h3>
                    <p class="text-gray-400 text-sm">
                        {{ new Date(movie.release_date).getFullYear() }} · ⭐
                        {{ movie.vote_average.toFixed(1) }}
                    </p>
                </div>
            </div>
        </div>

        <div v-else-if="!loading && query && searchResults.length === 0"
            class="absolute left-0 right-0 text-center py-4 text-gray-400">
            No results found for "{{ query }}"
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useMovies } from "../../composables/useMovie";
import { useModalStore } from "../../stores/modalStore";

const { searchMovies, searchResults, loading, error } = useMovies();
const modalStore = useModalStore();

const query = ref("");
let debounceTimer: ReturnType<typeof setTimeout>;

const getPoster = (path: string) =>
    path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "https://via.placeholder.com/300x450?text=No+Image";

watch(query, (newVal) => {
    clearTimeout(debounceTimer);
    if (!newVal.trim()) {
        searchResults.value = [];
        return;
    }
    debounceTimer = setTimeout(async () => {
        try {
            loading.value = true;
            await searchMovies(newVal);
        } catch (err: any) {
            console.error("❌ Search failed:", err);
        } finally {
            loading.value = false;
        }
    }, 600);
});

function openMovieModal(movie: any) {
    modalStore.open("movie", { movieId: movie.id });
    query.value = "";
    searchResults.value = [];
}

function clearSearch() {
    query.value = "";
    searchResults.value = [];
}
</script>

<style scoped>
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 8px;
}
</style>
