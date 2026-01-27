<template>
  <div
    class="cursor-pointer hover:scale-105 transition-transform duration-300"
    @mouseenter="handleMouseEnter"
  >
    <!-- Card Container -->
    <div
      class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/40"
      @click="openModal"
    >
      <button
        v-if="showRemove"
        @click.stop="$emit('remove')"
        class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all z-20 group/remove"
        title="Remove from list"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-5 transition-transform group-hover/remove:scale-110"
        >
          <path
            fill-rule="evenodd"
            d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Rank Badge -->
      <div
        v-if="rank"
        class="absolute top-3 left-3 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#b20710] flex items-center justify-center font-bold text-white shadow-xl text-sm md:text-base"
      >
        #{{ rank }}
      </div>

      <!-- Poster -->
      <img
        loading="lazy"
        :src="
          media.poster_path
            ? `https://image.tmdb.org/t/p/w1280${media.poster_path}`
            : 'https://placehold.co/300x450/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat'
        "
        :alt="media.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
      />

      <!-- Overlay (Dynamic intelligence shows on hover or always) -->
      <div
        class="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4 transition-all duration-500"
        :class="
          flagsStore.flags.trustWeightedRatings
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100'
        "
      >
        <!-- Trust Rating (Top Right) -->
        <div
          v-if="flagsStore.flags.trustWeightedRatings && media.intelligence"
          class="absolute top-3 right-3 shadow-2xl"
        >
          <TrustRating
            :rating="media.vote_average"
            :trust="media.intelligence.trustRating"
          />
        </div>

        <!-- Info Area -->
        <div class="space-y-2">
          <h3 class="text-white font-bold text-lg leading-tight line-clamp-2">
            {{ media.title }}
          </h3>

          <!-- Details Row -->
          <div class="flex items-center gap-2 text-xs text-white/60">
            <span>{{
              media.release_date
                ? new Date(media.release_date).getFullYear()
                : "TBA"
            }}</span>
            <span>·</span>
            <span class="uppercase tracking-widest font-bold text-[10px]">{{
              media.media_type
            }}</span>
            <span
              v-if="media.intelligence?.context.commitment"
              class="flex items-center gap-1"
            >
              <span>·</span>
              {{ media.intelligence.context.commitment.label }}
            </span>
          </div>

          <!-- Intelligence Chips -->
          <IntelligenceChips
            v-if="flagsStore.flags.toneMoodChips && media.intelligence"
            :context="media.intelligence.context"
          />

          <!-- Genre Link -->
          <div class="pt-1">
            <router-link
              v-if="firstGenreName"
              :to="`/ng/genre/${firstGenreName.toLowerCase()}`"
              @click.stop
              class="inline-block text-[10px] font-bold uppercase tracking-wider text-white/40 border border-white/10 px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-all"
            >
              {{ firstGenreName }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { useFeatureFlagsStore } from "@/stores/featureFlags";
import { useRouteCacheStore } from "@/stores/routeCache";
import { genreMap } from "@/types/media";
import type { Media } from "@/types/media";
import TrustRating from "@/components/intelligence/TrustRating.vue";
import IntelligenceChips from "@/components/intelligence/IntelligenceChips.vue";

const props = defineProps<{
  media: Media;
  rank?: number;
  showRemove?: boolean;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
}>();

const modalStore = useModalStore();
const flagsStore = useFeatureFlagsStore();
const routeCacheStore = useRouteCacheStore();

function openModal() {
  const mediaType = props.media.media_type ?? "movie";
  if (typeof modalStore.open === "function") {
    modalStore.open(mediaType, {
      movieId: props.media.id,
      mediaType: mediaType,
    });
  } else if (typeof (modalStore as any).openMovieModal === "function") {
    (modalStore as any).openMovieModal(props.media.id);
  }
}

/**
 * Handle mouse enter to trigger intelligent prefetching
 */
function handleMouseEnter() {
  if (flagsStore.flags.routeCaching) {
    const routeName =
      props.media.media_type === "movie" ? "MovieDetails" : "TVShowDetails";
    routeCacheStore.prefetchData(routeName, { id: props.media.id });
  }
}

// get first genre name if available
const firstGenreName =
  props.media.genre_ids && props.media.genre_ids.length
    ? genreMap[props.media.genre_ids[0]]
    : null;
</script>
