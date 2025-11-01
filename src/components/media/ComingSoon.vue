<!-- src/components/media/ComingSoon.vue -->
<template>
  <section class="bg-black transition-all duration-900 animate-fade-up relative z-10 overflow-hidden">
    <div v-if="loading" class="flex space-x-4 overflow-x-auto py-4">
      <div v-for="n in 5" :key="n" class="w-48 h-80 bg-amber-900 rounded-md animate-pulse"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <div v-else class="container relative transition-all duration-900 animate-fade-up">
      <Swiper :modules="[Navigation]" :slidesPerGroup="3" :loop="false"
        :navigation="{ nextEl: '.trending-next', prevEl: '.trending-prev' }" :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 4, slidesPerGroup: 2 },
          640: { slidesPerView: 3.5, spaceBetween: 10 },
          1024: { slidesPerView: 5.5, spaceBetween: 12 },
        }" class="netflix-swiper transition-all duration-900 animate-fade-up mySwiper w-full"
        @reachBeginning="atBeginning = true" @reachEnd="atEnd = true" @fromEdge="resetEdges">
        <SwiperSlide v-for="(item, index) in top10" :key="item.id">
          <div
            class="relative w-full cursor-pointer transition-all duration-500 animate-fade-up hover:scale-105 py-2 px-2 xl:px-5">
            <img loading="lazy" :src="item.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
              " @click="openModal(item)" sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 780px"
              :alt="item.title"
              class="rounded-md hover:rounded-md w-full transition-all h-80 object-cover duration-500 animate-fade-up mx-5" />
            <span>
              <div v-if="!auth.isLoggedIn" class="absolute left-2 bottom-3 flex items-center">
                <div class="flex flex-col">
                  <h3 class="text-gray-300 text-xl font-[Gilroy-SemiBold] drop-shadow-lg max-w-sm">
                    {{ item.title || item.name }}
                  </h3>
                  <p class="text-gray-300 text-base font-[Gilroy-Medium] drop-shadow-2xl">
                    {{ item.release_date ?? item.first_air_date ?? "" }}
                    <span class="flex gap-2">
                      <span v-for="genreName in getGenreNames(item.genre_ids).slice(
                        0,
                        1
                      )" :key="genreName"
                        class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40">
                        {{ genreName }}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div v-else class="absolute bottom-5 left-12 flex flex-col">
                <h3 class="text-gray-300 text-xl font-[Gilroy-SemiBold] drop-shadow-lg max-w-sm">
                  {{ item.title || item.name }}
                </h3>
                <p class="text-gray-300 text-base font-[Gilroy-Medium] drop-shadow-2xl">
                  {{ item.release_date ?? item.first_air_date ?? "" }}
                  <span class="flex gap-2">
                    <span v-for="genreName in getGenreNames(item.genre_ids).slice(
                      0,
                      1
                    )" :key="genreName"
                      class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40">
                      {{ genreName }}
                    </span>
                  </span>
                </p>
              </div>
            </span>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <div
      class="comingsoon-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-96 hidden md:flex items-center justify-center bg-black text-white cursor-pointer transition-all duration-500 pr-2"
      :class="{
        'opacity-0 pointer-events-none': atBeginning,
        'opacity-100': !atBeginning,
      }">
      <span
        class="flex items-center w-6 h-32 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-900 animate-fade-up"><svg
          xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg></span>
    </div>

    <div
      class="comingsoon-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-96 hidden md:flex items-center justify-center bg-black text-white cursor-pointer transition-all duration-500 pl-2"
      :class="{ 'opacity-0 pointer-events-none': atEnd, 'opacity-100': !atEnd }">
      <span
        class="flex items-center w-6 h-32 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-900 animate-fade-up outline-none"><svg
          xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { useModalStore } from "../../stores/modalStore";
import { useMedia } from "../../composables/useMedia";
import { useAuthStore } from "../../stores/auth";
import { genreMap } from "../../types/genres";

const props = defineProps<{ mediaType?: "movie" | "tv" | "all" }>();
const modalStore = useModalStore();
const auth = useAuthStore();

const atBeginning = ref(true);
const atEnd = ref(false);
const loading = ref(false);

const { upcoming, upcomingTV, getUpcoming, getUpcomingTV, error } = useMedia();

const top10 = computed(() =>
  props.mediaType === "tv"
    ? upcomingTV.value.slice(0, 10)
    : upcoming.value.slice(0, 10)
);

const resetEdges = () => {
  atBeginning.value = false;
  atEnd.value = false;
};

onMounted(async () => {
  loading.value = true;
  try {
    if (props.mediaType === "tv") await getUpcomingTV();
    else await getUpcoming();
  } catch (err: any) {
    console.error("❌ Failed to fetch upcoming:", err);
  } finally {
    loading.value = false;
  }
});

function openModal(item: any) {
  if (typeof modalStore.open === "function")
    modalStore.open("movie", { movieId: item.id, mediaType: item.media_type });
  else if (typeof (modalStore as any).openMovieModal === "function")
    (modalStore as any).openMovieModal(item.id);
}

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return [""];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}
</script>

<style scoped>
.netflix-swiper .swiper-button-prev,
.netflix-swiper .swiper-button-next {
  position: absolute;
  /* absolute */
  top: 50%;
  /* top-1/2 */
  transform: translateY(-50%);
  /* -translate-y-1/2 */
  z-index: 10;
  /* z-10 */
  width: 3rem;
  /* w-12 */
  height: 6rem;
  /* h-24 */
  display: flex;
  /* flex */
  align-items: center;
  /* items-center */
  justify-content: center;
  /* justify-center */
  background-color: rgba(0, 0, 0, 0.5);
  /* bg-[#000000]/50 */
  color: #ffffff;
  /* text-[#ffffff] */
  border-radius: 0.375rem;
  /* rounded-md */
  cursor: pointer;
  /* cursor-pointer */
  opacity: 0;
  /* opacity-0 */
  transition-property: opacity;
  /* transition-opacity */
  transition-duration: 300ms;
  /* duration-300 */
}

.netflix-swiper:hover .swiper-button-prev,
.netflix-swiper:hover .swiper-button-next {
  opacity: 1;
  /* opacity-100 */
}

.image-style {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
  -webkit-text-fill-color: rgb(0, 0, 0);
  text-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.5);
}
</style>
