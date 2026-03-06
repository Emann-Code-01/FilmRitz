<template>
  <div class="intent-watchlists space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2">
        <h2
          class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
        >
          <span class="text-2xl">📚</span>
          My Intelligence Lists
        </h2>
        <p class="text-stone-500 font-[Gilroy-Medium] text-sm max-w-md">
          Curated by your intent, historical behavior, and aesthetic
          preferences.
        </p>
      </div>

      <button
        @click="showCreateModal = true"
        class="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-[Gilroy-SemiBold] transition-all text-sm cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        New Watchlist
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="n in 3"
        :key="n"
        class="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-16 bg-white/5 rounded-3xl border border-white/5"
    >
      <div class="text-4xl mb-4">⚠️</div>
      <p class="text-red-400 font-[Gilroy-SemiBold] mb-6 px-6">{{ error }}</p>
      <button
        @click="fetchWatchlists"
        class="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-[Gilroy-SemiBold] transition-all cursor-pointer border border-white/10"
      >
        Try Again
      </button>
    </div>

    <!-- Watchlists Grid -->
    <div
      v-else-if="relevantWatchlists.length"
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="(watchlist, index) in relevantWatchlists"
        :key="watchlist.id"
        class="group relative bg-stone-900/50 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
        :style="{ animationDelay: `${index * 80}ms` }"
        @click="selectWatchlist(watchlist)"
      >
        <!-- Dynamic Gradient Accent -->
        <div
          class="absolute top-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          :class="getAccentColor(watchlist)"
        ></div>

        <!-- Card Body -->
        <div class="p-6 flex-1 space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h3
                class="text-lg font-[Gilroy-Bold] text-white truncate group-hover:text-indigo-300 transition-colors"
              >
                {{ watchlist.name }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <span
                  class="text-[10px] text-stone-500 font-mono uppercase tracking-widest"
                >
                  {{ watchlist.items.length }} Items
                </span>
                <span class="w-1 h-1 rounded-full bg-stone-700"></span>
                <span
                  class="text-[10px] text-stone-500 font-mono uppercase tracking-widest"
                >
                  {{ watchlist.usage_frequency }} Hits
                </span>
              </div>
            </div>

            <div
              class="shrink-0 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            >
              {{ Math.round((watchlist.relevance_score || 0) * 100) }}% match
            </div>
          </div>

          <p
            v-if="watchlist.description"
            class="text-sm text-stone-400 font-[Gilroy-Medium] line-clamp-2 leading-relaxed"
          >
            {{ watchlist.description }}
          </p>

          <!-- Intent Context Badges -->
          <div class="flex flex-wrap gap-1.5 pt-2">
            <span
              v-if="watchlist.dominant_intent?.time_available"
              class="px-2.5 py-1 rounded-lg text-[9px] font-[Gilroy-Bold] bg-white/5 text-stone-400 border border-white/10 uppercase"
            >
              ⏱ {{ watchlist.dominant_intent.time_available }}m
            </span>
            <span
              v-for="mood in (watchlist.dominant_intent?.mood ?? []).slice(
                0,
                2,
              )"
              :key="mood"
              class="px-2.5 py-1 rounded-lg text-[9px] font-[Gilroy-Bold] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase"
            >
              #{{ mood }}
            </span>
            <span
              v-if="watchlist.dominant_intent?.commitment_level"
              class="px-2.5 py-1 rounded-lg text-[9px] font-[Gilroy-Bold] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase"
            >
              {{ watchlist.dominant_intent.commitment_level }}
            </span>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="px-6 pb-6 pt-2 flex items-center gap-3">
          <button
            @click.stop="useWatchlist(watchlist)"
            class="flex-1 px-4 py-2.5 bg-indigo-600/10 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white text-[11px] font-[Gilroy-Bold] rounded-xl border border-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300 shadow-sm uppercase tracking-widest"
          >
            Launch Context
          </button>
          <button
            @click.stop="editWatchlist(watchlist)"
            class="shrink-0 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white rounded-xl border border-white/5 transition-all text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>

        <!-- Subtle Hover Shimmer -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style="
            background: radial-gradient(
              circle at 50% -10%,
              rgba(99, 102, 241, 0.08),
              transparent 70%
            );
          "
        ></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-20 bg-stone-900/40 rounded-[3rem] border border-white/5 border-dashed"
    >
      <div
        class="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-4xl mb-6 grayscale opacity-40"
      >
        📼
      </div>
      <h3 class="text-xl font-[Gilroy-Bold] text-white mb-2">
        Initialize your intelligence library
      </h3>
      <p class="text-stone-500 font-[Gilroy-Medium] max-w-sm mx-auto mb-8">
        Organize films by viewing slots, moods, and mental commitment levels.
      </p>
      <button
        @click="showCreateModal = true"
        class="px-8 py-3 bg-white text-black rounded-2xl font-[Gilroy-Bold] hover:bg-stone-200 transition-all cursor-pointer shadow-xl shadow-white/5 active:scale-95"
      >
        Create Intelligence List
      </button>
    </div>

    <!-- Create Watchlist Modal -->
    <CreateWatchlistModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="onWatchlistCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIntentWatchlists } from "@/composables/useIntentWatchlists";
import CreateWatchlistModal from "@/components/watchlists/CreateWatchlistModal.vue";
import type { WatchlistWithItems } from "@/types/intelligence";

const router = useRouter();
const { relevantWatchlists, isLoading, error, fetchWatchlists } =
  useIntentWatchlists();
const showCreateModal = ref(false);

onMounted(() => {
  fetchWatchlists();
});

const selectWatchlist = (watchlist: WatchlistWithItems) => {
  router.push(`/ng/watchlist/${watchlist.id}`);
};

const useWatchlist = (watchlist: WatchlistWithItems) => {
  router.push({
    name: "Discovery",
    query: {
      intent: JSON.stringify(watchlist.dominant_intent),
    },
  });
};

const editWatchlist = (watchlist: WatchlistWithItems) => {
  console.log("Edit watchlist:", watchlist);
};

const onWatchlistCreated = () => {
  showCreateModal.value = false;
  fetchWatchlists();
};

function getAccentColor(watchlist: WatchlistWithItems) {
  const moods = watchlist.dominant_intent?.mood ?? [];
  if (moods.some((m: string) => /chill|relax|calm|soft/i.test(m)))
    return "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-400";
  if (moods.some((m: string) => /intense|dark|thrill|horror|action/i.test(m)))
    return "bg-linear-to-r from-red-600 via-orange-500 to-amber-500";
  if (moods.some((m: string) => /mind|deep|epic|journey|complex/i.test(m)))
    return "bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500";
  return "bg-linear-to-r from-indigo-500 via-indigo-400 to-blue-400";
}
</script>

<style scoped>
.intent-watchlists {
  animation: fade-up 0.8s ease-out;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
