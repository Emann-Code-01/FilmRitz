<template>
  <div>
    <div v-if="!auth.loaded" class="flex items-center justify-center min-h-screen text-white">
      <SplashScreen />
    </div>

    <div v-else>
      <HeroSection />

      <template v-if="!isLoggedIn">
        <SubPreview />
        <BlockSection />
      </template>

      <template v-else>
        <main class="space-y-10 p-6 text-white">
          <section>
            <h2 class="text-2xl font-[Gilroy-Bold] mb-3">🔥 Trending Now</h2>
            <TrendingGrid />
          </section>

          <section>
            <h2 class="text-2xl font-[Gilroy-Bold] mb-3">⭐ Top Rated</h2>
            <TopRated />
          </section>

          <section>
            <h2 class="text-2xl font-[Gilroy-Bold] mb-3">🎬 UpComing</h2>
            <Upcoming />
          </section>
        </main>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "../../src/stores/auth";
import { useHead } from "#imports";
import HeroSection from "../../src/components/Home/HeroSection.vue";
import SubPreview from "../../src/components/Home/SubPreview.vue";
import BlockSection from "../../src/components/Home/BlockSection.vue";
import TrendingGrid from "../../src/components/media/TrendingGrid.vue";
import TopRated from "../../src/components/media/TopRatedGrid.vue";
import Upcoming from "../../src/components/media/UpComingGrid.vue";
import SplashScreen from "../../src/pages/splashScreen.vue";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);

// --- SEO ---
useHead({
  title: "FilmRitz — Discover Trending Movies & TV Series",
  link: [
    {
      rel: "canonical",
      href: "https://filmritz.vercel.app/ng/"
    }
  ],
  meta: [
    {
      name: "description",
      content:
        "FilmRitz — Discover trending movies and TV series in a fast, modern, immersive interface."
    },

    { name: "keywords", content: "filmritz, movies, tv shows, discover, trending, entertainment, emanncode, ifeoluwa olajubaje emmanuel" },

    // Open Graph
    { property: "og:site_name", content: "FilmRitz" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "FilmRitz — Discover Trending Movies & TV Series" },
    {
      property: "og:description",
      content: "Explore trending films, series, and upcoming releases."
    },
    {
      property: "og:image",
      content: "https://filmritz.vercel.app/filmritzlogo2.png"
    },
    { property: "og:url", content: "https://filmritz.vercel.app/ng/" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "FilmRitz — Discover Trending Movies & TV Series" },
    {
      name: "twitter:description",
      content: "Explore trending films, series, and upcoming releases."
    },
    {
      name: "twitter:image",
      content: "https://filmritz.vercel.app/filmritzlogo2.png"
    },

    // robots
    { name: "robots", content: "index, follow" }
  ]
});
</script>

<style scoped></style>
