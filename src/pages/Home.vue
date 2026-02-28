<template>
  <div class="relative min-h-screen">
    <!-- Splash Screen -->
    <div
      v-if="!auth.loaded"
      class="flex items-center justify-center min-h-screen text-white"
    >
      <SplashScreen />
    </div>

    <!-- Main Content -->
    <div v-else class="relative">
      <div class="relative z-10">
        <section class="relative">
          <HeroSection
            @update-ambient="updateColor"
            @update-position="updatePosition"
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
                  Trending This Week
                </h2>
                <router-link
                  to="/ng/trending"
                  class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] transition-all flex text-nowrap items-center gap-1"
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="size-5 hidden md:block"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </router-link>
              </div>
              <MediaRotationGrid
                category="trending"
                @update-ambient="updateColor"
              />
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
                  What's Hot Right Now
                </h2>
              </div>
              <WhatsHotCarousel @update-ambient="updateColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                Explore by Genre
              </h2>
              <GenreDeepDive @update-ambient="updateColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                All-Time Fan Favorites
              </h2>
              <MediaRotationGrid
                category="popular"
                @update-ambient="updateColor"
              />
            </section>
            <section class="relative">
              <div class="px-4 md:px-8 lg:px-12 mb-6">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
                >
                  Trailer Spotlight
                </h2>
              </div>
              <TrailerSpotlight @update-ambient="updateColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                Top Rated All Time
              </h2>
              <MediaRotationGrid
                category="topRated"
                @update-ambient="updateColor"
              />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <div class="flex items-center justify-between mb-6">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
                >
                  Curated Collections
                </h2>
                <router-link
                  to="/ng/collections"
                  class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] transition-all flex text-nowrap items-center gap-1"
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="size-5 hidden md:block"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </router-link>
              </div>
              <CuratedCollections :limit="4" @update-ambient="updateColor" />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                UpComing
              </h2>
              <MediaRotationGrid
                category="upcoming"
                @update-ambient="updateColor"
              />
            </section>
            <section class="px-4 md:px-8 lg:px-12">
              <h2
                class="text-3xl font-[Gilroy-Bold] text-white mb-6 flex items-center gap-3"
              >
                Explore by Mood
              </h2>
              <MoodWheel @update-ambient="updateColor" />
            </section>
          </main>
        </template>
      </div>
    </div>
    <AdsenseAd v-if="isLoggedIn && consentGranted" adSlot="5823677820" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useHead } from "@unhead/vue";
import { useAmbient } from "@/composables/useAmbient";

// Components
import SplashScreen from "./SplashScreen.vue";
import HeroSection from "@/components/Home/HeroSection.vue";
import SubPreview from "@/components/Home/SubPreview.vue";
import BlockSection from "@/components/Home/BlockSection.vue";
import AdSlot from "@/components/ads/AdSlot.vue";
import AdsenseAd from "@/components/ads/AdsenseAd.vue";
import MediaRotationGrid from "@/components/media/MediaRotationGrid.vue";
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

const { isAmbientEnabled, updateColor, updatePosition, randomizeColor } =
  useAmbient();

// Performance Optimization
onMounted(() => {
  // Read ad consent
  const consent = localStorage.getItem("adConsent");
  if (consent === "granted") {
    consentGranted.value = true;
  }

  // Set initial random ambient color if enabled
  if (isAmbientEnabled.value) {
    randomizeColor();
  }

  console.log("FilmRitz Home Mounted:", {
    ambientEnabled: isAmbientEnabled.value,
    consentGranted: consentGranted.value,
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
