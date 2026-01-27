<template>
  <section class="relative">
    <!-- Loading State -->
    <div v-if="loading" class="flex gap-4 overflow-x-auto px-4 py-6">
      <div
        v-for="n in 8"
        :key="n"
        class="min-w-[200px] h-80 bg-gray-800/50 rounded-xl animate-pulse"
      ></div>
    </div>

    <!-- Timeline Container -->
    <div v-else class="relative">
      <!-- Timeline Bar -->
      <div class="absolute top-8 left-0 right-0 h-1 bg-white/10 z-0">
        <div
          class="absolute inset-0 bg-linear-to-r from-[#b20710] via-[#e32125] to-[#b20710] opacity-50"
        ></div>
      </div>

      <!-- Swiper Carousel -->
      <Swiper
        :modules="[Navigation, FreeMode]"
        :loop="false"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 4, slidesPerGroup: 2 },
          640: { slidesPerView: 3.5, spaceBetween: 10 },
          1024: { slidesPerView: 4, spaceBetween: 12 },
          1280: { slidesPerView: 4.5, spaceBetween: 12 },
          1440: { slidesPerView: 8.8, spaceBetween: 12 },
          2000: { slidesPerView: 10.8, spaceBetween: 12 },
        }"
        :freeMode="{ enabled: true }"
        :navigation="{
          nextEl: '.timeline-next',
          prevEl: '.timeline-prev',
        }"
        class="timeline-swiper px-4 md:px-8 py-6"
      >
        <SwiperSlide v-for="item in timelineItems" :key="item.id">
          <div
            class="relative group cursor-pointer w-full"
            @mouseenter="handleHover(item)"
            @click="openModal(item)"
          >
            <!-- Date Marker (on timeline) -->
            <div class="relative z-10 mb-4">
              <div
                class="w-4 h-4 rounded-full bg-[#b20710] mx-auto border-4 border-black shadow-lg group-hover:scale-150 transition-transform duration-500"
              ></div>
              <div
                class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <p
                  class="text-xs font-[Gilroy-SemiBold] text-gray-400 group-hover:text-white transition-colors"
                >
                  {{ formatDate(item.release_date || item.first_air_date) }}
                </p>
              </div>
            </div>

            <!-- Card -->
            <div
              class="relative overflow-hidden rounded-xl shadow-xl mt-8 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#b20710]/30"
            >
              <!-- Poster -->
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.title || item.name"
                class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <!-- Mini Trailer Preview (circular, on hover) -->
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500"
              >
                <div
                  class="w-16 h-16 rounded-full bg-[#b20710] flex items-center justify-center animate-pulse"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 text-white hover:text-[#ffffffec]"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <!-- Info Overlay -->
              <div
                class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/90 to-transparent p-4"
              >
                <h4
                  class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2"
                >
                  {{ item.title || item.name }}
                </h4>

                <div v-if="item.intelligence" class="mb-2">
                  <TrustRating
                    :rating="item.vote_average"
                    :trust="item.intelligence.trustRating"
                  />
                </div>

                <span
                  class="px-2 py-0.5 bg-[#b20710] rounded inline-flex items-center text-[10px] text-white font-[Gilroy-SemiBold] uppercase tracking-wider"
                >
                  {{ item.media_type }}
                </span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Navigation Buttons -->
      <button
        class="timeline-prev absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all"
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
        class="timeline-next absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all"
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
import { ref, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, FreeMode } from "swiper/modules";
import { getPosterUrl } from "@/utils/imageHelpers";
import { openMediaModal } from "@/utils/modalHelpers";
import TrustRating from "@/components/intelligence/TrustRating.vue";
import { IntelligenceService } from "@/services/intelligenceService";
import { useRouteCacheStore } from "@/stores/routeCache";

interface Props {
  period: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const timelineItems = ref<any[]>([]);
const loading = ref(true);

const getImageUrl = (path: string | null): string => getPosterUrl(path);

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const routeCache = useRouteCacheStore();

const handleHover = (item: any) => {
  emit("update-ambient", "#FF4500");
  if (item.id) {
    routeCache.prefetchData(
      item.media_type === "movie" ? "MovieDetails" : "TVShowDetails",
      { id: item.id },
    );
  }
};

const openModal = (item: any) => {
  openMediaModal(item);
};

const loadItems = async () => {
  loading.value = true;
  try {
    const now = new Date();
    let startDate = new Date();

    if (props.period === "This Week") {
      startDate.setDate(now.getDate() - 7);
    } else if (props.period === "Last Week") {
      startDate.setDate(now.getDate() - 14);
    } else if (props.period === "This Month") {
      startDate.setMonth(now.getMonth() - 1);
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = now.toISOString().split("T")[0];

    const endpoint = `/discover/movie`;
    const params = {
      "primary_release_date.gte": startDateStr,
      "primary_release_date.lte": endDateStr,
      sort_by: "primary_release_date.desc",
      page: 1,
    };

    const data = await IntelligenceService.fetch(endpoint, params);
    const results = data.results || [];

    timelineItems.value = results
      .slice(0, 30)
      .map((item: any) => IntelligenceService.normalize(item, "movie"));
  } catch (error) {
    console.error("Failed to load timeline items:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.period,
  () => {
    loadItems();
  },
);

onMounted(() => {
  loadItems();
});
</script>

<style scoped>
.timeline-swiper {
  overflow: visible;
}

.timeline-swiper .swiper-button-prev,
.timeline-swiper .swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 3rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border-radius: 0.375rem;
  cursor: pointer;
  opacity: 0;
  transition-property: opacity;
  transition-duration: 300ms;
}

.timeline-swiper:hover .swiper-button-prev,
.timeline-swiper:hover .swiper-button-next {
  opacity: 1;
}
</style>
