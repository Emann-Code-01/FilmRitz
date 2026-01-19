<template>
  <div class="cursor-pointer hover:scale-105 transition-transform">
    <!-- Open modal when clicking image -->
    <div
      class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40"
      @click="openModal"
    >
      <img
        loading="lazy"
        :src="
          media.poster_path
            ? `https://image.tmdb.org/t/p/w1280${media.poster_path}`
            : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
        "
        :alt="media.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        @click="openModal"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-black/90 via-transparent opacity-100 group-hover:opacity-100 transition-all"
      ></div>
      <div
        class="absolute bottom-3 left-3 transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-transform duration-500"
      >
        <h3 class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">
          {{ media.title }}
        </h3>
        <p class="text-gray-400 font-[Gilroy-Medium] text-sm flex items-center">
          {{ new Date(media.release_date).getFullYear() }} ·
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
            /></svg
          >{{ media.vote_average?.toFixed(1) }} · {{ media.media_type }}
        </p>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-if="firstGenreName"
            :to="`/ng/genre/${firstGenreName.toLowerCase()}`"
            @click.stop
            class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-200 cursor-pointer"
          >
            {{ firstGenreName }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { genreMap } from "@/types/media";
import type { Media } from "@/types/media";

const props = defineProps<{
  media: Media;
}>();

const modalStore = useModalStore();

function openModal() {
  if (typeof modalStore.open === "function") {
    modalStore.open(props.media.media_type ?? "movie", {
      movieId: props.media.id,
      mediaType: props.media.media_type ?? "movie",
    });
  } else if (typeof (modalStore as any).openMovieModal === "function") {
    (modalStore as any).openMovieModal(props.media.id);
  }
}

// get first genre name if available
const firstGenreName =
  props.media.genre_ids && props.media.genre_ids.length
    ? genreMap[props.media.genre_ids[0]]
    : null;
</script>
