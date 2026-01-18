<template>
  <section class="relative z-10">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-12 gap-4">
      <div
        class="col-span-12 md:col-span-6 row-span-2 h-[500px] bg-gray-800/50 rounded-xl animate-pulse"
      ></div>
      <div
        v-for="n in 6"
        :key="n"
        class="col-span-6 md:col-span-3 h-64 bg-gray-800/50 rounded-xl animate-pulse"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="text-red-500 text-center py-8 bg-red-500/10 rounded-xl border border-red-500/20"
    >
      <p class="font-[Gilroy-SemiBold]">{{ error }}</p>
      <button
        @click="loadPopularMedia"
        class="mt-4 px-6 py-2 bg-[#b20710] hover:bg-[#e32125] text-white rounded-lg transition-all cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <div v-else class="popular-grid">
      <div class="grid grid-cols-12 gap-4 auto-rows-auto">
        <div
          v-if="mediaList[0]"
          class="col-span-12 md:col-span-6 lg:col-span-6 row-span-2 relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-[#b20710]/30"
          @mouseenter="handleHover(mediaList[0], 0)"
          @mouseleave="handleMouseLeave"
          @click="openMediaModal(mediaList[0])"
        >
          <img
            loading="lazy"
            :src="getBackdropUrl(mediaList[0].backdrop_path)"
            :alt="mediaList[0].title || mediaList[0].name"
            class="w-full h-full min-h-[500px] object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 border-l-4 transition-all duration-500"
            :style="{ borderColor: getTemperatureColor(0) }"
          />
          <div
            class="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent"
          />
          <div class="absolute top-6 left-6 flex items-center gap-3">
            <div
              class="w-20 h-20 bg-[#b20710] rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm"
            >
              <span class="text-4xl font-[Gilroy-Bold] text-white">#1</span>
            </div>
            <!-- Heat Score Indicator -->
            <div
              class="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full"
            >
              <span class="text-2xl animate-pulse">🔥</span>
              <span class="text-white font-[Gilroy-Bold] text-sm">HOT</span>
            </div>
          </div>
          <div
            class="absolute bottom-8 left-8 right-8 transition-transform duration-500 transform lg:translate-y-16 lg:group-hover:translate-y-0"
          >
            <h3
              class="text-4xl font-[Gilroy-Bold] text-white mb-3 line-clamp-2 drop-shadow-2xl"
            >
              {{ mediaList[0].title || mediaList[0].name }}
            </h3>

            <div class="flex items-center gap-3 mb-3">
              <span class="text-gray-300 font-[Gilroy-Medium]">
                {{
                  formatDate(
                    mediaList[0].release_date || mediaList[0].first_air_date,
                  )
                }}
              </span>
              <span class="text-yellow-400 flex items-center gap-1">
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
                </svg>
                {{ mediaList[0].vote_average?.toFixed(1) }}
              </span>
            </div>

            <p
              class="text-gray-300 text-base font-[Gilroy-Regular] line-clamp-3 mb-4 max-w-2xl lg:opacity-0 lg:translate-y-5 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 lg:group-hover:animate-fade-up lg:delay-100"
            >
              {{ mediaList[0].overview }}
            </p>

            <!-- Genre Tags -->
            <div class="flex flex-wrap gap-2">
              <router-link
                v-for="genreName in getGenreNames(mediaList[0].genre_ids).slice(
                  0,
                  3,
                )"
                :key="genreName"
                :to="
                  auth.isLoggedIn
                    ? `/ng/genre/${genreName.toLowerCase()}`
                    : '/ng/login'
                "
                class="text-sm font-[Gilroy-SemiBold] text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-[#b20710] transition-all duration-200"
              >
                <div @click.stop>
                  {{ genreName }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div
          v-for="(item, index) in mediaList.slice(1, 7)"
          :key="item.id"
          class="col-span-6 md:col-span-3 lg:col-span-3 relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-500 hover:shadow-xl hover:shadow-[#b20710]/20 hover:scale-105"
          @mouseenter="handleHover(item, index + 1)"
          @mouseleave="handleMouseLeave"
          @click="openMediaModal(item)"
        >
          <!-- Background Image -->
          <img
            loading="lazy"
            :src="getBackdropUrl(item.backdrop_path)"
            :alt="item.title || item.name"
            class="w-full h-64 md:h-72 object-cover transition-all duration-500 group-hover:scale-110"
          />

          <!-- Temperature Border -->
          <div
            class="absolute inset-0 border-l-4 transition-all duration-500"
            :style="{ borderColor: getTemperatureColor(index + 1) }"
          />

          <!-- linear Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"
          />

          <!-- Ranking Badge -->
          <div
            class="absolute top-3 left-3 w-12 h-12 bg-[#b20710]/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <span class="text-xl font-[Gilroy-Bold] text-white"
              >#{{ index + 2 }}</span
            >
          </div>

          <!-- Heat Score (for top 3 only) -->
          <div
            v-if="index < 2"
            class="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full"
          >
            <span class="text-lg animate-pulse">🔥</span>
          </div>

          <!-- Info -->
          <div class="absolute bottom-4 left-4 right-4">
            <h4
              class="text-lg md:text-xl font-[Gilroy-Bold] text-white line-clamp-2 drop-shadow-lg mb-2"
            >
              {{ item.title || item.name }}
            </h4>

            <div class="flex items-center gap-2 text-sm mb-2">
              <span class="text-gray-300 font-[Gilroy-Medium]">
                {{ formatYear(item.release_date || item.first_air_date) }}
              </span>
              <span class="text-yellow-400">
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
                </svg>
                {{ item.vote_average?.toFixed(1) }}
              </span>
            </div>

            <!-- Genre Tag (first only) -->
            <router-link
              v-if="getGenreNames(item.genre_ids)[0]"
              :to="
                auth.isLoggedIn
                  ? `/ng/genre/${getGenreNames(
                      item.genre_ids,
                    )[0].toLowerCase()}`
                  : '/ng/login'
              "
              class="inline-block text-sm font-[Gilroy-SemiBold] text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-[#b20710] transition-all duration-200"
            >
              <div @click.stop>
                {{ getGenreNames(item.genre_ids)[0] }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getRotatedPopular } from "@/services/mediaRotation";
import { useAuthStore } from "@/stores/auth";
import { getBackdropUrl } from "@/utils/imageHelpers";
import { formatYear, formatDate } from "@/utils/dateHelpers";
import { getGenreNames } from "@/utils/genreHelpers";
import { getTemperatureColor, AMBIENT_COLORS } from "@/utils/colorHelpers";
import { openMediaModal } from "@/utils/modalHelpers";
const emit = defineEmits<{
  "update-ambient": [color: string];
}>();
const auth = useAuthStore();
const mediaList = ref<any[]>([]);
const error = ref<string | null>(null);
const loading = ref(false);
const hoveredIndex = ref<number | null>(null);
const loadPopularMedia = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Fetch 3 pages (60+ items) and display top 20
    // Use rotated popular for variety (cached for 6 hours)
    mediaList.value = await getRotatedPopular();
  } catch (err: any) {
    console.error("❌ Failed to fetch popular media:", err);
    error.value =
      "Couldn't load popular movies and shows. Please refresh in a bit.";
  } finally {
    loading.value = false;
  }
};

const handleHover = (_item: any, index: number) => {
  hoveredIndex.value = index;

  // Emit ambient color update (you can enhance this with actual color extraction)
  const color = getTemperatureColor(index);
  emit("update-ambient", color);
};

const handleMouseLeave = () => {
  hoveredIndex.value = null;
  emit("update-ambient", AMBIENT_COLORS.default);
};

onMounted(() => {
  loadPopularMedia();
});
</script>

<style scoped>
/* Ensure smooth animations */
.popular-grid {
  /* replaced Tailwind @apply with plain CSS to avoid "Unknown at rule @apply" */
  transition: all 0.5s;
}

/* Custom hover lift effect */
@keyframes lift {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-8px);
  }
}

.group:hover {
  animation: lift 0.3s ease-out forwards;
}

/* Film grain texture overlay (optional premium effect) */
.popular-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
