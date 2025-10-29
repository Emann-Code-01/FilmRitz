<!-- src/components/media/MediaModal.vue -->
<template>
  <TransitionRoot :show="modalStore.isModalOpen" as="template">
    <Dialog
      @close="modalStore.closeModal"
      class="relative z-50 transition-all duration-200"
    >
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_bottom,_#000000CC_10%,#000000_50%)]"
        ></div>
        <DialogPanel
          v-if="media"
          class="relative w-full max-w-4xl h-[40em] overflow-hidden rounded-xl text-white shadow-xl"
        >
          <div class="">
            <div
              class="absolute inset-0 bg-black/50 bg-fixed bg-center bg-cover mx-auto bg-no-repeat transition-all duration-300 animate-pulse"
              v-if="loading"
            ></div>
            <div
              v-else
              class="absolute inset-0 bg-fixed bg-center bg-cover mx-auto bg-no-repeat transition-all duration-500 animate-fade-up"
              :style="{
                backgroundImage: `url(${baseUrl + media.backdrop_path})`,
              }"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
            ></div>
          </div>

          <button
            ref="initialFocus"
            @click="modalStore.closeModal"
            class="hover:bg-white/30 absolute top-5 right-5 rounded-full p-1 cursor-pointer transition-all duration-300"
          >
            <svg
              viewBox="0 0 36 36"
              width="36"
              height="36"
              class="transform -rotate-45"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              role="img"
              loading="lazy"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>

          <div class="absolute bottom-0 left-0 z-10 p-6 space-y-3">
            <DialogTitle
              as="h2"
              class="md:text-6xl text-3xl font-[Gilroy-Bold]"
              >{{ media?.title }}</DialogTitle
            >

            <div class="flex items-center gap-4">
              <span
                class="px-2 py-1 bg-green-700 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]"
              >
                {{ media?.vote_average?.toFixed(1) }}
              </span>
              <span class="text-sm font-[Gilroy-Medium]">{{
                new Date(media?.release_date).getFullYear()
              }}</span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genreName in getGenreNames(
                    getGenreIdsFromMedia(media)
                  )"
                  :key="genreName"
                  class="text-sm font-[Gilroy-SemiBold] text-gray-300 bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/40 transition-all duration-200 cursor-pointer"
                >
                  {{ genreName }}
                </span>
              </div>
            </div>

            <DialogDescription
              as="p"
              class="mt-3 max-w-2xl text-xl font-[Gilroy-SemiBold]"
            >
              {{
                expanded ? media?.overview : truncateText(media?.overview, 30)
              }}
            </DialogDescription>

            <div class="pt-3">
              <button
                @click="handleProtectedRoute"
                class="gap-3 bg-[#b20710] text-white flex items-center w-fit text-xl focus:outline-none font-[Gilroy-Bold] md:text-2xl px-8 py-4 md:py-3 rounded-sm hover:bg-[#e32125] group transition-all duration-500 cursor-pointer"
              >
                {{ auth.isLoggedIn ? "Check Out" : "Sign In" }}
                <i
                  class="pi pi-chevron-right text-xl group-hover:animate-pulse"
                ></i>
              </button>
            </div>
          </div>
        </DialogPanel>

        <DialogPanel
          v-else
          class="flex items-center justify-center h-[40em] text-white"
          >Loading details...</DialogPanel
        >
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
} from "@headlessui/vue";
import { ref, watch, computed, onMounted } from "vue";
import { useModalStore } from "../../stores/modalStore";
import { getMediaDetails } from "../../api/tmdb";
import { genreMap } from "../../types/genres";
import { useAuthStore } from "../../stores/auth";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const modalStore = useModalStore();
const loading = ref(false);

const media = ref<any>(null);
const expanded = ref(false);
const baseUrl = "https://image.tmdb.org/t/p/w1280";

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
      .replace(/(^-|-$)+/g, "")
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
    // ✅ Save where the user wanted to go
    localStorage.setItem("redirectAfterLogin", detailRoute.value);

    // ✅ Close the modal and go to login page
    modalStore.closeModal();
    router.push({ path: "/ng/login", query: { redirect: detailRoute.value } });
  } else {
    // ✅ If logged in, just go to the detail page
    modalStore.closeModal();
    router.push(detailRoute.value);
  }
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
      const type = modalStore.mediaType ?? "movie";
      media.value = await getMediaDetails(id, type);
    } catch (error) {
      console.error("Failed to fetch media details:", error);
      media.value = null;
    }
  }
);
</script>
