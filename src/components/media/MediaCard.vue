<template>
  <div class="cursor-pointer hover:scale-105 transition-transform">
    <!-- Open modal when clicking image -->
    <div
      class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40"
      @click="openModal">
      <img loading="lazy" :src="media.poster_path
        ? `https://image.tmdb.org/t/p/w1280${media.poster_path}`
        : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
        " :alt="media.title" class="w-full h-64 object-cover group-hover:scale-105 transition-all duration-300"
        @click="openModal" />
      <div
        class="absolute inset-0 bg-linear-to-t from-black/90 via-transparent opacity-100 group-hover:opacity-100 transition-all">
      </div>
      <div class="absolute bottom-3 left-3">
        <h3 class="text-white font-[Gilroy-SemiBold] text-base line-clamp-1">
          {{ media.title }}
        </h3>
        <p class="text-gray-400 font-[Gilroy-Medium] text-sm">
          {{ new Date(media.release_date).getFullYear() }} · ⭐{{ media.vote_average?.toFixed(1) }} · {{ media.media_type
          }}
        </p>
        <div class="flex flex-wrap gap-2">
          <router-link v-if="firstGenreName" :to="`/ng/genre/${firstGenreName.toLowerCase()}`" @click.stop
            class="inline-block mt-1 text-xs font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-[#b20710]/70 transition-all duration-300">
            {{ firstGenreName }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "../../stores/modalStore";
import { genreMap } from "../../types/genres";
import type { Media } from '../../types/media'

const props = defineProps<{
  media: Media
}>()

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
