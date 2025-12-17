<template>
  <div
    v-if="!isLoggedIn"
    class="relative w-full overflow-hidden h-screen bg-fixed bg-center bg-cover bg-no-repeat transition-all mb-9"
    :style="{ backgroundImage: `url('${bgUrl}')` }"
  >
    <span>
      <div v-if="!loaded" class="absolute inset-0 bg-black/80"></div>
      <div
        v-else
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#000000CC_10%,#00000099_50%,#000000_100%)]"
      ></div>
    </span>

    <div
      class="relative z-20 flex flex-col xl:pt-10 text-center items-center justify-center h-full text-white gap-7 transition-all duration-900 animate-fade-up"
    >
      <div class="items-center flex flex-col gap-3">
        <h1
          class="font-[Gilroy-Bold] xl:text-6xl text-4xl max-w-2xl text-center xl:leading-14"
        >
          Unlimited movies, TV shows, and more
        </h1>
        <p class="font-[Gilroy-Bold] text-xl">
          Discover Movies. Find what to watch
        </p>
        <h3 class="font-[Gilroy-Medium] max-w-96 md:max-w-full">
          Ready to explore? Enter your email to discover movies and shows
          tailored to you.
        </h3>
      </div>

      <div class="grid">
        <div class="grid md:flex gap-3 place-items-center">
          <div class="relative md:w-96">
            <input
              v-model="email"
              id="emailInput"
              type="email"
              autocomplete="email"
              placeholder=" "
              :class="[
                'peer w-50 md:w-full border border-[#808080] bg-black/50 text-white rounded-sm caret-white px-3 pt-5 pb-2 min-w-80 md:min-w-96 font-[Gilroy-Medium]',
                'focus:outline-none focus:ring-2 text-base transition-all',
                ringColor,
              ]"
            />
            <label
              for="emailInput"
              :class="[
                'absolute left-3 font-[Gilroy-Medium] transition-all slide-fade-enter-active',
                email
                  ? 'top-2 text-xs text-[#BDBCBB] pl-0.5'
                  : 'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400',
                'peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#BDBCBB] peer-focus:pl-0.5',
              ]"
            >
              Email address
            </label>

            <div class="md:hidden">
              <p
                v-if="showError"
                class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max"
              >
                <i class="pi pi-times-circle flex items-center text-xs"></i>
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <button
            ref="initialFocus"
            @click="handleGetStarted"
            class="gap-3 bg-[#b20710] text-white items-center flex font-[Gilroy-Bold] text-xl md:text-2xl px-8 py-4 md:py-3 rounded-sm hover:bg-[#e32125] group transition-all duration-500 cursor-pointer"
          >
            Sign In
            <i
              class="pi pi-chevron-right text-xl group-hover:animate-pulse"
            ></i>
          </button>
        </div>

        <div class="hidden md:flex">
          <p
            v-if="showError"
            class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max"
          >
            <i class="pi pi-times-circle flex items-center text-xs"></i>
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════ -->
  <!-- LOGGED-IN HERO - CINEMATIC BILLBOARD WITH SMART AUTO-ROTATION -->
  <!-- ═══════════════════════════════════════════════════════════════ -->
  <div v-else class="relative w-full">
    <!-- Loading Skeleton -->
    <div
      v-if="loading"
      class="relative h-screen w-full bg-black flex flex-col justify-end p-10 animate-pulse overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-linear-to-b from-gray-800/80 via-gray-900/70 to-black/90"
      ></div>
      <div
        class="z-10 flex flex-col gap-4 transition-all duration-900 animate-fade-up"
      >
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

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-red-500 text-center py-20 bg-red-500/10 rounded-xl mt-10"
    >
      <p class="font-[Gilroy-SemiBold] text-xl mb-4">{{ error }}</p>
      <button
        @click="retryLoad"
        class="px-6 py-3 bg-[#b20710] hover:bg-[#e32125] text-white rounded-full font-[Gilroy-SemiBold] transition-all"
      >
        Retry
      </button>
    </div>

    <!-- Hero Carousel -->
    <div v-else class="relative h-screen overflow-hidden">
      <!-- Slides Container -->
      <div
        v-for="(item, index) in trendingAll.slice(0, 7)"
        :key="item.id"
        class="absolute inset-0 transition-all duration-1000"
        :class="
          currentSlideIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
        "
        @mouseenter="handleSlideHover(item, index)"
      >
        <!-- Background Image -->
        <div
          class="absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat transition-all duration-700"
          :style="{
            backgroundImage: item.backdrop_path
              ? `url(${baseUrl + item.backdrop_path})`
              : 'url(https://placehold.co/1920x1080/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat)',
            transform: currentSlideIndex === index ? 'scale(1)' : 'scale(1.1)',
          }"
        ></div>

        <!-- Cinematic Letterbox Bars -->
        <div
          class="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-black/90 to-transparent z-20"
        ></div>
        <div
          class="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-black via-black/60 to-transparent z-20"
        ></div>

        <!-- Content Overlay -->
        <div
          class="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16 z-30"
        >
          <!-- Title -->
          <h2
            class="text-4xl md:text-6xl lg:text-7xl font-[Gilroy-Bold] mb-4 max-w-4xl drop-shadow-2xl text-[#ffffffec] animate-fade-up"
          >
            {{ item.title || item.name }}
          </h2>

          <!-- Metadata Row -->
          <div
            class="flex flex-wrap items-center gap-3 md:gap-4 text-[#ffffffec] mb-4 animate-fade-up"
            style="animation-delay: 0.1s"
          >
            <!-- Rating -->
            <div
              class="flex items-center gap-2 px-3 py-1.5 bg-[#b20710] rounded-full"
            >
              <span class="text-yellow-400">⭐</span>
              <span class="font-[Gilroy-Bold]">{{
                item?.vote_average?.toFixed(1)
              }}</span>
            </div>

            <!-- Media Type -->
            <span
              class="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full font-[Gilroy-SemiBold] text-sm"
            >
              {{ item.media_type === "movie" ? "🎬 MOVIE" : "📺 TV SHOW" }}
            </span>

            <!-- Year -->
            <span class="font-[Gilroy-Medium] text-gray-300">
              {{
                new Date(
                  item.release_date ?? item.first_air_date ?? ""
                ).getFullYear()
              }}
            </span>

            <!-- Genres (Desktop) -->
            <div class="hidden md:flex gap-2">
              <router-link
                v-for="genreName in getGenreNames(item.genre_ids).slice(0, 3)"
                :key="genreName"
                :to="{
                  name: 'GenreView',
                  params: { name: genreName.toLowerCase() },
                }"
                class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-[Gilroy-SemiBold] text-[#ffffffec] hover:bg-[#b20710] transition-all duration-200"
              >
                {{ genreName }}
              </router-link>
            </div>
          </div>

          <!-- Genres (Mobile) -->
          <div
            class="flex md:hidden gap-2 mb-4 flex-wrap animate-fade-up"
            style="animation-delay: 0.15s"
          >
            <span
              v-for="genreName in getGenreNames(item.genre_ids).slice(0, 2)"
              :key="genreName"
              class="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[#ffffffec] text-sm font-[Gilroy-SemiBold]"
            >
              {{ genreName }}
            </span>
          </div>

          <!-- Overview -->
          <p
            class="text-base md:text-lg text-gray-200 font-[Gilroy-Medium] line-clamp-3 max-w-3xl mb-6 animate-fade-up"
            style="animation-delay: 0.2s"
          >
            {{ item.overview }}
          </p>

          <!-- Action Buttons -->
          <div
            class="flex flex-wrap gap-3 md:gap-4 animate-fade-up"
            style="animation-delay: 0.25s"
          >
            <button
              class="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-[Gilroy-Bold] disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg hover:bg-white/90 transition-all flex items-center gap-3 group"
              disabled
            >
              <span class="text-4xl text-white ml-1">▶</span>
              <span>Watch Trailer</span>
            </button>

            <button
              @click="modalStore.open(item.media_type, { id: item.id })"
              class="px-6 md:px-8 py-3 cursor-pointer md:py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-[Gilroy-SemiBold] text-base md:text-lg hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <i class="pi pi-info-circle"></i>
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
        <div
          class="h-full bg-[#b20710] transition-all duration-100"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <!-- Navigation Dots -->
      <div
        class="absolute bottom-2 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-40"
      >
        <button
          v-for="(item, index) in trendingAll.slice(0, 7)"
          :key="index"
          @click="goToSlide(index)"
          class="transition-all duration-300 rounded-full cursor-pointer"
          :class="
            currentSlideIndex === index
              ? 'w-8 h-2 bg-white'
              : 'w-2 h-2 bg-white/40 hover:bg-white/60'
          "
        ></button>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce z-40 hidden md:block"
      >
        <div class="flex flex-col items-center gap-2 text-white/60">
          <span class="text-sm font-[Gilroy-Medium]">Scroll to explore</span>
          <i class="pi pi-chevron-down text-xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroImg from "../../assets/Hero Image.png";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { useAuthStore } from "@/stores/auth";
import { useMedia } from "@/composables/useMedia";
import { genreMap } from "@/types/media";
import { useRouter } from "vue-router";

const emit = defineEmits<{
  "update-ambient": [color: string];
  "update-position": [position: { x: number; y: number }];
}>();

const router = useRouter();
const auth = useAuthStore();
const modalStore = useModalStore();

const {
  trendingAll,
  getTrendingAll,
  getTopRated,
  getUpcoming,
  loading,
  error,
} = useMedia();

const email = ref("");
const loaded = ref(false);
const touched = ref(false);
const bgUrl = HeroImg;

const currentSlideIndex = ref(0);
const progressPercentage = ref(0);
const slideDuration = 8000; // 8 seconds per slide
let slideInterval: ReturnType<typeof setInterval> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

const baseUrl = "https://image.tmdb.org/t/p/w1280";

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

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
  if (!genreIds || !genreIds.length) return [];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

function goToSlide(index: number) {
  currentSlideIndex.value = index;
  resetProgress();
}

function nextSlide() {
  const maxSlides = Math.min(trendingAll.value.length, 7);
  currentSlideIndex.value = (currentSlideIndex.value + 1) % maxSlides;
  resetProgress();
}

function resetProgress() {
  progressPercentage.value = 0;
  if (progressInterval) clearInterval(progressInterval);
  startProgressBar();
}

function startProgressBar() {
  const updateInterval = 50; // Update every 50ms
  const incrementPerUpdate = (100 / slideDuration) * updateInterval;

  progressInterval = setInterval(() => {
    progressPercentage.value += incrementPerUpdate;
    if (progressPercentage.value >= 100) {
      progressPercentage.value = 100;
    }
  }, updateInterval);
}

function startAutoRotation() {
  slideInterval = setInterval(() => {
    nextSlide();
  }, slideDuration);

  startProgressBar();
}

function stopAutoRotation() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function handleSlideHover(item: any, index: number) {
  // Emit ambient color based on movie
  const hue = (index * 50) % 360;
  emit("update-ambient", `hsl(${hue}, 70%, 50%)`);
  emit("update-position", { x: 50, y: 30 });
}

async function retryLoad() {
  loading.value = true;
  error.value = null;
  try {
    await Promise.all([getTrendingAll(), getTopRated(), getUpcoming()]);
  } catch (err: any) {
    console.error("❌ Failed to fetch movies:", err);
    error.value = "Couldn't load movies. Please refresh in a bit";
  } finally {
    loading.value = false;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// LIFECYCLE
// ══════════════════════════════════════════════════════════════════════════
onMounted(async () => {
  // Load background image for non-logged-in view
  const img = new Image();
  img.src = bgUrl;
  img.onload = () => (loaded.value = true);

  // Sync auth
  if (!auth.loaded) auth.syncUser();

  // Load media if logged in
  if (isLoggedIn.value) {
    loading.value = true;
    error.value = null;

    try {
      await Promise.all([getTrendingAll(), getTopRated(), getUpcoming()]);
      // Start auto-rotation after data loads
      if (trendingAll.value.length > 0) {
        startAutoRotation();
      }
    } catch (err: any) {
      console.error("❌ Failed to fetch movies:", err);
      error.value = "Couldn't load movies. Please refresh in a bit";
    } finally {
      loading.value = false;
    }
  }
});

onUnmounted(() => {
  stopAutoRotation();
});
</script>

<style scoped>
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out forwards;
}
</style>
