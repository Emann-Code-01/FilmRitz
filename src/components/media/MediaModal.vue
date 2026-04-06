<template>
  <div v-if="loading">
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_bottom,#000000CC_10%,#000000_50%)]"
      ></div>
      <div
        class="relative w-full max-w-[1230px] lg:max-w-[1440px] h-[40em] overflow-hidden rounded-xl text-white shadow-xl animate-pulse"
      >
        <div
          class="absolute inset-0 bg-white/10 bg-fixed bg-center bg-cover mx-auto bg-no-repeat transition-all duration-500 animate-pulse"
        ></div>
        <div
          class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"
        ></div>
      </div>

      <div
        class="absolute bottom-0 left-0 z-10 p-6 space-y-3 w-full max-w-[1230px] lg:max-w-[1440px]"
      >
        <div class="h-8 w-1/3 bg-white/10 rounded-md animate-pulse"></div>
        <div class="flex items-center gap-4">
          <div class="h-6 w-10 bg-white/10 rounded-md animate-pulse"></div>
          <div class="h-6 w-16 bg-white/10 rounded-md animate-pulse"></div>
          <div class="flex gap-2">
            <div class="h-5 w-12 bg-white/10 rounded-md animate-pulse"></div>
            <div class="h-5 w-14 bg-white/10 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div class="h-20 w-2/3 bg-white/10 rounded-md animate-pulse"></div>
        <div class="h-12 w-32 bg-white/10 rounded-md animate-pulse mt-4"></div>
      </div>
    </div>
  </div>

  <TransitionRoot :show="modalStore.isModalOpen" as="template">
    <Dialog
      @close="modalStore.closeModal"
      class="relative z-50"
      :initialFocus="initialFocus"
    >
      <div class="fixed inset-0 overflow-y-auto">
        <DialogOverlay class="fixed inset-0 bg-black/80" />
        <div class="flex items-center justify-center min-h-screen p-4">
          <button ref="initialFocus" class="sr-only" />

          <DialogPanel
            v-if="media"
            class="relative w-full max-w-[1230px] lg:max-w-[1440px] overflow-hidden text-white shadow-2xl bg-black/90"
          >
            <div v-if="loading" class="animate-pulse">
              <div class="h-[70vh] bg-white/5 rounded-t-3xl"></div>
              <div class="p-6 space-y-3 bg-white/5 rounded-b-3xl">
                <div class="h-10 bg-white/10 w-3/4 rounded-lg"></div>
                <div class="h-6 bg-white/10 w-1/2 rounded-lg"></div>
                <div class="h-20 bg-white/10 w-full rounded-lg"></div>
              </div>
            </div>

            <div v-else class="overflow-y-auto h-[90vh]">
              <div
                class="relative h-[70vh] bg-cover bg-center"
                :style="{
                  backgroundImage: media.backdrop_path
                    ? `url(${baseUrl + media.backdrop_path})`
                    : 'url(https://placehold.co/1280x720/0f0f0f/FF0000?text=FILMRITZ)',
                }"
              >
                <div
                  class="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"
                ></div>
                <button
                  @click="modalStore.closeModal"
                  class="absolute top-6 right-6 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-filmritz-primary transition-all duration-300"
                >
                  <svg
                    viewBox="0 0 36 36"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path
                      d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
                      class="transform rotate-45 origin-center"
                    />
                  </svg>
                </button>
              </div>

              <div class="relative -mt-12 p-8">
                <DialogTitle
                  as="h2"
                  class="md:text-6xl text-3xl font-[Gilroy-Bold] tracking-tight"
                >
                  {{ media?.title }}
                </DialogTitle>

                <div class="flex items-center gap-4 mt-4 flex-wrap">
                  <span class="badge-filmritz py-1.5 px-4 text-sm">
                    <i class="pi pi-star-fill text-yellow-400 text-[10px]"></i>
                    {{ media?.vote_average?.toFixed(1) }}
                  </span>
                  <span
                    class="badge-secondary py-1.5 px-4 text-sm uppercase tracking-wider"
                  >
                    {{ media.media_type }}
                  </span>
                  <span class="text-sm font-[Gilroy-Medium] text-white/60">
                    {{
                      new Date(
                        media?.release_date || media?.first_air_date,
                      ).getFullYear()
                    }}
                  </span>
                  <div class="flex gap-2 flex-wrap">
                    <span
                      v-for="genreName in getGenreNames(
                        getGenreIdsFromMedia(media),
                      )"
                      :key="genreName"
                      @click="goToGenre(genreName)"
                      class="badge-secondary hover:bg-filmritz-primary hover:border-filmritz-primary transition-all duration-300 cursor-pointer"
                    >
                      {{ genreName }}
                    </span>
                  </div>
                </div>

                <DialogDescription
                  class="mt-6 max-w-3xl text-lg text-white/80 font-[Gilroy-Medium] leading-relaxed"
                >
                  {{
                    expanded
                      ? media?.overview
                      : truncateText(media?.overview, 40)
                  }}
                </DialogDescription>

                <div class="pt-8">
                  <button
                    @click="handleProtectedRoute"
                    class="btn-filmritz group"
                  >
                    <span>{{
                      auth.isLoggedIn ? "View Full Details" : "Sign In to Watch"
                    }}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="size-5 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>

          <DialogPanel
            v-else
            class="flex flex-col justify-start h-[40em] w-full max-w-[1230px] lg:max-w-[1440px] rounded-xl bg-black/40 text-white p-8 space-y-6 animate-pulse"
          >
            <div class="h-64 w-full bg-white/10 rounded-xl"></div>
            <div class="h-6 w-1/3 bg-white/10 rounded-md"></div>
            <div class="h-4 w-2/3 bg-white/10 rounded-md"></div>
            <div class="h-4 w-1/2 bg-white/10 rounded-md"></div>
            <div class="h-10 w-32 bg-white/10 rounded-md"></div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  DialogOverlay,
} from "@headlessui/vue";
import { ref, watch, computed, onMounted } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { getMediaDetails } from "../../api/tmdb";
import { genreMap } from "@/types/media";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();
const modalStore = useModalStore();
const loading = ref(false);
const media = ref<any>(null);
const expanded = ref(false);
const baseUrl = "https://image.tmdb.org/t/p/w1280";

const initialFocus = ref<HTMLElement | null>(null);

function truncateText(text: string, limit = 30) {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

function slugify(str: string | undefined) {
  if (!str) return "untitled";
  return encodeURIComponent(
    String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  );
}

const detailRoute = computed(() => {
  if (!media.value) return "/";
  const title = media.value.title ?? media.value.name ?? "untitled";
  const slug = `${slugify(title)}-${media.value.id}`;
  return media.value.media_type === "tv"
    ? `/ng/tv/${slug}`
    : `/ng/movie/${slug}`;
});

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

function handleProtectedRoute() {
  if (!auth.isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", detailRoute.value);
    modalStore.closeModal();
    router.push({ path: "/ng/login", query: { redirect: detailRoute.value } });
  } else {
    modalStore.closeModal();
    router.push(detailRoute.value);
  }
}

function goToGenre(genreName: string) {
  modalStore.closeModal();
  router.push(`/ng/genre/${genreName.toLowerCase()}`);
}

onMounted(async () => {
  if (!auth.loaded) await auth.syncUser();
});

watch(
  () => modalStore.itemId,
  async (id) => {
    if (!id) {
      media.value = null;
      return;
    }
    try {
      loading.value = true;
      const type = modalStore.mediaType ?? "movie";
      media.value = await getMediaDetails(id, type);
    } catch (error) {
      console.error("Failed to fetch media details:", error);
      media.value = null;
    } finally {
      loading.value = false;
    }
  },
);
</script>
