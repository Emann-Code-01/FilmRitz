<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-[1230px] lg:max-w-[1440px] glass-panel overflow-hidden shadow-2xl"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-filmritz-primary backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
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
                class="w-12 h-12 border-4 border-filmritz-primary/20 border-t-filmritz-primary rounded-full animate-spin mb-4"
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
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
              allowfullscreen
              @load="handleIframeLoad"
            ></iframe>
          </div>

          <!-- Trailer Info -->
          <div
            class="p-8 bg-black/80 backdrop-blur-xl border-t border-white/10"
          >
            <div
              class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div class="space-y-3">
                <h2
                  class="text-3xl font-[Gilroy-Bold] text-white tracking-tight"
                >
                  {{ trailer?.title }}
                </h2>
                <div class="flex items-center gap-3">
                  <span class="badge-filmritz">
                    {{ trailer?.type }}
                  </span>
                  <span
                    class="badge-secondary uppercase tracking-widest text-[10px]"
                  >
                    {{ trailer?.mediaType === "movie" ? "Movie" : "TV Show" }}
                  </span>
                </div>
              </div>

              <button @click="viewFullDetails" class="btn-secondary">
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

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    close();
  }
};

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
  { immediate: true },
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
