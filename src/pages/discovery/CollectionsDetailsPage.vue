<template>
  <div class="min-h-screen text-white py-10">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Dynamic Color Gradient -->
      <div
        class="absolute inset-0 blur-3xl opacity-30 transition-all duration-1000"
        :style="{
          background: `radial-gradient(circle at 30% 50%, ${collection?.color}60, transparent 70%)`,
        }"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <!-- Back Button -->
        <router-link
          to="/ng/collections"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-[Gilroy-Medium]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clip-rule="evenodd"
            />
          </svg>
          Back to All Collections
        </router-link>

        <!-- Collection Header -->
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8"
        >
          <div
            class="w-20 md:w-30 aspect-square rounded-full md:flex hidden items-center justify-center text-4xl md:text-7xl shrink-0"
            :style="{
              backgroundColor: `${collection?.color}20`,
              border: `3px solid ${collection?.color}`,
            }"
          >
            {{ collection?.icon }}
          </div>

          <div class="flex-1 md:block hidden">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] mb-3">
              {{ collection?.title }}
            </h1>
            <p class="text-xl text-gray-300 font-[Gilroy-Regular] mb-4">
              {{ collection?.longDescription }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in collection?.tags"
                :key="tag"
                class="px-3 py-1 rounded-full text-sm font-[Gilroy-SemiBold] bg-white/10 text-white"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="grid md:hidden space-y-2">
            <div class="flex items-center gap-4">
              <div
                class="w-20 md:w-30 aspect-square rounded-full flex items-center justify-center text-4xl md:text-7xl shrink-0"
                :style="{
                  backgroundColor: `${collection?.color}20`,
                  border: `3px solid ${collection?.color}`,
                }"
              >
                {{ collection?.icon }}
              </div>
              <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold] mb-3">
                {{ collection?.title }}
              </h1>
            </div>
            <div class="flex-1">
              <p class="text-xl text-gray-300 font-[Gilroy-Regular] mb-4">
                {{ collection?.longDescription }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in collection?.tags"
                  :key="tag"
                  class="px-3 py-1 rounded-full text-sm font-[Gilroy-SemiBold] bg-white/10 text-white"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex gap-6 lg:flex-col">
            <div class="flex items-center justify-center gap-2 text-center">
              <div
                class="text-3xl font-[Gilroy-Bold]"
                :style="{ color: collection?.color }"
              >
                {{ collection?.totalItems || 0 }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div
                class="text-3xl font-[Gilroy-Bold]"
                :style="{ color: collection?.color }"
              >
                {{ currentPage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Collection Switcher -->
        <div class="flex items-center gap-3 overflow-x-auto pb-4">
          <button
            v-for="col in allCollections"
            :key="col.id"
            @click="switchCollection(col.name)"
            class="shrink-0 px-4 py-2 rounded-xl font-[Gilroy-SemiBold] text-sm transition-all duration-500 cursor-pointer"
            :class="
              col.name === collection?.name
                ? 'text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            "
            :style="
              col.name === collection?.name
                ? { backgroundColor: col.color }
                : {}
            "
          >
            <span class="mr-2">{{ col.icon }}</span>
            {{ col.title }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- COLLECTION GRID -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
      <!-- Loading Skeleton -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="n in 20"
          :key="n"
          class="aspect-2/3 bg-gray-800/50 rounded-2xl animate-pulse"
        ></div>
      </div>

      <!-- Items Grid -->
      <div
        v-else-if="collection && pagedItems.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="(item, index) in pagedItems"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 animate-fade-up"
          :style="{ animationDelay: `${index * 30}ms` }"
        >
          <!-- Poster -->
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <!-- Info Overlay -->
          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          >
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>

            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="size-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ item.vote_average?.toFixed(1) }}
              </span>
              <span class="text-gray-300 text-xs">
                {{
                  new Date(
                    item.release_date || item.first_air_date || "",
                  ).getFullYear()
                }}
              </span>
            </div>
          </div>

          <!-- Ranking Badge -->
          <div
            class="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl"
            :style="{ backgroundColor: collection?.color }"
          >
            {{ (currentPage - 1) * perPage + index + 1 }}
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="collection && totalPages > 1" class="mb-12">
        <Pagination
          :model-value="currentPage"
          @update:modelValue="changePage"
          :total-items="totalItems"
          :per-page="perPage"
          :theme-color="collection?.color"
          :max-buttons="7"
          aria-label-prev="Previous page"
          aria-label-next="Next page"
        />
      </div>

      <!-- Error State -->
      <div v-if="!loading && !collection" class="text-center py-20">
        <p class="text-gray-400 text-xl mb-4">Collection not found</p>
        <router-link
          to="/ng/collections"
          class="text-[#b20710] hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5"
          >
            <path
              fill-rule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clip-rule="evenodd"
            />
          </svg>
          Back to All Collections
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import { fetchCollectionByName } from "@/api/tmdb";
import { COLLECTIONS } from "@/types/media";
import type { Collection } from "@/types/media";
import Pagination from "@/components/ui/Pagination.vue";
import { usePagination } from "@/composables/usePagination";

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
import { useHead } from "@unhead/vue";

useHead({
  title: computed(() =>
    collection.value
      ? `${collection.value.title} — Curated Collection | FilmRitz`
      : "Collection Details | FilmRitz",
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        collection.value
          ? collection.value.longDescription
          : "Discover curated movie and TV show collections on FilmRitz.",
      ),
    },
    { name: "robots", content: "index, follow" },
  ],
});

const collection = ref<Collection | null>(null);
const allCollections = COLLECTIONS;

const {
  perPage,
  currentPage,
  loading,
  totalItems,
  totalPages,
  pagedItems,
  changePage,
  reset,
} = usePagination<any>([], {
  perPage: 20,
  mode: "server",

  totalItems: computed(() => collection.value?.totalItems ?? 0),
  fetchItems: async (page, size) => {
    const collectionName = route.params.name as string;
    const result = await fetchCollectionByName(collectionName, page, size);
    collection.value = result;
    return result?.items || [];
  },
  syncWithUrl: true,
  urlParam: "page",
  scrollOnChange: true,
  scrollBehavior: "smooth",
});

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type || "movie",
  });
};

const switchCollection = (collectionName: string) => {
  reset();
  router.push({
    name: "CollectionDetails",
    params: { name: collectionName },
  });
};

watch(
  () => route.params.name,
  async () => {
    currentPage.value = 0;
    await changePage(1, true);
  },
);

onMounted(async () => {
  const initialPage = currentPage.value || 1;
  currentPage.value = 0;
  await changePage(initialPage, true);
});
</script>

<style scoped>
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.5s ease-out forwards;
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
