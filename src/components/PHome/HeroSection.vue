<template>
  <div v-if="!isLoggedIn"
    class="relative w-full overflow-hidden h-screen bg-fixed bg-center bg-cover bg-no-repeat transition-all mb-9"
    :style="{ backgroundImage: `url('${bgUrl}')` }">
    <span>
      <div v-if="!loaded" class="absolute inset-0 bg-black/80"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_bottom,#000000CC_10%,#00000099_50%,#000000_100%)]"></div>
    </span>

    <div
      class="relative z-20 flex flex-col xl:pt-10 text-center items-center justify-center h-full text-white gap-7 transition-all duration-900 animate-fade-up">
      <div class="items-center flex flex-col gap-3">
        <h1 class="font-[Gilroy-Bold] xl:text-6xl text-4xl max-w-2xl text-center xl:leading-14">
          Unlimited movies, TV shows, and more
        </h1>
        <p class="font-[Gilroy-Bold] text-xl">
          Watch anywhere. Cancel anytime.
        </p>
        <h3 class="font-[Gilroy-Medium] max-w-96 md:max-w-full">
          Ready to watch? Enter your email to create or restart your
          membership.
        </h3>
      </div>

      <div class="grid">
        <div class="grid md:flex gap-3 place-items-center">
          <div class="relative md:w-96">
            <input v-model="email" id="emailInput" type="email" autocomplete="email" placeholder=" " :class="[
              'peer w-50 md:w-full border border-[#808080] bg-black/50 text-white rounded-sm caret-white px-3 pt-5 pb-2 min-w-80 md:min-w-96 font-[Gilroy-Medium]',
              'focus:outline-none focus:ring-2 text-base transition-all',
              ringColor,
            ]" />
            <label for="emailInput" :class="[
              'absolute left-3 font-[Gilroy-Medium] transition-all slide-fade-enter-active',
              email
                ? 'top-2 text-xs text-[#BDBCBB] pl-0.5'
                : 'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400',
              'peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#BDBCBB] peer-focus:pl-0.5',
            ]">
              Email address
            </label>

            <div class="md:hidden">
              <p v-if="showError" class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max">
                <i class="pi pi-times-circle flex items-center text-xs"></i>
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <button ref="initialFocus" @click="handleGetStarted"
            class="gap-3 bg-[#b20710] text-white items-center flex font-[Gilroy-Bold] text-xl md:text-2xl px-8 py-4 md:py-3 rounded-sm hover:bg-[#e32125] group transition-all duration-500 cursor-pointer">
            Sign In
            <i class="pi pi-chevron-right text-xl group-hover:animate-pulse"></i>
          </button>
        </div>

        <div class="hidden md:flex">
          <p v-if="showError" class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max">
            <i class="pi pi-times-circle flex items-center text-xs"></i>
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- ✅ Logged-in Hero Section -->
  <div v-else class="relative w-full transition-all duration-900 animate-fade-up">
    <!-- ✅ Replaced the loading message with skeleton -->
    <div v-if="loading"
      class="relative h-screen w-full bg-black flex flex-col justify-end p-10 animate-pulse overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-gray-800/80 via-gray-900/70 to-black/90"></div>
      <div class="z-10 flex flex-col gap-4">
        <div class="w-3/10 h-10 bg-gray-700 rounded-lg"></div>
        <div class="flex items-center gap-4">
          <div class="w-10 h-5 bg-gray-700 rounded"></div>
          <div class="w-16 h-5 bg-gray-700 rounded"></div>
          <div class="flex gap-2">
            <div class="w-14 h-5 bg-gray-700 rounded"></div>
            <div class="w-14 h-5 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div class="w-full h-16 bg-gray-700 rounded-md mt-3"></div>
      </div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-20">
      {{ error }}
    </div>

    <swiper v-else :modules="[Pagination, Autoplay, Navigation]" :slides-per-view="1" :slides-per-group="1"
      :autoplay="{ delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true }" :free-mode="true"
      :free-mode-momentum="false" :pagination="{ dynamicBullets: true }" :loop="trendingAll.length > 1"
      class="mySwiper transition-all duration-200 xl:w-full h-screen">
      <swiper-slide v-for="item in trendingAll" :key="item.id + item.media_type"
        class="relative overflow-hidden text-white shadow-xl">
        <div
          class="absolute top-0 inset-0 bg-fixed bg-center bg-cover w-full bg-no-repeat transition-all duration-500 animate-ease-in"
          :style="{
            backgroundImage: item.backdrop_path
              ? `url(${baseUrl + item.backdrop_path})`
              : 'url(https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat)',
          }"></div>

        <div
          class="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-black/90 flex flex-col justify-end p-10">
          <h2 class="text-4xl font-[Gilroy-Bold] mb-3">
            {{ item.title || item.name }}
          </h2>

          <div class="flex items-center gap-4">
            <span class="px-2 py-1 bg-[#b20710]/70 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">
              {{ item?.vote_average?.toFixed(1) }}
            </span>
            <span class="px-2 py-1 text-white bg-white/10 rounded-md text-sm font-[Gilroy-SemiBold]">{{
              item.media_type.toUpperCase() }}</span>
            <span class="text-sm font-[Gilroy-Medium]">
              {{
                new Date(
                  item.release_date ?? item.first_air_date ?? ''
                ).getFullYear()
              }}
            </span>

            <div class="md:flex gap-2 hidden">
              <router-link v-for="genreName in getGenreNames(item.genre_ids)" :key="genreName"
                :to="{ name: 'GenreView', params: { name: genreName.toLowerCase() } }"
                class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200 cursor-pointer">
                {{ genreName }}
              </router-link>
            </div>

            <router-link to="" @click.prevent.stop="modalStore.open(item.media_type, { id: item.id })"
              class="grid text-center justify-center items-center text-lg text-white font-[Gilroy-SemiBold] transition-all duration-300">
              <i class="pi pi-info-circle"></i>
              <span>Info</span>
            </router-link>
          </div>

          <div class="flex gap-2 md:hidden">
            <span v-for="genreName in getGenreNames(item.genre_ids)" :key="genreName"
              class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200">
              {{ genreName }}
            </span>
          </div>

          <p class="text-lg text-gray-300 font-[Gilroy-Medium] line-clamp-3">
            {{ item.overview }}
          </p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import HeroImg from "../../assets/Hero Image.png";
import { ref, computed, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { useModalStore } from "../../stores/modalStore";
import { useAuthStore } from "../../stores/auth";
import { useMedia } from "../../composables/useMedia";
import { genreMap } from "../../types/genres";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();
const modalStore = useModalStore();

const email = ref("");
const loaded = ref(false);
const touched = ref(false);

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const bgUrl = HeroImg;

const {
  trendingAll,
  getTrendingAll,
  getTopRated,
  getUpcoming,
  loading,
  error,
} = useMedia();

const baseUrl = "https://image.tmdb.org/t/p/w1280";

const ringColor = computed(() => {
  if (email.value === "") return "focus:ring-[#BDBCBB]";
  return isValidEmail(email.value)
    ? "focus:ring-green-500"
    : "focus:ring-red-500";
});
const isLoggedIn = computed(() => auth.isLoggedIn);
const showError = computed(() => {
  if (!touched.value && email.value === "") return false;
  return !isValidEmail(email.value);
});
const errorMessage = computed(() => {
  if (email.value === "") return "Email is required.";
  return "Please enter a valid email address.";
});

function handleGetStarted() {
  touched.value = true;
  if (isValidEmail(email.value)) {
    localStorage.setItem("prefillEmail", email.value);
    router.push({ path: "/ng/login" });
  }
}

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return ["Unknown"];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

onMounted(() => {
  const img = new Image();
  img.src = bgUrl;
  img.onload = () => (loaded.value = true);
});

onMounted(async () => {
  if (!auth.loaded) auth.syncUser();

  loading.value = true;
  error.value = null;

  try {
    await Promise.all([getTrendingAll(), getTopRated(), getUpcoming()]);
  } catch (err: any) {
    console.error("❌ Failed to fetch movies:", err);
    error.value = "Couldn’t load movies. Please refresh in a bit";
  } finally {
    loading.value = false;
  }
});
</script>
