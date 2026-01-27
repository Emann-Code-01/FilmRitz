<template>
  <div class="media-section-grid">
    <div class="grid grid-cols-12 gap-4 auto-rows-auto">
      <!-- Large Feature Item -->
      <div
        v-if="items[0]"
        class="col-span-12 md:col-span-6 lg:col-span-6 row-span-2 relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-[#b20710]/30"
        @mouseenter="handleHover(items[0], 0)"
        @mouseleave="handleMouseLeave"
        @click="openModal(items[0])"
      >
        <img
          loading="lazy"
          :src="getBackdropUrl(items[0].backdrop_path)"
          :alt="items[0].title || items[0].name"
          class="w-full h-full min-h-[500px] object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 border-l-4 transition-all duration-500"
          :style="{ borderColor: getTemperatureColor(0) }"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent"
        />

        <!-- Intelligence Overlays -->
        <div class="absolute top-6 left-6 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div
              class="w-16 h-16 bg-[#b20710] rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm"
            >
              <span class="text-3xl font-[Gilroy-Bold] text-white">#1</span>
            </div>

            <div
              v-if="items[0].intelligence?.context.whyTrending"
              class="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10"
            >
              <span class="text-lg animate-pulse">🔥</span>
              <span
                class="text-white font-[Gilroy-Bold] text-xs uppercase tracking-widest"
                >{{ items[0].intelligence.context.whyTrending[0] }}</span
              >
            </div>
          </div>

          <div v-if="items[0].intelligence" class="flex flex-wrap gap-2">
            <TrustRating
              :rating="items[0].vote_average"
              :trust="items[0].intelligence.trustRating"
              class="bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl"
            />
          </div>
        </div>

        <div
          class="absolute bottom-8 left-8 right-8 transition-transform duration-500 transform lg:translate-y-16 lg:group-hover:translate-y-0"
        >
          <div v-if="items[0].intelligence" class="mb-4">
            <IntelligenceChips :context="items[0].intelligence.context" />
          </div>

          <h3
            class="text-4xl font-[Gilroy-Bold] text-white mb-3 line-clamp-2 drop-shadow-2xl"
          >
            {{ items[0].title || items[0].name }}
          </h3>

          <div class="flex items-center gap-3 mb-3 text-sm">
            <span class="text-gray-300 font-[Gilroy-Medium]">
              {{ formatYear(items[0].release_date || items[0].first_air_date) }}
            </span>
            <span
              v-if="items[0].intelligence"
              class="text-white/60 px-2 py-0.5 bg-white/10 rounded uppercase tracking-tighter text-[10px] font-bold"
            >
              {{ items[0].intelligence.context.commitment.label }}
            </span>
          </div>

          <p
            class="text-gray-300 text-base font-[Gilroy-Regular] line-clamp-2 mb-4 max-w-2xl lg:opacity-0 lg:translate-y-5 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500"
          >
            {{ items[0].overview }}
          </p>
        </div>
      </div>

      <!-- Smaller Items -->
      <div
        v-for="(item, index) in items.slice(1, 7)"
        :key="item.id"
        class="col-span-6 md:col-span-3 lg:col-span-3 relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-500 hover:shadow-xl hover:shadow-[#b20710]/20 hover:scale-105"
        @mouseenter="handleHover(item, index + 1)"
        @mouseleave="handleMouseLeave"
        @click="openModal(item)"
      >
        <img
          loading="lazy"
          :src="getBackdropUrl(item.backdrop_path)"
          :alt="item.title || item.name"
          class="w-full h-64 md:h-72 object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 border-l-4 transition-all duration-500"
          :style="{ borderColor: getTemperatureColor(index + 1) }"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"
        />

        <div class="absolute top-3 left-3 flex flex-col gap-2">
          <div
            class="w-10 h-10 bg-[#b20710]/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <span class="text-sm font-[Gilroy-Bold] text-white"
              >#{{ index + 2 }}</span
            >
          </div>
        </div>

        <div class="absolute bottom-4 left-4 right-4">
          <div v-if="item.intelligence" class="mb-2">
            <TrustRating
              :rating="item.vote_average"
              :trust="item.intelligence.trustRating"
            />
          </div>

          <h4 class="text-lg font-[Gilroy-Bold] text-white line-clamp-1 mb-1">
            {{ item.title || item.name }}
          </h4>

          <div
            class="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider"
          >
            <span>{{
              formatYear(item.release_date || item.first_air_date)
            }}</span>
            <span v-if="item.intelligence" class="text-[#b20710]">•</span>
            <span v-if="item.intelligence">{{
              item.intelligence.context.mood[0] ||
              item.intelligence.context.tone[0] ||
              "Discovery"
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Media } from "@/types/media";
import { getBackdropUrl } from "@/utils/imageHelpers";
import { formatYear } from "@/utils/dateHelpers";
import { getTemperatureColor, AMBIENT_COLORS } from "@/utils/colorHelpers";
import { openMediaModal } from "@/utils/modalHelpers";
import TrustRating from "@/components/intelligence/TrustRating.vue";
import IntelligenceChips from "@/components/intelligence/IntelligenceChips.vue";
import { useRouteCacheStore } from "@/stores/routeCache";

defineProps<{
  items: Media[];
}>();

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const routeCache = useRouteCacheStore();

const handleHover = (item: Media, index: number) => {
  const color = getTemperatureColor(index);
  emit("update-ambient", color);

  // Prefetch data
  routeCache.prefetchData(
    item.media_type === "movie" ? "MovieDetails" : "TVShowDetails",
    { id: item.id },
  );
};

const handleMouseLeave = () => {
  emit("update-ambient", AMBIENT_COLORS.default);
};

const openModal = (item: Media) => {
  openMediaModal(item);
};
</script>

<style scoped>
.media-section-grid {
  transition: all 0.5s;
}

.media-section-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.group:hover {
  transform: translateY(-8px);
}
</style>
