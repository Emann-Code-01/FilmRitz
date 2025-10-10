<template>
  <div>
    <div v-if="!auth.loaded" class="flex items-center justify-center min-h-screen text-white">
      <p class="animate-pulse text-lg tracking-wide">Loading FilmRitz...</p>
    </div>

    <template v-else-if="!isLoggedIn">
      <HeroSection />
      <!-- <SubPreview /> -->
      <BlockSection />
    </template>

    <template v-else>
      <main class="space-y-10 p-6 mt-18 text-white">
        <!-- Trending -->
        <section>
          <h2 class="text-2xl font-bold mb-3">🔥 Trending Now</h2>
          <div v-if="loading">Loading...</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <div v-for="movie in trending" :key="movie.id" class="cursor-pointer transition hover:scale-105"
              @click="$router.push(`/movie/${movie.id}`)">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" class="rounded-xl" />
              <p class="mt-2 text-sm">{{ movie.title }}</p>
            </div>
          </div>
        </section>

        <!-- Top Rated -->
        <section>
          <h2 class="text-2xl font-bold mb-3">⭐ Top Rated</h2>
          <div v-if="loading">Loading...</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <div v-for="movie in topRated" :key="movie.id" class="cursor-pointer transition hover:scale-105"
              @click="$router.push(`/movie/${movie.id}`)">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" class="rounded-xl" />
              <p class="mt-2 text-sm">{{ movie.title }}</p>
            </div>
          </div>
        </section>

        <!-- Upcoming -->
        <section>
          <h2 class="text-2xl font-bold mb-3">🎬 Coming Soon</h2>
          <div v-if="loading">Loading...</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <div v-for="movie in upcoming" :key="movie.id" class="cursor-pointer transition hover:scale-105"
              @click="$router.push(`/movie/${movie.id}`)">
              <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" class="rounded-xl" />
              <p class="mt-2 text-sm">{{ movie.title }}</p>
            </div>
          </div>
        </section>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useMovies } from "../composables/useMovie";
import HeroSection from "../components/PHome/HeroSection.vue";
// import SubPreview from "../components/PHome/SubPreview.vue";
import BlockSection from "../components/PHome/BlockSection.vue";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);
const { trending, topRated, upcoming, getTrending, getTopRated, getUpcoming, loading } = useMovies()

onMounted(() => {
  getTrending()
  getTopRated()
  getUpcoming()
})

onMounted(() => {
  if (!auth.loaded) {
    auth.syncUser();
  }
});
</script>

<style scoped></style>
