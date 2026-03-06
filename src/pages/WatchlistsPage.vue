<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <!-- Hero header -->
    <div class="relative pt-28 pb-16 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 opacity-30"
        style="
          background: radial-gradient(
            circle at 60% 40%,
            #6366f140,
            transparent 70%
          );
        "
      ></div>
      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div class="space-y-3">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400"
            >
              <span class="animate-pulse">●</span> Intent-Aware
            </div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              My Watchlists
            </h1>
            <p class="text-gray-400 font-[Gilroy-Medium] max-w-md">
              Smart lists that understand your mood, time, and viewing context.
            </p>
          </div>

          <!-- Stats row -->
          <div class="flex gap-6">
            <div class="text-center">
              <div class="text-3xl font-[Gilroy-Bold] text-indigo-400">
                {{ totalWatchlists }}
              </div>
              <div class="text-xs text-gray-500 font-[Gilroy-Medium] mt-1">
                Lists
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-[Gilroy-Bold] text-emerald-400">
                {{ totalFilms }}
              </div>
              <div class="text-xs text-gray-500 font-[Gilroy-Medium] mt-1">
                Films
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky controls bar -->
    <div
      class="sticky top-20 md:top-24 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 py-3"
    >
      <div
        class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto flex items-center justify-between gap-4"
      >
        <!-- Filter pills -->
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            class="shrink-0 px-4 py-1.5 rounded-full text-sm font-[Gilroy-SemiBold] transition-all duration-300"
            :class="
              activeFilter === filter.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            "
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Create button -->
        <button
          @click="showCreateModal = true"
          class="shrink-0 flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-[Gilroy-SemiBold] transition-all text-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          New List
        </button>
      </div>
    </div>

    <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto mt-10">
      <!-- Loading skeletons -->
      <div v-if="isLoading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="n in 6"
          :key="n"
          class="h-56 rounded-3xl bg-white/5 animate-pulse"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-5xl mb-4">😕</div>
        <h3 class="text-xl font-[Gilroy-Bold] mb-2 text-gray-200">
          Couldn't load your watchlists
        </h3>
        <p class="text-gray-500 mb-6">{{ error }}</p>
        <button
          @click="fetchWatchlists"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-[Gilroy-SemiBold] transition-all cursor-pointer"
        >
          Retry
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredWatchlists.length === 0"
        class="text-center py-24 space-y-6"
      >
        <div
          class="w-24 h-24 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-5xl"
        >
          🎬
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-[Gilroy-Bold]">
            {{
              activeFilter === "all" ? "No watchlists yet" : "No matching lists"
            }}
          </h3>
          <p class="text-gray-400 font-[Gilroy-Medium]">
            Create your first intent-aware watchlist to start organizing films
            by mood and context.
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-[Gilroy-Bold] transition-all cursor-pointer"
        >
          Create First Watchlist
        </button>
      </div>

      <!-- Watchlist grid -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(watchlist, index) in filteredWatchlists"
          :key="watchlist.id"
          class="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
          :style="{ animationDelay: `${index * 60}ms` }"
          @click="selectWatchlist(watchlist)"
        >
          <!-- Glow accent -->
          <div
            class="absolute top-0 left-0 right-0 h-1 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            :class="intentAccentClass(watchlist)"
          ></div>

          <!-- Card body -->
          <div class="p-6 flex-1 space-y-4">
            <div class="flex items-start justify-between gap-2">
              <!-- Title & date -->
              <div class="flex-1 min-w-0">
                <h3
                  class="text-lg font-[Gilroy-Bold] text-white truncate group-hover:text-indigo-300 transition-colors"
                >
                  {{ watchlist.name }}
                </h3>
                <p class="text-xs text-gray-500 font-[Gilroy-Medium] mt-0.5">
                  {{ formatDate(watchlist.created_at) }}
                </p>
              </div>

              <!-- Relevance badge -->
              <div
                v-if="watchlist.relevance_score"
                class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              >
                {{ Math.round(watchlist.relevance_score * 100) }}% match
              </div>
            </div>

            <!-- Description -->
            <p
              v-if="watchlist.description"
              class="text-sm text-gray-400 font-[Gilroy-Medium] line-clamp-2"
            >
              {{ watchlist.description }}
            </p>

            <!-- Intent context tags -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-if="watchlist.dominant_intent?.time_available"
                class="px-2.5 py-1 rounded-full text-[10px] font-[Gilroy-SemiBold] bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1"
              >
                ⏱ {{ watchlist.dominant_intent.time_available }}min
              </span>
              <span
                v-for="mood in (watchlist.dominant_intent?.mood ?? []).slice(
                  0,
                  2,
                )"
                :key="mood"
                class="px-2.5 py-1 rounded-full text-[10px] font-[Gilroy-SemiBold] bg-purple-500/10 text-purple-300 border border-purple-500/20"
              >
                {{ mood }}
              </span>
              <span
                v-if="watchlist.dominant_intent?.commitment_level"
                class="px-2.5 py-1 rounded-full text-[10px] font-[Gilroy-SemiBold] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 capitalize"
              >
                {{ watchlist.dominant_intent.commitment_level }}
              </span>
              <span
                v-if="watchlist.is_public"
                class="px-2.5 py-1 rounded-full text-[10px] font-[Gilroy-SemiBold] bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                Public
              </span>
            </div>
          </div>

          <!-- Footer stats + actions -->
          <div class="px-6 pb-5 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fill-rule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ watchlist.items.length }}
                {{ watchlist.items.length === 1 ? "film" : "films" }}
              </span>
              <span
                v-if="watchlist.usage_frequency > 0"
                class="flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ watchlist.usage_frequency }}× used
              </span>
            </div>

            <!-- Use Now button -->
            <button
              @click.stop="useWatchlist(watchlist)"
              class="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-[Gilroy-SemiBold] rounded-xl border border-indigo-500/30 hover:border-indigo-500 transition-all duration-200 cursor-pointer"
            >
              Use Now →
            </button>
          </div>

          <!-- Hover shimmer -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
            style="
              background: radial-gradient(
                circle at 50% 0%,
                rgba(99, 102, 241, 0.06),
                transparent 60%
              );
            "
          ></div>
        </div>
      </div>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIntentWatchlists } from "@/composables/useIntentWatchlists";
import CreateWatchlistModal from "@/components/watchlists/CreateWatchlistModal.vue";
import type { WatchlistWithItems } from "@/types/intelligence";
import { useHead } from "@unhead/vue";

useHead({
  title: "My Watchlists — FilmRitz",
  meta: [
    {
      name: "description",
      content:
        "Manage your intent-aware watchlists on FilmRitz. Organize films by mood, time and commitment level.",
    },
  ],
});

const router = useRouter();
const { relevantWatchlists, isLoading, error, fetchWatchlists } =
  useIntentWatchlists();
const showCreateModal = ref(false);
const activeFilter = ref("all");

const filters = [
  { id: "all", label: "All Lists" },
  { id: "public", label: "Public" },
  { id: "private", label: "Private" },
  { id: "recent", label: "Recently Used" },
];

onMounted(() => {
  fetchWatchlists();
});

// ── Computed ──────────────────────────────────────────────

const totalWatchlists = computed(() => relevantWatchlists.value.length);

const totalFilms = computed(() =>
  relevantWatchlists.value.reduce(
    (sum: number, w: WatchlistWithItems) => sum + w.items.length,
    0,
  ),
);

const filteredWatchlists = computed(() => {
  const wl = relevantWatchlists.value as WatchlistWithItems[];
  if (activeFilter.value === "all") return wl;
  if (activeFilter.value === "public") return wl.filter((w) => w.is_public);
  if (activeFilter.value === "private") return wl.filter((w) => !w.is_public);
  if (activeFilter.value === "recent")
    return [...wl].sort(
      (a, b) =>
        new Date(b.last_used_at || b.updated_at).getTime() -
        new Date(a.last_used_at || a.updated_at).getTime(),
    );
  return wl;
});

// ── Helpers ───────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function intentAccentClass(watchlist: WatchlistWithItems) {
  const moods = watchlist.dominant_intent?.mood ?? [];
  if (moods.some((m: string) => /chill|relax|calm/i.test(m)))
    return "bg-linear-to-r from-blue-500 to-cyan-500";
  if (moods.some((m: string) => /intense|epic|action/i.test(m)))
    return "bg-linear-to-r from-red-500 to-orange-500";
  if (moods.some((m: string) => /mind|complex|deep/i.test(m)))
    return "bg-linear-to-r from-purple-500 to-indigo-500";
  return "bg-linear-to-r from-indigo-500 to-emerald-500";
}

// ── Actions ───────────────────────────────────────────────

const selectWatchlist = (watchlist: WatchlistWithItems) => {
  router.push(`/ng/watchlist/${watchlist.id}`);
};

const useWatchlist = (watchlist: WatchlistWithItems) => {
  router.push({
    name: "Discovery",
    query: { intent: JSON.stringify(watchlist.dominant_intent) },
  });
};

const onWatchlistCreated = () => {
  showCreateModal.value = false;
  fetchWatchlists();
};
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
