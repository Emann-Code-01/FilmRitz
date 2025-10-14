<template>
  <div>
    <div v-if="!auth.loaded" class="flex items-center justify-center min-h-screen text-white">
      <p class="animate-pulse text-lg tracking-wide">Yo, welcome back to FilmRitz — we’ve been expecting you! Let’s dive
        into what’s trending. 🎬</p>
    </div>

    <template v-else-if="!isLoggedIn">
      <HeroSection />
      <SubPreview />
      <BlockSection />
    </template>

    <template v-else>
      <div class="relative w-full transition-all duration-900 animate-fade-up">
        <div v-if="loading" class="text-white text-center py-20 font-[Gilroy-SemiBold]">🎬 Loading Movie Slide...</div>
        <div v-else-if="error" class="text-red-500 text-center py-20">
          {{ error }}
        </div>

        <swiper v-else :modules="[Pagination, Autoplay, Navigation]" :slides-per-view="1" :slides-per-group="1"
          :autoplay="{ delay: 4000, disableOnInteraction: true }" :pagination="{ dynamicBullets: true }"
          :loop="trending.length > 1" :breakpoints="{
            320: { slidesPerView: 1, slidesPerGroup: 1, },
            640: { slidesPerView: 1, },
            1024: { slidesPerView: 1, }
          }" class="mySwiper transition-all duration-200 xl:w-full h-screen">
          <swiper-slide v-for="movie in trending" :key="movie.id" class="relative overflow-hidden text-white shadow-xl">
            <div
              class="absolute top-0 inset-0 bg-fixed bg-center bg-cover w-full bg-no-repeat transition-all duration-500 animate-ease-in"
              :style="{ backgroundImage: `url(${baseUrl + movie.backdrop_path})` }"></div>
            <div class="absolute inset-0">
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 w-full to-black/90 flex flex-col justify-end p-10">
              <h2 class="text-4xl font-[Gilroy-Bold] mb-3">{{ movie.title }}</h2>
              <div class="flex items-center gap-4">
                <span class="px-2 py-1 bg-green-700 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">
                  {{ movie?.vote_average.toFixed(1) }}
                </span>
                <span class="text-sm font-[Gilroy-Medium]">
                  {{ new Date(movie?.release_date).getFullYear() }}
                </span>
                <router-link to="/movie/:id" @click.prevent="modalStore.open('movie', { movieId: movie.id })"
                  class="grid text-center justify-center items-center text-lg text-white font-[Gilroy-SemiBold] transition-all duration-300">
                  <i class="pi pi-info-circle"></i>
                  <span>Info</span>
                </router-link>
              </div>
              <p class="text-lg text-gray-300 font-[Gilroy-Medium] line-clamp-3">{{ movie.overview }}</p>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <main class="space-y-10 p-6  text-white">
        <section>
          <h2 class="text-2xl font-bold mb-3">🔥 Trending Now</h2>
          <TrendingNow />
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-3">⭐ Top Rated</h2>
          <TopRated />
        </section>

        <!-- Upcoming -->
        <section>
          <h2 class="text-2xl font-bold mb-3">🎬 Coming Soon</h2>
          <upComing />
        </section>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMovies } from "../composables/useMovie";
import HeroSection from "../components/PHome/HeroSection.vue";
import SubPreview from "../components/PHome/SubPreview.vue"
import BlockSection from "../components/PHome/BlockSection.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useModalStore } from "../stores/modalStore";
import TrendingNow from "../components/movies/TrendingNow.vue";
import TopRated from "../components/movies/TopRated.vue";
import upComing from "../components/movies/ComingSoon.vue";

// --- Stores ---
const auth = useAuthStore();
const modalStore = useModalStore();
const isLoggedIn = computed(() => auth.isLoggedIn);

// --- Movies composable ---
const { trending, upcoming, getTrending, getTopRated, getUpcoming, loading, error } = useMovies();

const baseUrl = "https://image.tmdb.org/t/p/w1280";

// --- Lifecycle: fetch all movies on mount ---
onMounted(async () => {
  // Sync user if not loaded
  if (!auth.loaded) auth.syncUser();

  loading.value = true;
  error.value = null;

  try {
    // Fetch all three categories in parallel
    await Promise.all([getTrending(), getTopRated(), getUpcoming()]);
  } catch (err: any) {
    console.error("❌ Failed to fetch movies:", err);
    error.value = "Couldn’t load movies. Please try again later 😔";
  } finally {
    loading.value = false;
  }
});
</script>


<style scoped></style>
