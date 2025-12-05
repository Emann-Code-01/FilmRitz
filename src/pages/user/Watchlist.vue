<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Ambient Glow -->
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="flex items-center gap-4">
          <div
            class="w-20 h-20 rounded-2xl bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl"
          >
            ♥
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              My Watchlist
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              {{ watchlist.length }} item{{ watchlist.length !== 1 ? "s" : "" }}
              saved
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- CONTENT -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 mx-auto">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <div v-for="n in 12" :key="n" class="animate-pulse">
          <div class="aspect-2/3 bg-gray-800/50 rounded-2xl mb-3"></div>
          <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!watchlist.length" class="text-center py-20">
        <div class="text-8xl mb-6 animate-pulse">♡</div>
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">
          Your Watchlist is Empty
        </h2>
        <p class="text-gray-400 font-[Gilroy-Medium] mb-8 max-w-md mx-auto">
          Start adding movies and shows to keep track of what you want to watch
        </p>
        <router-link
          to="/ng"
          class="inline-block px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all transform hover:scale-105"
        >
          Browse Content
        </router-link>
      </div>

      <!-- Watchlist Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <div
          v-for="item in watchlist"
          :key="item.id"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all"
        >
          <!-- Clickable Card -->
          <div @click="goToMedia(item)" class="relative">
            <!-- Poster -->
            <div class="aspect-2/3 overflow-hidden">
              <img
                loading="lazy"
                :src="getPoster(item.poster_path)"
                :alt="item.title || item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
              />
            </div>

            <!-- linear Overlay -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>

            <!-- Info Overlay (on hover) -->
            <div
              class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-500"
            >
              <h3
                class="text-white font-[Gilroy-Bold] line-clamp-2 mb-2 text-2xl"
              >
                {{ item.title || item.name }}
              </h3>
              <div class="flex items-center gap-2 text-xs">
                <span
                  class="px-3 py-1.5 bg-[#b20710]/70 text-green-100 rounded-full text-sm font-[Gilroy-SemiBold]"
                >
                  {{ item?.vote_average?.toFixed(1) }}
                </span>
                <span
                  class="px-3 py-1.5 text-white bg-white/10 rounded-full text-sm font-[Gilroy-SemiBold]"
                >
                  {{ item.media_type.toUpperCase() }}
                </span>
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

          <button
            @click.stop="removeItem(item.id)"
            class="hover:bg-[#b20710]/70 absolute top-3 right-3 rounded-full p-1 transition-all duration-300 z-20 cursor-pointer hover:scale-110"
            title="Remove from watchlist"
          >
            <svg
              viewBox="0 0 36 36"
              width="24"
              height="24"
              class="transform -rotate-45"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useWatchlistStore } from "@/stores/watchlist";
import type { WatchItem } from "@/types/media";
import { genreMap } from "@/types/media";
import { useRouter } from "vue-router";

const store = useWatchlistStore();
store.loadFromLocalStorage();

const watchlist = computed<WatchItem[]>(() => store.items);
const router = useRouter();
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
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
  if (!path) return "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
  return `https://image.tmdb.org/t/p/w500${path}`;
}
</script>
