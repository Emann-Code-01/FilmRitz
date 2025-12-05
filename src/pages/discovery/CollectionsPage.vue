<template>
  <div class="min-h-screen text-white py-10 mt-10 transition-all duration-900 animate-fade-up">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Ambient Glow -->
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="flex items-center gap-4">
          <div
            class="w-20 h-20 rounded-2xl bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl"
          >
            📚
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Curated Collections
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Handpicked movies and shows for every mood
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COLLECTIONS GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="n in 9"
          :key="n"
          class="h-96 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>
      <!-- Collections Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="collection in collections"
          :key="collection.id"
          :to="`/ng/collection/${collection.id}`"
          class="group relative h-96 rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
        >
          <!-- Background Image (first item poster) -->
          <div class="absolute inset-0">
            <img
              v-if="collection.items[0]?.backdrop_path"
              :src="`https://image.tmdb.org/t/p/w780${collection.items[0].backdrop_path}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/20"
            ></div>
          </div>

          <!-- Content -->
          <div class="relative h-full flex flex-col justify-end p-6">
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                :style="{
                  backgroundColor: `${collection.color}20`,
                  border: `2px solid ${collection.color}`,
                }"
              >
                {{ collection.icon }}
              </div>
              <div>
                <h3 class="text-2xl font-[Gilroy-Bold]">
                  {{ collection.title }}
                </h3>
                <p class="text-sm text-gray-400 font-[Gilroy-Medium]">
                  {{ collection.items.length }} titles
                </p>
              </div>
            </div>

            <p class="text-gray-300 font-[Gilroy-Regular] line-clamp-2 mb-4">
              {{ collection.description }}
            </p>

            <!-- Preview Thumbnails -->
            <div class="flex gap-2">
              <div
                v-for="item in collection.items.slice(0, 4)"
                :key="item.id"
                class="w-16 h-24 rounded-lg overflow-hidden border-2 border-white/20"
              >
                <img
                  :src="`https://image.tmdb.org/t/p/w185${item.poster_path}`"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-if="collection.items.length > 4"
                class="w-16 h-24 rounded-lg bg-white/10 flex items-center justify-center font-[Gilroy-Bold]"
              >
                +{{ collection.items.length - 4 }}
              </div>
            </div>
          </div>

          <!-- Explore Button (on hover) -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
          >
            <div
              class="px-6 py-3 bg-[#b20710] rounded-xl font-[Gilroy-Bold] transform scale-75 group-hover:scale-100 transition-transform"
            >
              Explore Collection →
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Collection {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
  items: any[];
}

const collections = ref<Collection[]>([]);
const loading = ref(true);

onMounted(async () => {
  // Simulate loading - replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  collections.value = [
    {
      id: 1,
      title: "Epic Sci-Fi",
      icon: "🚀",
      color: "#3B82F6",
      description: "Mind-bending journeys through space and time",
      items: [], // Populate from API
    },
    {
      id: 2,
      title: "Tear-Jerkers",
      icon: "😢",
      color: "#8B5CF6",
      description: "Emotional stories that will move you",
      items: [],
    },
    {
      id: 3,
      title: "Mind-Benders",
      icon: "🧠",
      color: "#EC4899",
      description: "Psychological thrillers that keep you guessing",
      items: [],
    },
    // Add more collections
  ];

  loading.value = false;
});
</script>
