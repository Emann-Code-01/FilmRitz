<template>
  <section
    class="bg-black transition-all duration-900 animate-fade-up relative z-10 overflow-hidden"
  >
    <div v-if="loading" class="flex space-x-4 overflow-x-auto py-4">
      <div
        v-for="n in 5"
        :key="n"
        class="w-48 h-80 bg-amber-900 rounded-md animate-pulse"
      ></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <div
      v-else
      class="container relative transition-all duration-900 animate-fade-up"
    >
      <Swiper
        :modules="[Navigation]"
        :slidesPerGroup="4"
        :loop="false"
        :navigation="{ nextEl: '.trending-next', prevEl: '.trending-prev' }"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 4, slidesPerGroup: 2 },
          640: { slidesPerView: 3, spaceBetween: 10 },
          1024: { slidesPerView: 5, spaceBetween: 12 },
        }"
        class="netflix-swiper transition-all duration-900 animate-fade-up mySwiper w-full"
        @reachBeginning="atBeginning = true"
        @reachEnd="atEnd = true"
        @fromEdge="resetEdges"
      >
        <SwiperSlide v-for="(item, index) in mediaList" :key="item.id">
          <div
            class="relative w-full cursor-pointer transition-all duration-500 animate-fade-up hover:scale-105 py-2 px-2 xl:px-5"
          >
            <img
              loading="lazy"
              :src="
                item.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                  : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
              "
              @click="
                modalStore.open(item.media_type, {
                  movieId: item.id,
                  mediaType: item.media_type,
                })
              "
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 780px"
              :alt="item.title"
              class="rounded-md hover:rounded-md w-full h-80 object-cover transition-all duration-500 animate-fade-up mx-5"
            />
            <span>
              <div
                v-if="!auth.isLoggedIn"
                class="absolute left-2 bottom-3 flex items-center"
              >
                <span class="text-8xl font-extrabold leading-none image-style">
                  {{ index + 1 }}
                </span>
                <div class="flex flex-col">
                  <h3
                    class="text-gray-300 text-xl font-[Gilroy-SemiBold] drop-shadow-lg max-w-sm"
                  >
                    {{ item.title || item.name }}
                  </h3>
                  <p
                    class="text-gray-300 text-base font-[Gilroy-Medium] drop-shadow-2xl"
                  >
                    {{ item.release_date ?? item.first_air_date ?? "" }}
                    <span class="flex gap-2">
                      <span
                        v-for="genreName in getGenreNames(item.genre_ids).slice(
                          0,
                          1
                        )"
                        :key="genreName"
                        class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40"
                      >
                        {{ genreName }}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div v-else class="absolute bottom-5 left-12 flex flex-col">
                <h3
                  class="text-gray-300 text-xl font-[Gilroy-SemiBold] drop-shadow-lg max-w-sm"
                >
                  {{ item.title || item.name }}
                </h3>
                <p
                  class="text-gray-300 text-base font-[Gilroy-Medium] drop-shadow-2xl"
                >
                  {{ item.release_date ?? item.first_air_date ?? "" }}
                  <span class="flex gap-2">
                    <span
                      v-for="genreName in getGenreNames(item.genre_ids).slice(
                        0,
                        1
                      )"
                      :key="genreName"
                      class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40"
                    >
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
      class="trending-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-96 hidden md:flex items-center justify-center bg-black text-white cursor-pointer transition-all duration-500 pr-2"
      :class="{
        'opacity-0 pointer-events-none': atBeginning,
        'opacity-100': !atBeginning,
      }"
    >
      <span
        class="flex items-center w-6 h-32 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-900 animate-fade-up"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </span>
    </div>

    <div
      class="trending-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-96 hidden md:flex items-center justify-center bg-black text-white cursor-pointer transition-all duration-500 pl-2"
      :class="{ 'opacity-0 pointer-events-none': atEnd, 'opacity-100': !atEnd }"
    >
      <span
        class="flex items-center w-6 h-32 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-900 animate-fade-up outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import { useModalStore } from "../../stores/modalStore";
import { fetchTrendingMedia } from "../../api/tmdb";
import { useAuthStore } from "../../stores/auth";
import { genreMap } from "../../types/genres";

const modalStore = useModalStore();
const auth = useAuthStore();

const mediaList = ref<any[]>([]);
const error = ref<string | null>(null);
const loading = ref(false);
const atBeginning = ref(true);
const atEnd = ref(false);

const resetEdges = () => {
  atBeginning.value = false;
  atEnd.value = false;
};

const loadTrendingMedia = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetchTrendingMedia("week");
    mediaList.value = res.slice(0, 10);
  } catch (err: any) {
    console.error("❌ Failed to fetch trending media:", err);
    error.value =
      "Couldn’t load trending movies and shows. Please refresh in a bit";
  } finally {
    loading.value = false;
  }
};

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return [""];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

onMounted(() => {
  loadTrendingMedia();
});
</script>

<style scoped>
.netflix-swiper .swiper-button-prev,
.netflix-swiper .swiper-button-next {
  @apply absolute top-1/2 -translate-y-1/2 z-10 w-[3rem] h-[6rem] flex items-center justify-center bg-[#000000]/50 text-[#ffffff] rounded-[0.375rem] cursor-pointer opacity-0 transition-opacity duration-300;
}

.netflix-swiper:hover .swiper-button-prev,
.netflix-swiper:hover .swiper-button-next {
  @apply opacity-100;
}

.netflix-swiper .swiper-button-prev {
  @apply left-[0rem];
}

.netflix-swiper .swiper-button-next {
  @apply right-[0rem];
}

.netflix-swiper .swiper-button-prev::after,
.netflix-swiper .swiper-button-next::after {
  content: "";
}

.image-style {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
  -webkit-text-fill-color: rgb(0, 0, 0);
  text-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.5);
}
</style>
