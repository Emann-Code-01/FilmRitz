<!-- (Enhanced Watchlist) -->
<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
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
        <MediaCard
          v-for="item in normalizedWatchlist"
          :key="item.id"
          :media="item"
          show-remove
          @remove="removeItem(item.id)"
        />
      </div>
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWatchlistStore } from "@/stores/watchlist";
import { IntelligenceService } from "@/services/intelligenceService";
import MediaCard from "@/components/media/MediaCard.vue";
import AdSlot from "@/components/ads/AdSlot.vue";
import { useHead } from "@unhead/vue";

useHead({
  title: "My List — FilmRitz",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const store = useWatchlistStore();
store.loadFromLocalStorage();

const watchlist = computed(() => store.items);
const loading = ref(true);
const sortBy = ref("recent");

const normalizedWatchlist = computed(() => {
  const items = [...watchlist.value];

  // Sort first
  let sorted;
  switch (sortBy.value) {
    case "title":
      sorted = items.sort((a, b) =>
        (a.title || a.name || "").localeCompare(b.title || b.name || ""),
      );
      break;
    case "rating":
      sorted = items.sort(
        (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
      );
      break;
    case "year":
      sorted = items.sort((a, b) => {
        const yearA =
          new Date(a.release_date || a.first_air_date || "").getFullYear() || 0;
        const yearB =
          new Date(b.release_date || b.first_air_date || "").getFullYear() || 0;
        return yearB - yearA;
      });
      break;
    default:
      sorted = items;
  }

  // Normalize each item
  return sorted.map((item) =>
    IntelligenceService.normalize(item, item.media_type || "movie"),
  );
});

function removeItem(id: number) {
  store.removeFromWatchlist(id);
}

onMounted(() => {
  setTimeout(() => (loading.value = false), 500);
});
</script>
