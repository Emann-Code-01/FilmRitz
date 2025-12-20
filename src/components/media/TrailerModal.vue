<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-5xl bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Video Player -->
          <div class="relative aspect-video bg-black">
            <!-- Loader -->
            <div
              v-if="isLoading"
              class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black"
            >
              <div
                class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"
              ></div>
              <p class="text-white/70 text-sm font-[Gilroy-Medium]">
                Loading trailer...
              </p>
            </div>

            <iframe
              v-if="trailer"
              :src="`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              @load="handleIframeLoad"
            ></iframe>
          </div>

          <!-- Trailer Info -->
          <div class="p-6 bg-linear-to-t from-[#0a0a0a] to-transparent">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-[Gilroy-Bold] text-white mb-2">
                  {{ trailer?.title }}
                </h2>
                <div class="flex items-center gap-3">
                  <span
                    class="px-3 py-1 bg-[#b20710] text-white rounded-lg text-sm font-[Gilroy-SemiBold]"
                  >
                    {{ trailer?.type }}
                  </span>
                  <span class="text-gray-400 text-sm">
                    {{ trailer?.mediaType === "movie" ? "Movie" : "TV Show" }}
                  </span>
                </div>
              </div>

              <button
                @click="viewFullDetails"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] text-white transition-all hover:scale-105 border border-white/10 cursor-pointer"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted, ref } from "vue";

export interface TrailerData {
  id: string;
  title: string;
  type: string;
  backdrop_path: string;
  duration: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  key: string;
  site: string;
  publishedAt?: string;
}

interface Props {
  isOpen: boolean;
  trailer: TrailerData | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  viewDetails: [mediaType: "movie" | "tv", mediaId: number];
}>();

const isLoading = ref(true);

const close = () => {
  emit("close");
};

const viewFullDetails = () => {
  if (props.trailer) {
    emit("viewDetails", props.trailer.mediaType, props.trailer.mediaId);
    close();
  }
};

const handleIframeLoad = () => {
  isLoading.value = false;
};

// Close on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    close();
  }
};

// Reset loader on open or trailer change
watch(
  () => [props.isOpen, props.trailer],
  ([isOpen]) => {
    if (isOpen) {
      isLoading.value = true;
      document.addEventListener("keydown", handleKeydown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
