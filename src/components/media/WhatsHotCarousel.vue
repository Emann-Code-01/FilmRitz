<template>
  <section class="relative overflow-hidden">

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center gap-4 px-4">
      <div v-for="n in 5" :key="n" class="w-64 h-96 bg-gray-800/50 rounded-xl animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 font-[Gilroy-SemiBold]">{{ error }}</p>
    </div>

    <!-- Carousel -->
    <div v-else class="relative">
      <Swiper :modules="[Navigation, EffectCoverflow]" :effect="'coverflow'" :grabCursor="true" :centeredSlides="true"
        :slidesPerView="'auto'" :coverflowEffect="{
          rotate: 20,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }" :navigation="{
          nextEl: '.hot-next',
          prevEl: '.hot-prev',
        }" :loop="true" class="whats-hot-swiper" @slideChange="onSlideChange">
        <SwiperSlide v-for="(item, index) in hotItems" :key="item.id" class="w-80!">
          <div class="relative group cursor-pointer" @mouseenter="handleHover(item, index)" @click="openModal(item)">
            <!-- Card -->
            <div
              class="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105">

              <!-- Poster Image -->
              <img :src="getImageUrl(item.poster_path)" :alt="item.title || item.name"
                class="w-full h-[480px] object-cover" />

              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>

              <!-- Play Button (on hover)
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div
                  class="w-20 h-20 rounded-full bg-[#b20710] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                  <i class="pi pi-info-circle text-5xl text-white hover:text-[#ffffffec]"></i>
                </div>
              </div> -->

              <!-- Info (on hover) -->
              <div
                class="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="text-xl font-[Gilroy-Bold] text-white mb-2">
                  {{ item.title || item.name }}
                </h3>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-yellow-400">⭐ {{ item.vote_average?.toFixed(1) }}</span>
                  <span class="text-gray-300 text-sm">{{ formatYear(item.release_date || item.first_air_date) }}</span>
                </div>
                <p class="text-gray-300 text-sm line-clamp-2">{{ item.overview }}</p>
              </div>

              <!-- Ranking Badge -->
              <div
                class="absolute top-4 right-4 w-12 h-12 bg-[#b20710] rounded-full flex items-center justify-center shadow-xl">
                <span class="text-lg font-[Gilroy-Bold] text-white">#{{ index + 1 }}</span>
              </div>

            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Navigation Buttons -->
      <button
        class="hot-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all">
        <i class="pi pi-chevron-left"></i>
      </button>
      <button
        class="hot-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all">
        <i class="pi pi-chevron-right"></i>
      </button>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import { useModalStore } from '../../stores/modalStore';
import { fetchTrendingMedia } from '../../api/tmdb';

const emit = defineEmits<{
  'update-ambient': [color: string]
}>();

const modalStore = useModalStore();
const hotItems = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : 'https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE';
};

const formatYear = (date: string): string => {
  return date ? new Date(date).getFullYear().toString() : 'TBA';
};

const handleHover = (item: any, index: number) => {
  const colors = ['#FF0000', '#FF4500', '#FF6347', '#FF8C00', '#FFA500'];
  emit('update-ambient', colors[index % colors.length]);
};

const onSlideChange = (swiper: any) => {
  const activeIndex = swiper.realIndex;
  if (hotItems.value[activeIndex]) {
    handleHover(hotItems.value[activeIndex], activeIndex);
  }
};

const openModal = (item: any) => {
  modalStore.open(item.media_type, { movieId: item.id, mediaType: item.media_type });
};

onMounted(async () => {
  try {
    const data = await fetchTrendingMedia('day');
    hotItems.value = data.slice(0, 15);
  } catch (err) {
    error.value = 'Failed to load hot content';
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