<template>
  <div
    class="genre-deep-dive bg-linear-to-br from-black via-gray-900 to-black rounded-2xl overflow-hidden relative"
  >
    <div class="grid grid-cols-12 gap-0 min-h-[600px]">
      <!-- Sidebar -->
      <div
        class="col-span-12 md:block bg-black/40 backdrop-blur-sm space-y-2 p-6 border-r border-white/5 transition-all duration-500 overflow-hidden hidden"
        :class="isCollapsed ? 'md:col-span-1 w-25' : 'md:col-span-3 w-full'"
      >
        <div
          class="flex items-center justify-between mb-4 transition-all duration-500 ease-in-out"
        >
          <h3
            v-if="!isCollapsed"
            class="text-white font-[Gilroy-Bold] text-lg md:text-xl text-nowrap"
          >
            Browse Genres
          </h3>
          <div
            @click="isCollapsed = !isCollapsed"
            class="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-500 text-base md:text-xl lg:flex items-center justify-center w-fit hidden cursor-pointer"
          >
            <svg
              v-if="isCollapsed"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 text-white"
            >
              <path
                fill-rule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clip-rule="evenodd"
              />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 text-white"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div class="space-y-3 hidden md:block">
          <button
            v-for="genre in genres"
            :key="genre.id"
            @click="selectGenre(genre)"
            class="w-full text-left px-4 py-3 rounded-xl font-[Gilroy-SemiBold] transition-all duration-500 flex items-center group cursor-pointer"
            :class="[
              selectedGenre?.id === genre.id
                ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white',
            ]"
          >
            <span
              class="flex items-center gap-3 w-full"
              :class="isCollapsed ? 'justify-center' : ''"
            >
              <span class="text-2xl" :title="isCollapsed ? genre.name : ''">
                {{ genre.icon }}
              </span>
              <span
                v-if="!isCollapsed"
                class="whitespace-nowrap transition-opacity duration-200"
              >
                {{ genre.name }}
              </span>
            </span>

            <svg
              v-if="!isCollapsed"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden lg:block"
              :class="selectedGenre?.id === genre.id && 'opacity-100'"
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <Listbox
        v-model="selectedGenre"
        as="div"
        class="col-span-12 md:hidden bg-black/40 backdrop-blur-sm pl-4 py-6 space-y-2 border-b border-white/5"
      >
        <ListboxButton
          class="text-white font-[Gilroy-Bold] text-xl mb-4 flex items-center gap-3 justify-between w-full cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-3 rounded-tl-xl rounded-bl-xl transition-all duration-500"
        >
          <span class="flex items-center gap-3">
            <span class="text-2xl">{{ selectedGenre?.icon }}</span>
            <span>{{ selectedGenre?.name }}</span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 transition-all duration-500"
          >
            <path
              fill-rule="evenodd"
              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </ListboxButton>

        <ListboxOptions class="space-y-2 mt-2">
          <ListboxOption
            v-for="genre in genres"
            :key="genre.id"
            @click="selectGenre(genre)"
            v-slot="{ active, selected }"
            :value="genre"
            as="template"
          >
            <li
              class="w-full text-left px-4 py-3 rounded-tl-xl rounded-bl-xl font-[Gilroy-SemiBold] transition-all duration-500 flex items-center justify-between group cursor-pointer"
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

      <div
        class="col-span-12 md:col-span-9 p-6 relative transition-all duration-500"
        :class="isCollapsed ? 'md:col-span-11' : 'md:col-span-9'"
      >
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
            class="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-105 hover:z-10"
            @mouseenter="handleHover(item)"
            @click="openModal(item)"
          >
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="w-full h-80 object-cover transition-all duration-500 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"
            ></div>
            <div
              class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform"
                :style="{ backgroundColor: selectedGenre?.color }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 text-white hover:text-[#ffffffec]"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
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
import { ref, onMounted } from "vue";
import {
  Listbox,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
} from "@headlessui/vue";
import { getPosterUrl } from "@/utils/imageHelpers";
import { openMediaModal } from "@/utils/modalHelpers";

const isCollapsed = ref(false);
const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

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

const getImageUrl = (path: string | null): string => getPosterUrl(path);

const formatYear = (date: string): string =>
  date ? new Date(date).getFullYear().toString() : "TBA";

const selectGenre = async (genre: Genre) => {
  selectedGenre.value = genre;
  emit("update-ambient", genre.color);
  await loadGenreItems(genre.id);
};

const loadGenreItems = async (genreId: number) => {
  loading.value = true;
  try {
    const key = import.meta.env.VITE_TMDB_API_KEY;

    const [page1, page2] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
      ),
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=${genreId}&sort_by=popularity.desc&page=2`
      ),
    ]);

    const [data1, data2] = await Promise.all([page1.json(), page2.json()]);
    const allResults = [...(data1.results || []), ...(data2.results || [])];

    genreItems.value = allResults.slice(0, 20);
  } catch (error) {
    console.error("Failed to load genre items:", error);
  } finally {
    loading.value = false;
  }
};

const handleHover = (_item: any) => {
  emit("update-ambient", selectedGenre.value.color);
};

const openModal = (item: any) => {
  openMediaModal(item);
};

onMounted(() => {
  loadGenreItems(selectedGenre.value.id);
  emit("update-ambient", selectedGenre.value.color);
});
</script>
