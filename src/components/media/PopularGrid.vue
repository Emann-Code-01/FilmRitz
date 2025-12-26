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
        class="mt-4 px-6 py-2 bg-[#b20710] hover:bg-[#e32125] text-white rounded-lg transition-all"
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
          @click="openModal(mediaList[0])"
        >
          <img
            loading="lazy"
            :src="getImageUrl(mediaList[0].backdrop_path)"
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
          <!-- <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40">
            <div
              class="w-24 h-24 rounded-full bg-[#b20710] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
              <i class="pi pi-info-circle text-5xl text-white hover:text-[#ffffffec]"></i>
            </div>
          </div> -->

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
                    mediaList[0].release_date || mediaList[0].first_air_date
                  )
                }}
              </span>
              <span class="text-yellow-400 flex items-center gap-1">
                ⭐ {{ mediaList[0].vote_average?.toFixed(1) }}
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
                  3
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
          @click="openModal(item)"
        >
          <!-- Background Image -->
          <img
            loading="lazy"
            :src="getImageUrl(item.backdrop_path)"
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

          <!-- Play Button Overlay
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40">
            <div
              class="w-16 h-16 rounded-full bg-[#b20710] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
              <i class="pi pi-info-circle text-5xl text-white hover:text-[#ffffffec]"></i>
            </div>
          </div> -->

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
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
            </div>

            <!-- Genre Tag (first only) -->
            <router-link
              v-if="getGenreNames(item.genre_ids)[0]"
              :to="
                auth.isLoggedIn
                  ? `/ng/genre/${getGenreNames(
                      item.genre_ids
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
        <!-- <router-link
          v-if="!auth.isLoggedIn"
          to="/ng/login"
          class="col-span-6 md:col-span-3 h-64 md:h-72 bg-linear-to-br from-[#b20710] to-[#8a0509] rounded-xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all duration-500 cursor-pointer group"
        >
          <div
            class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all"
          >
            <span class="text-4xl">🎬</span>
          </div>
          <div class="text-center px-4">
            <p class="text-white font-[Gilroy-Bold] text-xl mb-2">See More</p>
            <p class="text-white/80 font-[Gilroy-Regular] text-sm">
              Sign in to explore all popular content
            </p>
          </div>
        </router-link> -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { fetchPopularMedia } from "../../api/tmdb";
import { useAuthStore } from "@/stores/auth";
import { genreMap } from "@/types/media";
const emit = defineEmits<{
  "update-ambient": [color: string];
}>();
const modalStore = useModalStore();
const auth = useAuthStore();
const mediaList = ref<any[]>([]);
const error = ref<string | null>(null);
const loading = ref(false);
const hoveredIndex = ref<number | null>(null);
const loadPopularMedia = async () => {
  loading.value = true;
  error.value = null;
  try {
    const popular = await fetchPopularMedia();
    mediaList.value = popular.slice(0, 10);
  } catch (err: any) {
    console.error("❌ Failed to fetch popular media:", err);
    error.value =
      "Couldn't load popular movies and shows. Please refresh in a bit.";
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (path: string | null): string => {
  if (!path) {
    return "https://placehold.co/780x439/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat";
  }
  return `https://image.tmdb.org/t/p/w780${path}`;
};

const getGenreNames = (genreIds?: number[]): string[] => {
  if (!genreIds || !genreIds.length) return [];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
};

const formatDate = (date: string): string => {
  if (!date) return "TBA";
  return new Date(date).getFullYear().toString();
};

const formatYear = (date: string): string => {
  if (!date) return "TBA";
  return new Date(date).getFullYear().toString();
};

// Temperature color based on ranking (hot to cool)
const getTemperatureColor = (index: number): string => {
  const colors = [
    "#FF0000", // #1 - Red hot
    "#FF4500", // #2 - Orange red
    "#FF6347", // #3 - Tomato
    "#FF8C00", // #4 - Dark orange
    "#FFA500", // #5 - Orange
    "#FFD700", // #6 - Gold
    "#FFFF00", // #7 - Yellow
  ];
  return colors[index] || "#FFA500";
};

const handleHover = (item: any, index: number) => {
  hoveredIndex.value = index;

  // Emit ambient color update (you can enhance this with actual color extraction)
  const color = getTemperatureColor(index);
  emit("update-ambient", color);
};

const handleMouseLeave = () => {
  hoveredIndex.value = null;
  emit("update-ambient", "#111111");
};

const openModal = (item: any) => {
  modalStore.open(item.media_type, {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

onMounted(() => {
  loadPopularMedia();
});
</script>

<style scoped>
/* Ensure smooth animations */
.popular-grid {
  @apply transition-all duration-500;
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
