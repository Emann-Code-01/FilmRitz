<!-- src/pages/Watchlist.vue -->
<template>
    <section class="min-h-screen text-white py-10 px-6 md:px-10 mt-18 transition-all duration-900 animate-fade-up">
        <h1 class="text-3xl font-[Gilroy-Bold]">My Watchlist</h1>

        <!-- Empty State -->
        <p v-if="!watchlist.length && !loading" class="text-gray-400 mt-4">
            Your watchlist is empty. Start adding movies or shows!
        </p>
        <div v-if="!watchlist.length && !loading" class="mt-4 text-center">
            <RouterLink to="/ng"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-[Gilroy-SemiBold] transition-all duration-200">
                Go to Browse
            </RouterLink>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-7">
            <div v-for="n in 12" :key="n" class="animate-pulse">
                <div class="w-full h-72 bg-white/10 rounded-2xl mb-3"></div>
                <div class="h-4 bg-white/20 rounded w-3/4 mb-1"></div>
                <div class="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
        </div>

        <!-- Watchlist Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-7">
            <div v-for="item in watchlist" :key="item.id"
                class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40">
                <!-- Clickable Card -->
                <div @click="goToMedia(item)" class="w-full h-full">
                    <!-- Poster Image -->
                    <img loading="lazy" :src="getPoster(item.poster_path)" :alt="item.title"
                        class="w-full object-cover group-hover:scale-105 transition-all duration-300 rounded-2xl" />
                    <div
                        class="absolute inset-0 bg-linear-to-t from-black/90 via-transparent opacity-100 group-hover:opacity-100 transition-all">
                    </div>
                    <!-- Info Bottom Left -->
                    <div
                        class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <h3 class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">
                            {{ item.title || item.name }}
                        </h3>

                        <!-- Release Year & Vote Average -->
                        <div class="flex gap-2 mt-1 items-center text-sm text-gray-300">
                            <span v-if="item.release_date">{{ new Date(item.release_date).getFullYear() }}</span>
                            <span v-if="item.vote_average" class="text-green-500">{{ item.vote_average.toFixed(1)
                            }}/10</span>
                        </div>
                    </div>
                </div>

                <!-- Remove Button Top Right -->
                <div class="absolute top-2 right-2 cursor-pointer">
                    <button @click.stop="removeItem(item.id)"
                        class="text-red-800 hover:text-red-600 transition-all duration-200 hover:scale-125 animate-pulse cursor-pointer">
                        ♥
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useWatchlistStore } from "@/stores/watchlist";
import type { WatchItem } from "@/types/media";
import { useRouter } from "vue-router";

const store = useWatchlistStore();
store.loadFromLocalStorage();

const watchlist = computed<WatchItem[]>(() => store.items);
const router = useRouter();
const loading = ref(true);

onMounted(() => {
    setTimeout(() => {
        loading.value = false;
    }, 800);
});

function removeItem(id: number) {
    store.removeFromWatchlist(id);
}

function goToMedia(item: WatchItem) {
    const type = item.media_type === "tv" ? "tv" : "movie";
    const slug = encodeURIComponent((item.title || item.name || "untitled")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
    router.push(`/ng/${type}/${slug}-${item.id}`);
}

function getPoster(path: string | null) {
    if (!path) return "/no-poster.jpg";
    return `https://image.tmdb.org/t/p/w1280${path}`;
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
