<!-- (Enhanced Watchlist) -->
<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20  ">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div
          class="grid space-y-3 md:space-y-0 md:flex items-center md:justify-between"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
            >
              ♥
            </div>
            <div>
              <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">My List</h1>
              <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
                {{ watchlist.length }} item{{
                  watchlist.length !== 1 ? "s" : ""
                }}
                saved
              </p>
            </div>
          </div>

          <!-- Sort Options -->
          <select
            v-model="sortBy"
            class="px-4 py-2 bg-gray-950 border border-white/10 rounded-xl text-white font-[Gilroy-Medium] focus:ring-2 focus:ring-[#b20710] focus:outline-none cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Title (A-Z)</option>
            <option value="rating">Rating</option>
            <option value="year">Release Year</option>
          </select>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 mx-auto">
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <div
          v-for="n in 12"
          :key="n"
          class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <div v-else-if="!watchlist.length" class="text-center py-20">
        <div class="text-8xl mb-6 animate-pulse">♡</div>
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">Your List is Empty</h2>
        <p class="text-gray-400 font-[Gilroy-Medium] mb-8 max-w-md mx-auto">
          Start adding movies and shows to keep track of what you want to watch
        </p>
        <router-link
          to="/ng"
          class="inline-block px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-full font-[Gilroy-Bold] transition-all transform hover:scale-105"
        >
          Browse Content
        </router-link>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <div
          v-for="item in sortedWatchlist"
          :key="item.id"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 duration-500 transition-all"
        >
          <div @click="goToMedia(item)">
            <div class="aspect-2/3 overflow-hidden">
              <img
                :src="getPoster(item.poster_path)"
                class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
              />
            </div>

            <div
              class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>

            <div
              class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            >
              <h3
                class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2"
              >
                {{ item.title || item.name }}
              </h3>
              <div class="flex items-center gap-2 text-xs">
                <span v-if="item.release_date" class="text-gray-300">
                  {{ new Date(item.release_date).getFullYear() }}
                </span>
                <span v-if="item.vote_average" class="text-yellow-400 flex items-center gap-1">
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="size-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd"
                  />
                </svg> {{ item.vote_average.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>

          <button
            @click.stop="removeItem(item.id)"
            class="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all z-10 transform cursor-pointer hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWatchlistStore } from "@/stores/watchlist";
import type { WatchItem } from "@/types/media";
import AdSlot from "@/components/ads/AdSlot.vue";

const router = useRouter();
const store = useWatchlistStore();
store.loadFromLocalStorage();

const watchlist = computed<WatchItem[]>(() => store.items);
const loading = ref(true);
const sortBy = ref("recent");

const sortedWatchlist = computed(() => {
  const items = [...watchlist.value];

  switch (sortBy.value) {
    case "title":
      return items.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || "")
      );
    case "rating":
      return items.sort(
        (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
      );
    case "year":
      return items.sort((a, b) => {
        const yearA = new Date(a.release_date || "").getFullYear() || 0;
        const yearB = new Date(b.release_date || "").getFullYear() || 0;
        return yearB - yearA;
      });
    default:
      return items;
  }
});

function removeItem(id: number) {
  store.removeFromWatchlist(id);
}

function goToMedia(item: WatchItem) {
  const type = item.media_type === "tv" ? "tv" : "movie";
  const slug = encodeURIComponent(
    (item.title || item.name || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
  router.push(`/ng/${type}/${slug}-${item.id}`);
}

function getPoster(path: string | null) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
}

onMounted(() => {
  setTimeout(() => (loading.value = false), 500);
});
</script>
