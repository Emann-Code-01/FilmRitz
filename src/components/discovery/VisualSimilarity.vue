<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiV3 from "@/api/tmdbV3";

const props = defineProps<{
  currentFilmId: number;
  mediaType?: "movie" | "tv";
  loading?: boolean;
}>();

interface SimilarFilm {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
}

const router = useRouter();
const similarFilms = ref<SimilarFilm[]>([]);
const isLoading = ref(false);

const fetchSimilar = async () => {
  if (!props.currentFilmId) return;
  isLoading.value = true;
  try {
    const type = props.mediaType || "movie";
    const res = await apiV3.get(`/${type}/${props.currentFilmId}/similar`, {
      params: { page: 1 },
    });
    similarFilms.value = (res.data.results || [])
      .slice(0, 8)
      .map((f: any) => ({ ...f, media_type: type }));
  } catch (err) {
    console.error("Failed to fetch similar films:", err);
    similarFilms.value = [];
  } finally {
    isLoading.value = false;
  }
};

const navigateToFilm = (film: SimilarFilm) => {
  const title = film.title || film.name || "untitled";
  const slug = encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  );
  const routeName = film.media_type === "tv" ? "TVShowDetails" : "MovieDetails";
  router.push({ name: routeName, params: { name: `${slug}-${film.id}` } });
};

watch(() => props.currentFilmId, fetchSimilar);
onMounted(fetchSimilar);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h3 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="text-lg">✨</span>
          Aesthetic Similarity
        </h3>
        <p class="text-xs text-stone-500 font-medium">
          Films that share a similar visual language and palette
        </p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div
      v-if="isLoading || loading"
      class="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="aspect-2/3 bg-stone-800 rounded-xl animate-pulse"
      ></div>
    </div>

    <!-- No results -->
    <div
      v-else-if="similarFilms.length === 0"
      class="text-center py-8 text-stone-500"
    >
      <div class="text-4xl mb-2">🎬</div>
      <p class="text-sm">No similar titles found</p>
    </div>

    <!-- Film grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="film in similarFilms"
        :key="film.id"
        @click="navigateToFilm(film)"
        class="group relative aspect-2/3 bg-stone-900 rounded-xl overflow-hidden hover:ring-2 ring-indigo-500/50 transition-all cursor-pointer hover:scale-[1.03]"
      >
        <!-- Poster image -->
        <img
          v-if="film.poster_path"
          :src="`https://image.tmdb.org/t/p/w342${film.poster_path}`"
          :alt="film.title || film.name"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <!-- Fallback if no poster -->
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center bg-stone-800 text-stone-600 text-xs font-bold text-center px-2"
        >
          {{ film.title || film.name }}
        </div>

        <!-- Overlay gradient -->
        <div
          class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"
        ></div>

        <!-- Info panel (slides in on hover) -->
        <div
          class="absolute inset-x-0 bottom-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/80 to-transparent"
        >
          <p class="text-[11px] font-bold text-white truncate leading-tight">
            {{ film.title || film.name }}
          </p>
          <div class="flex items-center gap-1 mt-0.5">
            <span class="text-amber-400 text-[9px]">⭐</span>
            <span class="text-[9px] text-stone-300">{{
              film.vote_average?.toFixed(1)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
