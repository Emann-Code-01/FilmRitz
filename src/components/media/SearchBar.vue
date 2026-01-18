<!-- src/components/media/SearchBar.vue -->
<template>
  <div class="relative z-40 w-full mx-auto">
    <div
      class="flex items-center gap-3 bg-white/10 backdrop-blur-xl w-md md:w-lg mx-auto px-4 py-3 rounded-full border border-white/10 focus-within:ring-2 ring-red-500/70 transition-all duration-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-6 text-gray-300"
      >
        <path
          fill-rule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
          clip-rule="evenodd"
        />
      </svg>

      <input
        v-model="query"
        placeholder="Search for movies, tv shows, or genres..."
        class="flex-1 bg-transparent outline-none text-white placeholder-gray-400 font-[Gilroy-Medium] text-lg"
        @keydown.enter="goToSearchPage"
      />
      <button
        arial-label="Cancel"
        v-if="query"
        @click="clearSearch"
        class="text-gray-400 hover:text-white flex items-center transition-all duration-200 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="loading"
      class="absolute left-0 right-0 text-center py-4 text-gray-400 animate-pulse"
    >
      Searching...
    </div>
    <div
      v-if="error"
      class="absolute left-0 right-0 text-center py-4 text-red-400"
    >
      {{ error }}
    </div>

    <div
      v-if="searchResults.length > 0 && query"
      class="absolute top-[110%] w-full bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto transition-all duration-500"
    >
      <div
        role="status"
        v-for="item in limitedResults"
        :key="item.id + '-' + item.media_type"
        class="flex items-center gap-4 p-3 hover:bg-white/10 cursor-pointer transition-all duration-200"
        @click="selectMovie(item)"
      >
        <img
          loading="lazy"
          :src="
            item.poster_path
              ? getPoster(item.poster_path)
              : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
          "
          alt="poster"
          class="w-14 h-20 object-cover rounded-lg shadow-md"
        />
        <div class="flex flex-col justify-center">
          <title
            as="h3"
            class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1"
          >
            {{ item.title }}
          </title>
          <p class="text-gray-400 text-sm flex items-center gap-1">
            {{ new Date(item.release_date).getFullYear() }} ·
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4 text-yellow-400"
            >
              <path
                fill-rule="evenodd"
                d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ item.vote_average?.toFixed(1) }} · {{ item.media_type }}
          </p>
          <span as="p" class="flex flex-wrap gap-2">
            <router-link
              v-for="genreName in getGenreNames(getGenreIdsFromMedia(item))"
              :key="genreName"
              :to="`/ng/genre/${genreName.toLowerCase()}`"
              class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-full hover:bg-[#b20710]/70 transition-all duration-200"
              @click.native.stop="onGenreClick"
            >
              {{ genreName }}
            </router-link>
          </span>
        </div>
      </div>

      <div
        v-if="searchResults.length > 7"
        class="text-center py-3 border-t border-white/10"
      >
        <button
          @click="goToSearchPage"
          class="text-red-500 hover:text-red-400 font-[Gilroy-SemiBold] transition-all cursor-pointer"
        >
          View more results
        </button>
      </div>
    </div>

    <div
      v-else-if="!loading && query && searchResults.length === 0"
      class="absolute left-0 right-0 text-center py-4 text-gray-400"
    >
      No results found for "{{ query }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useMedia } from "@/composables/useMedia";
import { genreMap } from "@/types/media";

const { searchMulti, searchResults, loading, error } = useMedia();
const router = useRouter();

const query = ref("");
const emit = defineEmits(["close"]);

let debounceTimer: ReturnType<typeof setTimeout>;

const getPoster = (path: string) =>
  path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : `https://dummyimage.com/300x450/000/fff&text=No+Image`;
const limitedResults = computed(() => searchResults.value.slice(0, 7));

watch(query, (newVal) => {
  clearTimeout(debounceTimer);
  if (!newVal.trim()) {
    searchResults.value = [];
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      loading.value = true;
      await searchMulti(newVal);
    } finally {
      loading.value = false;
    }
  }, 600);
});

function selectMovie(item: any) {
  emit("close");
  const type = item.media_type === "tv" ? "tv" : "movie";
  const slug = encodeURIComponent(
    (item.title || item.name || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  );
  router.push(`/ng/${type}/${slug}-${item.id}`);
  query.value = "";
  searchResults.value = [];
}

function getGenreIdsFromMedia(media: any): number[] {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres))
    return media.genres.map((g: { id: number }) => g.id);
  return [];
}

function getGenreNames(genreIds?: number[]) {
  if (!genreIds || !genreIds.length) return ["Unknown"];
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

function clearSearch() {
  query.value = "";
  searchResults.value = [];
}

function goToSearchPage() {
  const searchTerm = query.value.trim();
  if (!searchTerm) return;

  router.push({
    name: "Search",
    query: { q: searchTerm },
  });

  query.value = "";
  searchResults.value = [];
  emit("close");
}

function onGenreClick(event: Event) {
  event.stopPropagation();
}
</script>
