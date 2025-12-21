<template>
  <section class="relative px-6 py-8">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="h-80 bg-gray-800/50 rounded-2xl animate-pulse"
      ></div>
    </div>

    <!-- Collections Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="relative group cursor-pointer"
        @mouseenter="handleHover(collection)"
        @click="toggleCollection(collection)"
      >
        <!-- Stack Container -->
        <div class="relative h-80 perspective-1000">
          <!-- Stacked Cards (3D depth effect) -->
          <div
            v-for="(item, index) in collection.items.slice(0, 3)"
            :key="item.id"
            class="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
            :style="{
              transform:
                expandedCollection?.id === collection.id
                  ? `translateX(${
                      index * 100
                    }px) translateY(0) rotateY(0deg) scale(1)`
                  : `translateX(${index * 8}px) translateY(${
                      index * 8
                    }px) rotateY(${index * -5}deg) scale(${1 - index * 0.05})`,
              zIndex: 3 - index,
              opacity:
                expandedCollection?.id === collection.id ? 1 : 1 - index * 0.2,
            }"
          >
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="w-full h-full object-cover"
            />

            <!-- linear Overlay -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"
            ></div>
          </div>

          <!-- Collection Info Overlay -->
          <div
            class="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none transition-all duration-500"
            :class="
              expandedCollection?.id === collection.id
                ? 'opacity-0'
                : 'opacity-100'
            "
          >
            <div
              class="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">{{ collection.icon }}</span>
                <h3 class="text-2xl font-bold text-white">
                  {{ collection.title }}
                </h3>
              </div>
              <p class="text-gray-300 text-sm line-clamp-2">
                {{ collection.description }}
              </p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-xs font-semibold text-gray-400">
                  {{ collection.items.length }} titles
                </span>
                <span class="text-xs text-[#b20710]">→</span>
              </div>
            </div>
          </div>

          <!-- Info Button (on hover) -->
          <div
            class="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300"
            :class="expandedCollection?.id === collection.id && 'hidden'"
          >
            <div
              class="w-20 h-20 rounded-full bg-[#b20710] flex items-center justify-center shadow-2xl transform group-hover:scale-100 scale-75 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Parallax Shadow Effect -->
          <div
            class="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none"
            :style="{
              boxShadow:
                expandedCollection?.id === collection.id
                  ? 'none'
                  : '0 20px 60px -10px rgba(178, 7, 16, 0.4)',
            }"
          ></div>
        </div>

        <!-- Expanded View (shows all items) -->
        <div
          v-if="expandedCollection?.id === collection.id"
          class="absolute inset-0 z-30 bg-black/95 backdrop-blur-xl rounded-2xl p-6 overflow-y-auto max-h-[500px]"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-white flex items-center gap-2">
              <span class="text-3xl">{{ collection.icon }}</span>
              {{ collection.title }}
            </h3>
            <button
              @click.stop="expandedCollection = null"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="item in collection.items"
              :key="item.id"
              class="relative group/item cursor-pointer rounded-xl overflow-hidden"
              @click="openModal(item)"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.title || item.name"
                class="w-full h-60 object-cover"
              />
              <div
                class="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black to-transparent"
              >
                <p class="text-white text-sm font-semibold line-clamp-1">
                  {{ item.title || item.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const modalStore = useModalStore();

interface Collection {
  id: number;
  title: string;
  icon: string;
  description: string;
  items: any[];
  color: string;
}

const collections = ref<Collection[]>([]);
const expandedCollection = ref<Collection | null>(null);
const loading = ref(true);

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : "https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE";
};

const handleHover = (collection: Collection) => {
  emit("update-ambient", collection.color);
};

const toggleCollection = (collection: Collection) => {
  expandedCollection.value =
    expandedCollection.value?.id === collection.id ? null : collection;
};

const openModal = (item: any) => {
  modalStore.open("movie", {
    movieId: item.id,
    mediaType: item.media_type || "movie",
  });
};

onMounted(async () => {
  try {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    // Define collections with their genre IDs and colors
    const collectionsData = [
      {
        id: 1,
        title: "Epic Sci-Fi",
        icon: "🚀",
        description: "Mind-bending journeys through space and time",
        genreId: 878,
        color: "#3B82F6",
      },
      {
        id: 2,
        title: "Tear-Jerkers",
        icon: "😢",
        description: "Emotional stories that will move you",
        genreId: 18,
        color: "#EC4899",
      },
      {
        id: 3,
        title: "Mind-Benders",
        icon: "🧠",
        description: "Psychological thrillers that keep you guessing",
        genreId: 9648,
        color: "#8B5CF6",
      },
      {
        id: 4,
        title: "Laugh Riots",
        icon: "😂",
        description: "Comedy gold for your viewing pleasure",
        genreId: 35,
        color: "#F59E0B",
      },
      {
        id: 5,
        title: "Action Packed",
        icon: "💥",
        description: "Non-stop thrills and explosive action",
        genreId: 28,
        color: "#EF4444",
      },
      {
        id: 6,
        title: "Love Stories",
        icon: "💕",
        description: "Romantic tales that warm the heart",
        genreId: 10749,
        color: "#F472B6",
      },
    ];

    const collectionPromises = collectionsData.map(async (col) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${col.genreId}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`
      );
      const data = await response.json();
      return {
        ...col,
        items: data.results.slice(0, 12),
      };
    });

    collections.value = await Promise.all(collectionPromises);
  } catch (error) {
    console.error("Failed to load collections:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
