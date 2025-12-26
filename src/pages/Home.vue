<template>
  <div class="relative min-h-screen bg-[#0a0a0a]">
    <!-- Splash Screen -->
    <div
      v-if="!auth.loaded"
      class="flex items-center justify-center min-h-screen text-white"
    >
      <SplashScreen />
    </div>

    <!-- Main Content -->
    <div v-else class="relative">
      <!-- 🌈 Global Ambient Lighting Layer -->
      <div
        v-if="canHandleAdvancedEffects"
        class="fixed inset-0 pointer-events-none transition-all duration-1000 z-0 blur-3xl opacity-50"
        :style="{
          background: `radial-gradient(circle at ${ambientPosition.x}% ${ambientPosition.y}%, ${ambientColor}40 0%, ${ambientColor}20 30%, transparent 70%)`,
        }"
      ></div>
      <div class="relative z-10">
        <section class="relative">
          <HeroSection
            @update-ambient="updateAmbientColor"
            @update-position="updateAmbientPosition"
          />
        </section>
        <AdSlot v-if="isLoggedIn" />
        <template v-if="!isLoggedIn">
          <SubPreview />
          <BlockSection />
        </template>
        <template v-else>
          <main role="main" class="space-y-16 pb-20 mt-4">
            <section class="px-4 md:px-8 lg:px-12">
              <div class="flex items-center justify-between mb-6">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
                >
                  <span class="text-4xl">🔥</span>
                  Trending This Week
                </h2>
                <router-link
                  to="/ng/trending"
                  class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] transition-colors"
                >
                  View All →
                </router-link>
              </div>
              <TrendingGrid @update-ambient="updateAmbientColor" />
            </section>
            <AdsenseAd
              v-if="isLoggedIn && consentGranted"
              adSlot="5823677820"
            />
            <section class="relative overflow-hidden">
              <div class="px-4 md:px-8 lg:px-12">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
                >
                  <span class="text-4xl">⚡</span>
                  What's Hot Right Now
                </h2>
              </div>
              <WhatsHotCarousel @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                <span class="text-4xl">🎭</span>
                Explore by Genre
              </h2>
              <GenreDeepDive @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                <span class="text-4xl">👑</span>
                All-Time Fan Favorites
              </h2>
              <PopularGrid @update-ambient="updateAmbientColor" />
            </section>
            <section class="relative">
              <div class="px-4 md:px-8 lg:px-12 mb-6">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
                >
                  <span class="text-4xl">🎥</span>
                  Trailer Spotlight
                </h2>
              </div>
              <TrailerSpotlight @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                <span class="text-4xl">⭐</span>
                Top Rated All Time
              </h2>
              <TopRated @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <div class="flex items-center justify-between mb-6">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
                >
                  <span class="text-4xl">📚</span>
                  Curated Collections
                </h2>
                <router-link
                  to="/ng/collections"
                  class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] transition-colors"
                >
                  View All →
                </router-link>
              </div>
              <CuratedCollections
                :limit="3"
                @update-ambient="updateAmbientColor"
              />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                <span class="text-4xl">🎬</span>
                UpComing
              </h2>
              <UpComing @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                <span class="text-4xl">🎨</span>
                Explore by Mood
              </h2>
              <MoodWheel @update-ambient="updateAmbientColor" />
            </section>
          </main>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useHead } from "@unhead/vue";

// Components
import SplashScreen from "./SplashScreen.vue";
import HeroSection from "@/components/Home/HeroSection.vue";
import SubPreview from "@/components/Home/SubPreview.vue";
import BlockSection from "@/components/Home/BlockSection.vue";
import TopRated from "@/components/media/TopRatedGrid.vue";
import PopularGrid from "@/components/media/PopularGrid.vue";
import UpComing from "@/components/media/UpComingGrid.vue";
import AdSlot from "@/components/ads/AdSlot.vue";
import AdsenseAd from "@/components/ads/AdsenseAd.vue";
import TrendingGrid from "@/components/media/TrendingGrid.vue";
import WhatsHotCarousel from "@/components/media/WhatsHotCarousel.vue";
import GenreDeepDive from "@/components/media/GenreDeepDive.vue";
import TrailerSpotlight from "@/components/media/TrailerSpotlight.vue";
import CuratedCollections from "@/components/media/CuratedCollections.vue";
import MoodWheel from "@/components/media/MoodWheel.vue";

// SEO
useHead({
  title: "FilmRitz — Discover Movies & TV Series with Cinematic Trailers",
  meta: [
    {
      name: "description",
      content:
        "Experience movies and shows like never before. Watch trailers, explore curated collections, and discover your next favorite in a premium cinematic interface.",
    },
    {
      name: "keywords",
      content:
        "filmritz, movies, tv shows, trailers, movie discovery, cinematic experience, vue project, Ifeoluwa Olajubaje, EmannCode",
    },
    { property: "og:title", content: "FilmRitz — Premium Movie Discovery" },
    {
      property: "og:description",
      content:
        "Your gateway to cinematic discovery with immersive trailers and curated collections.",
    },
    {
      property: "og:image",
      content: "https://filmritz.vercel.app/filmritzlogo2.png",
    },
    { property: "og:url", content: "https://filmritz.vercel.app/ng" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "index, follow" },
  ],
});

// State
const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);
const consentGranted = ref(false);

// Ambient colors pool for variety
const ambientColors = [
  "#b20710", // FilmRitz Red
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Green
  "#EF4444", // Red
  "#06B6D4", // Cyan
];

// Ambient Lighting
const ambientColor = ref<string>("#b20710");
const ambientPosition = ref<{ x: number; y: number }>({ x: 50, y: 30 });
const canHandleAdvancedEffects = ref<boolean>(false);

// Get random color from pool
const getRandomAmbientColor = () => {
  return ambientColors[Math.floor(Math.random() * ambientColors.length)];
};

// Update ambient color from child components
function updateAmbientColor(color: string) {
  if (!canHandleAdvancedEffects.value || !color) return;
  ambientColor.value = color;
}

// Update ambient position for dynamic glow movement
function updateAmbientPosition(position: { x: number; y: number }) {
  if (!canHandleAdvancedEffects.value || !position) return;
  ambientPosition.value = position;
}

// Toggle ambient effects
function toggleAmbient() {
  canHandleAdvancedEffects.value = !canHandleAdvancedEffects.value;
  localStorage.setItem(
    "ambientEnabled",
    String(canHandleAdvancedEffects.value)
  );

  if (canHandleAdvancedEffects.value) {
    ambientColor.value = getRandomAmbientColor();
  }
}

// Performance Optimization
onMounted(() => {
  // Check if user has a saved preference
  const savedPreference = localStorage.getItem("ambientEnabled");

  // Detect device capabilities
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // If user has saved preference, use that
  if (savedPreference !== null) {
    canHandleAdvancedEffects.value = savedPreference === "true";
  } else {
    // Default: ON for mobile, OFF for desktop (md and larger)
    canHandleAdvancedEffects.value = isMobile && !prefersReducedMotion;
  }

  // Set random ambient color on page load if enabled
  if (canHandleAdvancedEffects.value) {
    ambientColor.value = getRandomAmbientColor();
  }

  // Read ad consent
  const consent = localStorage.getItem("adConsent");
  if (consent === "granted") {
    consentGranted.value = true;
  }

  console.log("🎬 FilmRitz Ambient Mode:", {
    isMobile,
    prefersReducedMotion,
    ambientEnabled: canHandleAdvancedEffects.value,
    savedPreference,
    consentGranted: consentGranted.value,
    initialAmbientColor: ambientColor.value,
  });
});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #b20710;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e32125;
}
</style>
