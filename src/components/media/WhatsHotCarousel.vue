<template>
  <section class="relative">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center gap-4 px-4">
      <div
        v-for="n in 5"
        :key="n"
        class="w-64 h-96 bg-gray-800/50 rounded-xl animate-pulse"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 font-[Gilroy-SemiBold]">{{ error }}</p>
    </div>

    <!-- Carousel -->
    <div v-else class="relative">
      <Swiper
        :modules="[Navigation, EffectCoverflow]"
        :effect="'coverflow'"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView="'auto'"
        :coverflowEffect="{
          rotate: 20,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }"
        :navigation="{
          nextEl: '.hot-next',
          prevEl: '.hot-prev',
        }"
        :loop="true"
        class="whats-hot-swiper"
        @slideChange="onSlideChange"
      >
        <SwiperSlide
          v-for="(item, index) in hotItems"
          :key="item.id"
          class="w-80!"
        >
          <div
            class="relative group cursor-pointer"
            @mouseenter="handleHover(item, index)"
            @click="openMediaModal(item)"
          >
            <!-- Card -->
            <div
              class="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105"
            >
              <!-- Poster Image -->
              <img
                :src="getPosterUrl(item.poster_path)"
                :alt="item.title || item.name"
                class="w-full h-[480px] object-cover"
              />

              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:scale-105 duration-500 transition-all"
              ></div>
              <!-- Info (on hover) -->
              <div
                class="absolute bottom-0 left-0 right-0 p-6 transform lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500 animate-fade-up"
              >
                <h3 class="text-xl font-[Gilroy-Bold] text-white mb-2">
                  {{ item.title || item.name }}
                </h3>
                <div v-if="item.intelligence" class="mb-4">
                  <TrustRating
                    :rating="item.vote_average"
                    :vote-count="item.vote_count"
                    :trust-level="item.intelligence.trust_level"
                    :confidence-label="item.intelligence.confidence_label"
                  />
                </div>
                <div v-else class="flex items-center gap-2 mb-2">
                  <span class="text-yellow-400 flex items-center gap-1"
                    ><svg
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
                    {{ item.vote_average?.toFixed(1) }}</span
                  >
                  <span class="text-gray-300 text-sm">{{
                    formatYear(item.release_date || item.first_air_date)
                  }}</span>
                </div>
                <p class="text-gray-300 text-sm line-clamp-2">
                  {{ item.overview }}
                </p>
              </div>

              <!-- Ranking Badge -->
              <div
                class="absolute top-4 right-4 w-12 h-12 bg-[#b20710] rounded-full flex items-center justify-center shadow-xl"
              >
                <span class="text-lg font-[Gilroy-Bold] text-white"
                  >#{{ index + 1 }}</span
                >
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Navigation Buttons -->
      <button
        class="hot-prev absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all"
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
        class="hot-next absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all"
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
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { getRotatedTrending } from "@/services/mediaRotation";
import { getPosterUrl } from "@/utils/imageHelpers";
import { formatYear } from "@/utils/dateHelpers";
import { openMediaModal } from "@/utils/modalHelpers";
import TrustRating from "@/components/intelligence/TrustRating.vue";
import { IntelligenceService } from "@/services/intelligenceService";
import { useRouteCacheStore } from "@/stores/routeCache";

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const hotItems = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const routeCache = useRouteCacheStore();

const handleHover = (item: any, index: number) => {
  const colors = ["#FF0000", "#FF4500", "#FF6347", "#FF8C00", "#FFA500"];
  emit("update-ambient", colors[index % colors.length]);
  routeCache.prefetchData(
    item.media_type === "movie" ? "MovieDetails" : "TVShowDetails",
    { id: item.id },
  );
};

const onSlideChange = (swiper: any) => {
  const activeIndex = swiper.realIndex;
  if (hotItems.value[activeIndex]) {
    handleHover(hotItems.value[activeIndex], activeIndex);
  }
};

onMounted(async () => {
  try {
    const rotated = await getRotatedTrending();
    hotItems.value = rotated
      .slice(0, 12)
      .map((item) => IntelligenceService.normalize(item, item.media_type));
  } catch (err) {
    error.value = "Failed to load hot content";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.whats-hot-swiper {
  padding: 40px 0;
}

.swiper-slide {
  transition: all 0.3s ease;
}

.swiper-slide-active {
  z-index: 10;
}
</style>
