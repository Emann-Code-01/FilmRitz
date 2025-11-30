<template>
  <div class="relative min-h-screen bg-[#0a0a0a]">
    <!-- Splash Screen -->
    <div v-if="!auth.loaded" class="flex items-center justify-center min-h-screen text-white">
      <SplashScreen />
    </div>

    <!-- Main Content -->
    <div v-else class="relative">

      <!-- 🌈 Global Ambient Lighting Layer -->
      <div class="fixed inset-0 pointer-events-none transition-all duration-1000 z-0"
        :class="{ 'blur-3xl opacity-50': canHandleAdvancedEffects, 'opacity-0': !canHandleAdvancedEffects }" :style="{
          background: `radial-gradient(circle at ${ambientPosition.x}% ${ambientPosition.y}%, ${ambientColor}40 0%, ${ambientColor}20 30%, transparent 70%)`
        }" />

      <!-- Content Wrapper -->
      <div class="relative z-10">
        <section class="relative">
          <HeroSection @update-ambient="updateAmbientColor" @update-position="updateAmbientPosition" />
        </section>
        <template v-if="!isLoggedIn">
          <SubPreview />
          <BlockSection />
        </template>
        <template v-else>
          <main role="main" class="space-y-16 pb-20 mt-4">
            <section class="px-4 md:px-8 lg:px-12">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3">
                  <span class="text-4xl">🔥</span>
                  Trending This Week
                </h2>
                <router-link to="/ng/tv-shows"
                  class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] transition-colors">
                  View All →
                </router-link>
              </div>
              <TrendingGrid @update-ambient="updateAmbientColor" />
            </section>
            <section class="relative overflow-hidden">
              <div class="px-4 md:px-8 lg:px-12 mb-6">
                <h2 class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3">
                  <span class="text-4xl">⚡</span>
                  What's Hot Right Now
                </h2>
              </div>
              <WhatsHotCarousel @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2 class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3">
                <span class="text-4xl">🎭</span>
                Explore by Genre
              </h2>
              <GenreDeepDive @update-ambient="updateAmbientColor" />
            </section>
            <section class="relative">
              <div class="px-4 md:px-8 lg:px-12 mb-6">
                <h2 class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3">
                  <span class="text-4xl">🎥</span>
                  Trailer Spotlight
                </h2>
              </div>
              <TrailerSpotlight @update-ambient="updateAmbientColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <div class="flex items-center justify-between flex-col gap-3 mb-6">
                <h2 class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3">
                  <span class="text-4xl">📅</span>
                  New Releases
                </h2>
                <div class="flex gap-2">
                  <button v-for="period in ['This Week', 'Last Week', 'This Month']" :key="period"
                    @click="selectedPeriod = period"
                    class="px-4 py-2 rounded-lg font-[Gilroy-SemiBold] transition-all cursor-pointer" :class="selectedPeriod === period
                      ? 'bg-[#b20710] text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'">
                    {{ period }}
                  </button>
                </div>
              </div>
              <NewReleasesTimeline :period="selectedPeriod" @update-ambient="updateAmbientColor" />
            </section>

            <!-- ─────────────────────────────────────────────────────────── -->
            <!-- 7. TOP RATED — Enhanced Original Section -->
            <!-- ─────────────────────────────────────────────────────────── -->
            <section class="px-4 md:px-8 lg:px-12">
              <h2 class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3">
                <span class="text-4xl">⭐</span>
                Top Rated All Time
              </h2>
              <TopRated @update-ambient="updateAmbientColor" />
            </section>

            <!-- ─────────────────────────────────────────────────────────── -->
            <!-- 8. CURATED COLLECTIONS — Card Stack -->
            <!-- ─────────────────────────────────────────────────────────── -->
            <section class="px-4 md:px-8 lg:px-12">
              <h2 class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3">
                <span class="text-4xl">📚</span>
                Curated Collections
              </h2>
              <CuratedCollections @update-ambient="updateAmbientColor" />
            </section>

            <!-- ─────────────────────────────────────────────────────────── -->
            <!-- 9. COMING SOON — Enhanced with Countdown -->
            <!-- ─────────────────────────────────────────────────────────── -->
            <section class="px-4 md:px-8 lg:px-12">
              <h2 class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3">
                <span class="text-4xl">🎬</span>
                Coming Soon
              </h2>
              <ComingSoon @update-ambient="updateAmbientColor" />
            </section>

            <!-- ─────────────────────────────────────────────────────────── -->
            <!-- 10. EXPLORE BY MOOD — Interactive Wheel (Optional) -->
            <!-- ─────────────────────────────────────────────────────────── -->
            <section v-if="canHandleAdvancedEffects" class="px-4 md:px-8 lg:px-12">
              <h2 class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3">
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
import { useAuthStore } from "../stores/auth";
import { useHead } from '@unhead/vue';

// ══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════════════
// Existing
import SplashScreen from "./SplashScreen.vue";
import HeroSection from "../components/Home/HeroSection.vue";
import SubPreview from "../components/Home/SubPreview.vue";
import BlockSection from "../components/Home/BlockSection.vue";
import TopRated from "../components/media/TopRated.vue";
import ComingSoon from "../components/media/ComingSoon.vue";

// New Premium Sections (You'll create these)
import TrendingGrid from "../components/media/TrendingGrid.vue";
import WhatsHotCarousel from "../components/media/WhatsHotCarousel.vue";
import GenreDeepDive from "../components/media/GenreDeepDive.vue";
import TrailerSpotlight from "../components/media/TrailerSpotlight.vue";
import NewReleasesTimeline from "../components/media/NewReleasesTimeline.vue";
import CuratedCollections from "../components/media/CuratedCollections.vue";
import MoodWheel from "../components/media/MoodWheel.vue";

// ══════════════════════════════════════════════════════════════════════════
// SEO
// ══════════════════════════════════════════════════════════════════════════
useHead({
  title: 'FilmRitz — Discover Movies & TV Series with Cinematic Trailers',
  meta: [
    { name: 'description', content: 'Experience movies and shows like never before. Watch trailers, explore curated collections, and discover your next favorite in a premium cinematic interface.' },
    { name: 'keywords', content: 'filmritz, movies, tv shows, trailers, movie discovery, cinematic experience, vue project, Ifeoluwa Olajubaje, EmannCode' },
    { property: 'og:title', content: 'FilmRitz — Premium Movie Discovery' },
    { property: 'og:description', content: 'Your gateway to cinematic discovery with immersive trailers and curated collections.' },
    { property: 'og:image', content: 'https://filmritz.vercel.app/filmritzlogo2.png' },
    { property: 'og:url', content: 'https://filmritz.vercel.app/ng' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'index, follow' }
  ]
});

// ══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════
const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);

// Timeline filter
const selectedPeriod = ref<string>('This Week');

// ══════════════════════════════════════════════════════════════════════════
// 🌈 ENHANCED AMBIENT LIGHTING SYSTEM
// ══════════════════════════════════════════════════════════════════════════
const ambientColor = ref<string>("#111111");
const ambientPosition = ref<{ x: number; y: number }>({ x: 50, y: 30 });
const canHandleAdvancedEffects = ref<boolean>(false);

// Update ambient color from child components
function updateAmbientColor(color: string) {
  if (!canHandleAdvancedEffects.value) return;
  ambientColor.value = color;
}

// Update ambient position for dynamic glow movement
function updateAmbientPosition(position: { x: number; y: number }) {
  if (!canHandleAdvancedEffects.value) return;
  ambientPosition.value = position;
}

// ══════════════════════════════════════════════════════════════════════════
// 🚀 PERFORMANCE OPTIMIZATION
// ══════════════════════════════════════════════════════════════════════════
onMounted(() => {
  // Detect device capabilities
  const cores = navigator.hardwareConcurrency || 2;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const connection = (navigator as any).connection;
  const isSlowConnection = connection?.effectiveType === '2g' ||
    connection?.effectiveType === 'slow-2g';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Enable advanced effects only on capable devices
  canHandleAdvancedEffects.value =
    cores > 4 &&
    !isMobile &&
    !isSlowConnection &&
    !prefersReducedMotion;

  // Log for debugging
  console.log('🎬 FilmRitz Performance Mode:', {
    cores,
    isMobile,
    isSlowConnection,
    prefersReducedMotion,
    advancedEffects: canHandleAdvancedEffects.value
  });
});
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for premium feel */
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