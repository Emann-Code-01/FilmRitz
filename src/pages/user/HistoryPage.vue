<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="flex items-center justify-between">
          <div class="grid items-center gap-4 md:hidden">
            <div class="flex items-center space-x-3">
              <div
                class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
              >
                🕐
              </div>
              <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
                Watch History
              </h1>
            </div>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Your recently viewed content
            </p>
          </div>
          <div class="hidden md:flex items-center gap-4">
            <div
              class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
            >
              🕐
            </div>
            <div>
              <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
                Watch History
              </h1>
              <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
                Your recently viewed content
              </p>
            </div>
          </div>

          <button
            v-if="history.length"
            @click="clearHistory"
            class="px-3 md:px-6 py-2 md:py-2.5 bg-red-600/20 border border-red-600/50 text-red-400 rounded-xl font-[Gilroy-SemiBold] hover:bg-red-600 hover:text-white transition-all"
          >
            Clear History
          </button>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 max-w-7xl mx-auto">
      <div v-if="loading" class="space-y-4">
        <div
          v-for="n in 10"
          :key="n"
          class="flex gap-4 bg-gray-800/50 rounded-2xl p-4 animate-pulse"
        >
          <div class="w-32 h-48 bg-gray-700 rounded-xl"></div>
          <div class="flex-1 space-y-3">
            <div class="h-6 bg-gray-700 rounded w-3/4"></div>
            <div class="h-4bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
      <div v-else-if="!history.length" class="text-center py-20">
        <div class="text-8xl mb-6">🕐</div>
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">No History Yet</h2>
        <p class="text-gray-400 font-[Gilroy-Medium] mb-8 max-w-md mx-auto">
          Start watching movies and shows to see your history here
        </p>
        <router-link
          to="/ng"
          class="inline-block px-8 py-4 bg-[#b20710] hover:bg-[#e32125] rounded-full font-[Gilroy-Bold] transition-all transform hover:scale-105"
        >
          Browse Content
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in history"
          :key="item.id"
          @click="goToMedia(item)"
          class="group flex gap-4 bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 hover:border-[#b20710]/50 transition-all cursor-pointer"
        >
          <div class="w-32 shrink-0">
            <img
              :src="getPoster(item.poster_path)"
              class="w-full h-48 object-cover rounded-xl"
            />
          </div>

          <div class="flex-1">
            <h3
              class="text-2xl font-[Gilroy-Bold] mb-2 group-hover:text-[#b20710] transition-colors"
            >
              {{ item.title || item.name }}
            </h3>

            <div class="flex flex-wrap items-center gap-3 mb-3 text-sm">
              <span
                class="px-3 py-1 bg-[#b20710] rounded-lg font-[Gilroy-SemiBold]"
              >
                {{ item.media_type === "tv" ? "TV Show" : "Movie" }}
              </span>
              <span class="text-yellow-400"
                >⭐ {{ item.vote_average?.toFixed(1) }}</span
              >
              <span class="text-gray-400">{{
                formatDate(item.release_date)
              }}</span>
            </div>

            <p class="text-gray-400 font-[Gilroy-Regular] line-clamp-2 mb-3">
              {{ item.overview }}
            </p>

            <div class="text-xs text-gray-500">
              Watched {{ getTimeAgo(item.watchedAt) }}
            </div>
          </div>

          <button
            @click.stop="removeFromHistory(item.id)"
            class="w-10 h-10 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-all"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdSlot from "@/components/ads/AdSlot.vue";

const router = useRouter();
const history = ref<any[]>([]);
const loading = ref(true);

function getPoster(path: string | null) {
  return path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : "https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE";
}

function formatDate(date: string) {
  if (!date) return "Unknown";
  return new Date(date).getFullYear().toString();
}

function getTimeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function goToMedia(item: any) {
  const type = item.media_type === "tv" ? "tv" : "movie";
  const slug = encodeURIComponent(
    (item.title || item.name || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
  router.push(`/ng/${type}/${slug}-${item.id}`);
}

function removeFromHistory(id: number) {
  history.value = history.value.filter((item) => item.id !== id);
  localStorage.setItem("watchHistory", JSON.stringify(history.value));
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    history.value = [];
    localStorage.removeItem("watchHistory");
  }
}

onMounted(() => {
  const stored = localStorage.getItem("watchHistory");
  history.value = stored ? JSON.parse(stored) : [];
  loading.value = false;
});
</script>
