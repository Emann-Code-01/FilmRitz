<template>
  <div class="min-h-screen text-white py-10 mt-10 transition-all duration-900">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER WITH COLLECTION THEME -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Dynamic Color Gradient -->
      <div
        class="absolute inset-0 blur-3xl opacity-40 transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 30% 50%, ${collection?.color}60, transparent 70%)`,
        }"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <router-link
          to="/collections"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-medium"
        >
          ← Back to Collections
        </router-link>

        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
            :style="{
              backgroundColor: `${collection?.color}20`,
              border: `3px solid ${collection?.color}`,
            }"
          >
            {{ collection?.icon }}
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-bold">
              {{ collection?.title }}
            </h1>
            <p class="text-xl text-gray-400 font-medium mt-2">
              {{ collection?.items.length }} handpicked titles
            </p>
          </div>
        </div>

        <p class="text-xl text-gray-300 max-w-3xl">
          {{ collection?.description }}
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COLLECTION ITEMS GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-7xl mx-auto">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <!-- Items Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="(item, index) in collection?.items"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 animate-fade-up"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Poster -->
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <!-- Info Overlay -->
          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <h3 class="text-white font-bold text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>

            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
              <span class="text-gray-300 text-xs">
                {{
                  new Date(
                    item.release_date || item.first_air_date || ""
                  ).getFullYear()
                }}
              </span>
            </div>
          </div>

          <!-- Play Icon -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
              :style="{ backgroundColor: collection?.color }"
            >
              <span class="text-3xl text-white ml-1">▶</span>
            </div>
          </div>

          <!-- Ranking Badge -->
          <div
            class="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-xl"
            :style="{ backgroundColor: collection?.color }"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useModalStore } from "@/stores/modalStore";

const route = useRoute();
const modalStore = useModalStore();

interface Collection {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
  genreId: number;
  items: any[];
}

const collection = ref<Collection | null>(null);
const loading = ref(true);

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type || "movie",
  });
};

onMounted(async () => {
  const collectionId = Number(route.params.id);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Collection definitions (should match CuratedCollections.vue)
  const collectionsMap: Record<number, Omit<Collection, "items">> = {
    1: {
      id: 1,
      title: "Epic Sci-Fi",
      icon: "🚀",
      color: "#3B82F6",
      description:
        "Mind-bending journeys through space and time that will leave you questioning reality itself.",
      genreId: 878,
    },
    2: {
      id: 2,
      title: "Tear-Jerkers",
      icon: "😢",
      color: "#EC4899",
      description:
        "Emotional stories that will move you to tears and touch your heart deeply.",
      genreId: 18,
    },
    3: {
      id: 3,
      title: "Mind-Benders",
      icon: "🧠",
      color: "#8B5CF6",
      description:
        "Psychological thrillers that keep you guessing until the very last moment.",
      genreId: 9648,
    },
    4: {
      id: 4,
      title: "Laugh Riots",
      icon: "😂",
      color: "#F59E0B",
      description:
        "Comedy gold that will have you laughing out loud from start to finish.",
      genreId: 35,
    },
    5: {
      id: 5,
      title: "Action Packed",
      icon: "💥",
      color: "#EF4444",
      description:
        "Non-stop thrills and explosive action sequences that will keep you on the edge of your seat.",
      genreId: 28,
    },
    6: {
      id: 6,
      title: "Love Stories",
      icon: "💕",
      color: "#F472B6",
      description:
        "Romantic tales that warm the heart and remind us of the power of love.",
      genreId: 10749,
    },
  };

  const collectionData = collectionsMap[collectionId];

  if (!collectionData) {
    loading.value = false;
    return;
  }

  try {
    // Fetch movies for this collection
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${collectionData.genreId}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`
    );
    const data = await response.json();

    collection.value = {
      ...collectionData,
      items: data.results.slice(0, 20),
    };
  } catch (error) {
    console.error("Failed to load collection:", error);
  } finally {
    loading.value = false;
  }
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
  animation: fade-up 0.5s ease-out forwards;
  opacity: 0;
}
</style>
