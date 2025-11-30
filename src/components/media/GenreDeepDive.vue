<template>
  <div
    class="genre-deep-dive bg-linear-to-br from-black via-gray-900 to-black rounded-2xl overflow-hidden border border-white/5"
  >
    <div class="grid grid-cols-12 gap-0 min-h-[600px]">
      <div
        class="col-span-12 md:col-span-3 bg-black/40 backdrop-blur-sm p-6 space-y-2 border-r border-white/5 hidden md:block"
      >
        <h3 class="text-white font-[Gilroy-Bold] text-xl mb-4">
          Browse Genres
        </h3>

        <button
          v-for="genre in genres"
          :key="genre.id"
          @click="selectGenre(genre)"
          class="w-full text-left px-4 py-3 rounded-xl font-[Gilroy-SemiBold] transition-all duration-300 flex items-center justify-between group cursor-pointer"
          :class="
            selectedGenre?.id === genre.id
              ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          "
        >
          <span class="flex items-center gap-3">
            <span class="text-2xl">{{ genre.icon }}</span>
            <span>{{ genre.name }}</span>
          </span>
          <i
            class="pi pi-chevron-right opacity-0 group-hover:opacity-100 transition-opacity"
            :class="selectedGenre?.id === genre.id && 'opacity-100'"
          ></i>
        </button>
      </div>
      <Listbox
        v-model="selectedGenre"
        as="div"
        class="col-span-12 md:col-span-3 bg-black/40 backdrop-blur-sm p-6 space-y-2 border-r border-white/5 md:hidden"
      >
        <ListboxButton
          class="text-white font-[Gilroy-Bold] text-xl mb-4 flex items-center gap-3 justify-between w-full cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300"
        >
          <span class="flex items-center gap-3">
            <span class="text-2xl">{{ selectedGenre?.icon }}</span>
            <span>{{ selectedGenre?.name }}</span>
          </span>
          <i class="pi pi-chevron-down transition-all duration-300"></i>
        </ListboxButton>

        <ListboxOptions class="space-y-2 mt-2">
          <ListboxOption
            v-for="genre in genres"
            :key="genre.id"
            v-slot="{ active, selected }"
            :value="genre"
            as="template"
          >
            <li
              class="w-full text-left px-4 py-3 rounded-xl font-[Gilroy-SemiBold] transition-all duration-300 flex items-center justify-between group cursor-pointer"
              :class="[
                selected || active
                  ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white',
              ]"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ genre.icon }}</span>
                <span>{{ genre.name }}</span>
              </div>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
      <div class="col-span-12 md:col-span-9 p-6 relative">
        <div
          class="mb-6 p-4 rounded-xl backdrop-blur-sm transition-all duration-500"
          :style="{
            background: `linear-linear(135deg, ${selectedGenre?.color}20, transparent)`,
            borderLeft: `4px solid ${selectedGenre?.color}`,
          }"
        >
          <h2
            class="text-3xl font-[Gilroy-Bold] text-white flex items-center gap-3"
          >
            <span class="text-4xl">{{ selectedGenre?.icon }}</span>
            {{ selectedGenre?.name }}
          </h2>
          <p class="text-gray-400 font-[Gilroy-Regular] mt-2">
            {{ selectedGenre?.description }}
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="h-64 bg-gray-800/50 rounded-xl animate-pulse"
          ></div>
        </div>

        <!-- Items Grid -->
        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="item in genreItems"
            :key="item.id"
            class="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:z-10"
            @mouseenter="handleHover(item)"
            @click="openModal(item)"
          >
            <!-- Poster -->
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <!-- linear Overlay -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"
            ></div>

            <!-- Play Overlay (on hover) -->
            <div
              class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div
                class="w-16 h-16 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform"
                :style="{ backgroundColor: selectedGenre?.color }"
              >
                <i
                  class="pi pi-info-circle text-5xl text-white hover:text-[#ffffffec]"
                ></i>
              </div>
            </div>

            <!-- Info -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h4
                class="text-white font-[Gilroy-Bold] text-sm line-clamp-1 mb-1"
              >
                {{ item.title || item.name }}
              </h4>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-yellow-400"
                  >⭐ {{ item.vote_average?.toFixed(1) }}</span
                >
                <span class="text-gray-300">{{
                  formatYear(item.release_date || item.first_air_date)
                }}</span>
              </div>
            </div>

            <!-- Genre Color Border -->
            <div
              class="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"
              :style="{ borderColor: selectedGenre?.color }"
            ></div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && genreItems.length === 0"
          class="text-center py-20"
        >
          <p class="text-gray-400 font-[Gilroy-Medium]">
            No items found in this genre
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  Listbox,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
} from "@headlessui/vue";
import { useModalStore } from "../../stores/modalStore";

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const modalStore = useModalStore();

interface Genre {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const genres = ref<Genre[]>([
  {
    id: 28,
    name: "Action",
    icon: "💥",
    color: "#FF4500",
    description: "High-octane thrills and explosive adventures",
  },
  {
    id: 35,
    name: "Comedy",
    icon: "😂",
    color: "#FFD700",
    description: "Laugh-out-loud moments and feel-good stories",
  },
  {
    id: 27,
    name: "Horror",
    icon: "👻",
    color: "#DC2626",
    description: "Spine-chilling scares and supernatural terror",
  },
  {
    id: 878,
    name: "Sci-Fi",
    icon: "🚀",
    color: "#3B82F6",
    description: "Futuristic worlds and mind-bending concepts",
  },
  {
    id: 10749,
    name: "Romance",
    icon: "💕",
    color: "#EC4899",
    description: "Heartwarming love stories and connections",
  },
  {
    id: 18,
    name: "Drama",
    icon: "🎭",
    color: "#8B5CF6",
    description: "Powerful performances and emotional depth",
  },
  {
    id: 12,
    name: "Adventure",
    icon: "🗺️",
    color: "#10B981",
    description: "Epic journeys and daring quests",
  },
  {
    id: 16,
    name: "Animation",
    icon: "🎨",
    color: "#F59E0B",
    description: "Animated wonders for all ages",
  },
]);

const selectedGenre = ref<Genre>(genres.value[0]);
const genreItems = ref<any[]>([]);
const loading = ref(false);

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
};

const formatYear = (date: string): string => {
  return date ? new Date(date).getFullYear().toString() : "TBA";
};

const selectGenre = async (genre: Genre) => {
  selectedGenre.value = genre;
  emit("update-ambient", genre.color);
  await loadGenreItems(genre.id);
};

const loadGenreItems = async (genreId: number) => {
  loading.value = true;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    );
    const data = await response.json();
    genreItems.value = data.results.slice(0, 12);
  } catch (error) {
    console.error("Failed to load genre items:", error);
  } finally {
    loading.value = false;
  }
};

const handleHover = (item: any) => {
  emit("update-ambient", selectedGenre.value.color);
};

const openModal = (item: any) => {
  modalStore.open("movie", { movieId: item.id, mediaType: "movie" });
};

onMounted(() => {
  loadGenreItems(selectedGenre.value.id);
  emit("update-ambient", selectedGenre.value.color);
});
</script>
