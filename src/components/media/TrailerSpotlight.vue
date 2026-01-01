<template>
  <!-- Trailer Modal -->
  <TrailerModal
    :is-open="showTrailerModal"
    :trailer="selectedTrailer"
    @close="closeTrailerModal"
    @view-details="openFullDetails"
  />

  <section class="relative overflow-hidden">
    <!-- Dynamic Background Blur (adapts to hovered item) -->
    <div
      class="absolute inset-0 transition-all duration-1000 blur-3xl opacity-30"
      :style="{
        backgroundImage: hoveredItem
          ? `url(${getBackdropUrl(hoveredItem.backdrop_path)})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    ></div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="relative flex gap-6 overflow-x-auto px-4 md:px-8 py-8"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="min-w-[400px] h-64 bg-gray-800/50 rounded-2xl animate-pulse"
      ></div>
    </div>

    <!-- Spotlight Carousel -->
    <div v-else class="relative px-4 md:px-8 py-8">
      <Swiper
        :modules="[Navigation, FreeMode]"
        :slidesPerView="'auto'"
        :spaceBetween="24"
        :freeMode="{ enabled: true, momentum: true }"
        :navigation="{
          nextEl: '.spotlight-next',
          prevEl: '.spotlight-prev',
        }"
        class="spotlight-swiper"
      >
        <SwiperSlide
          v-for="item in spotlightItems"
          :key="item.id"
          class="w-[400px]! md:w-[480px]!"
        >
          <div
            class="relative group cursor-pointer"
            @mouseenter="handleMouseEnter(item)"
            @mouseleave="handleMouseLeave"
            @click="openModal(item)"
          >
            <!-- Card Container with Expand Animation -->
            <div
              class="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500"
              :class="
                hoveredItem?.id === item.id
                  ? 'scale-105 shadow-[#b20710]/50'
                  : ''
              "
            >
              <!-- Backdrop Image with Zoom -->
              <div class="relative h-64 overflow-hidden">
                <img
                  :src="getBackdropUrl(item.backdrop_path)"
                  :alt="item.title || item.name"
                  class="w-full h-full object-cover transition-transform duration-700"
                  :class="
                    hoveredItem?.id === item.id
                      ? 'lg:scale-110'
                      : 'lg:scale-100'
                  "
                />

                <!-- linear Overlay -->
                <div
                  class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"
                ></div>
              </div>

              <!-- Info Panel (slides up from bottom) -->
              <div
                class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/95 to-transparent p-6 transition-all duration-500"
                :class="
                  hoveredItem?.id === item.id
                    ? 'lg:translate-y-0'
                    : 'lg:translate-y-8'
                "
              >
                <h3
                  class="text-2xl font-[Gilroy-Bold] text-white mb-2 line-clamp-1"
                >
                  {{ item.title || item.name }}
                </h3>

                <div class="flex items-center gap-3 mb-3">
                  <span
                    class="flex items-center gap-1 text-yellow-400 font-[Gilroy-SemiBold]"
                  >
                    ⭐ {{ item.vote_average?.toFixed(1) }}
                  </span>
                  <span class="text-gray-300 font-[Gilroy-Medium]">
                    {{ formatYear(item.release_date || item.first_air_date) }}
                  </span>
                  <span
                    class="px-2 py-1 bg-[#b20710] rounded-full text-white text-xs font-[Gilroy-SemiBold]"
                  >
                    {{ item.media_type === "movie" ? "MOVIE" : "TV" }}
                  </span>
                </div>

                <!-- Overview (only shows on hover) -->
                <p
                  class="text-gray-300 text-sm font-[Gilroy-Regular] line-clamp-2 transition-all duration-500"
                  :class="
                    hoveredItem?.id === item.id
                      ? 'lg:opacity-100 lg:max-h-20'
                      : 'lg:opacity-0 lg:max-h-0'
                  "
                >
                  {{ item.overview }}
                </p>

                <!-- Action Buttons (only shows on hover) -->
                <div
                  class="flex gap-2 mt-4 transition-all duration-500"
                  :class="
                    hoveredItem?.id === item.id
                      ? 'lg:opacity-100 lg:translate-y-0'
                      : 'lg:opacity-0 lg:translate-y-4'
                  "
                >
                  <button
                    @click.stop="playTrailer(item)"
                    class="px-4 py-2 bg-white text-black rounded-full font-[Gilroy-SemiBold] text-sm hover:bg-white/90 transition-all flex items-center gap-2 cursor-pointer"
                    :class="
                      loadingTrailers[item.id] ? 'opacity-75 cursor-wait' : ''
                    "
                  >
                    <span v-if="!loadingTrailers[item.id]">▶</span>
                    <span v-else class="animate-spin">⏳</span>
                    <span>{{
                      loadingTrailers[item.id] ? "Loading..." : "Watch Trailer"
                    }}</span>
                  </button>
                  <button
                    @click.stop="openModal(item)"
                    class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-[Gilroy-SemiBold] text-sm hover:bg-white/30 transition-all cursor-pointer"
                  >
                    More Info
                  </button>
                </div>
              </div>

              <!-- Color Accent Border (on hover) -->
              <div
                class="absolute inset-0 border-2 border-[#b20710] rounded-2xl transition-opacity duration-500 pointer-events-none"
                :class="
                  hoveredItem?.id === item.id ? 'opacity-100' : 'opacity-0'
                "
              ></div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Navigation Buttons -->
      <button
        class="spotlight-prev absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button
        class="spotlight-next absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, FreeMode } from "swiper/modules";
import { useModalStore } from "@/stores/modalStore";
import { fetchTrendingMedia, getMediaVideos } from "@/api/tmdb";
import TrailerModal from "@/components/media/TrailerModal.vue";
import { getBackdropUrl } from "@/utils/imageHelpers";
import { openMediaModal } from "@/utils/modalHelpers";

interface TrailerData {
  id: string;
  title: string;
  type: string;
  backdrop_path: string;
  duration: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  key: string;
  site: string;
  publishedAt?: string;
}

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const modalStore = useModalStore();
const spotlightItems = ref<any[]>([]);
const hoveredItem = ref<any | null>(null);
const loading = ref(true);

// Trailer state
const showTrailerModal = ref(false);
const selectedTrailer = ref<TrailerData | null>(null);
const loadingTrailers = reactive<Record<number, boolean>>({});

const openModal = (item: any) => {
  openMediaModal(item);
};

const formatYear = (date: string): string => {
  return date ? new Date(date).getFullYear().toString() : "TBA";
};

const handleMouseEnter = (item: any) => {
  hoveredItem.value = item;
  // Emit a vibrant color based on item position
  const colors = [
    "#FF0000",
    "#FF4500",
    "#FF6347",
    "#FF8C00",
    "#FFA500",
    "#FFD700",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  emit("update-ambient", randomColor);
};

const handleMouseLeave = () => {
  hoveredItem.value = null;
  emit("update-ambient", "#111111");
};

async function playTrailer(item: any) {
  console.log("Playing trailer for:", item);

  // Set loading state
  loadingTrailers[item.id] = true;

  try {
    // Fetch videos for this media item
    const videos = await getMediaVideos(item.id, item.media_type);
    console.log("Fetched videos:", videos);

    // Find the first YouTube trailer
    const trailer = videos.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );

    if (trailer) {
      // Create trailer data object
      selectedTrailer.value = {
        id: `${item.media_type}-${item.id}-${trailer.key}`,
        title: item.title || item.name || "",
        type: item.media_type === "movie" ? "Movie Trailer" : "TV Trailer",
        backdrop_path: item.backdrop_path || item.poster_path || "",
        duration: 150,
        mediaId: item.id,
        mediaType: item.media_type,
        key: trailer.key,
        site: trailer.site,
        publishedAt: trailer.published_at,
      };

      // Open the modal
      showTrailerModal.value = true;
    } else {
      console.warn("No trailer found for this item");
      alert("No trailer available for this title");
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    alert("Failed to load trailer. Please try again.");
  } finally {
    loadingTrailers[item.id] = false;
  }
}

function closeTrailerModal() {
  showTrailerModal.value = false;
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300);
}

function openFullDetails(mediaType: "movie" | "tv", mediaId: number) {
  modalStore.open(mediaType, {
    movieId: mediaId,
    mediaType: mediaType,
  });
}

onMounted(async () => {
  try {
    // Fetch 3 pages (60+ items) and display items 10-25 for variety
    const data = await fetchTrendingMedia("week", 3);
    spotlightItems.value = data.slice(10, 30); // Different items from trending, more variety
  } catch (error) {
    console.error("Failed to load spotlight items:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.spotlight-swiper {
  overflow: visible;
}
</style>
