<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-[1230px] lg:max-w-[1440px] mx-auto">
        <div class="md:flex items-center gap-4 hidden">
          <div class="flex-1">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              New Releases
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Latest movies and shows
            </p>
          </div>

          <div class="flex gap-6">
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.totalItems.value }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div class="text-3xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.currentPage.value }}
              </div>
            </div>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              New Releases
            </h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            Latest movies and shows
          </p>

          <div class="flex gap-6">
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-2xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.totalItems.value }}+
              </div>
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">
                Items
              </div>
            </div>
            <div class="text-center flex items-center justify-center gap-2">
              <div class="text-sm text-gray-400 font-[Gilroy-Medium]">Page</div>
              <div class="text-2xl font-[Gilroy-Bold] text-[#b20710]">
                {{ pagination.currentPage.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 mx-auto mt-8 max-w-[1230px] lg:max-w-[1440px]">
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

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="(item, index) in pagination.pagedItems.value"
          :key="item.id"
          @click="openModal(item)"
          class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105 animate-fade-up"
          :style="{ animationDelay: `${index * 30}ms` }"
        >
          <div class="aspect-2/3 overflow-hidden">
            <img
              :src="getImageUrl(item.poster_path)"
              :alt="item.title || item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
          </div>

          <div
            class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          >
            <h3 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
              {{ item.title || item.name }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-xs flex items-center gap-1"
                ><svg
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
                {{ item.vote_average?.toFixed(1) }}</span
              >
              <span class="text-gray-300 text-xs">
                {{ formatDate(item.release_date || item.first_air_date) }}
              </span>
            </div>
          </div>

          <div
            class="absolute top-3 left-3 px-3 py-1 bg-[#b20710] rounded-lg font-[Gilroy-Bold] text-xs shadow-xl"
          >
            NEW
          </div>

          <div
            class="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-gray-300 text-xs font-[Gilroy-Bold]"
          >
            {{ formatDate(item.release_date || item.first_air_date) }}
          </div>
        </div>
      </div>

      <Pagination
        :model-value="pagination.currentPage.value"
        @update:model-value="pagination.changePage"
        :total-items="pagination.totalItems.value"
        :total-pages="pagination.totalPages.value"
        :per-page="pagination.perPage.value"
        :start-index="pagination.startIndex.value"
        :end-index="pagination.endIndex.value"
        show-info
        show-ellipsis
        show-labels
        :max-buttons="7"
        theme-color="#b20710"
      />
    </div>
  </div>
  <AdSlot />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useModalStore } from "@/stores/modalStore";
import { fetchUpcomingMovies, fetchOnTheAir } from "@/api/tmdb";
import AdSlot from "@/components/ads/AdSlot.vue";
import { usePagination } from "@/composables/usePagination";
import Pagination from "@/components/ui/Pagination.vue";

const modalStore = useModalStore();

const selectedPeriod = ref("week");
const releases = ref<any[]>([]);
const loading = ref(true);

const pagination = usePagination(releases, {
  perPage: 20,
  scrollBehavior: "smooth",
});

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
};

const formatDate = (date: string): string => {
  if (!date) return "TBA";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type,
  });
};

const loadReleases = async () => {
  loading.value = true;
  try {
    // Fetch 3 pages of each to get 60+ items per type
    const [movies, shows] = await Promise.all([
      fetchUpcomingMovies(3),
      fetchOnTheAir(3),
    ]);

    const combined = [
      ...movies.map((m: any) => ({ ...m, media_type: "movie" })),
      ...shows.map((s: any) => ({ ...s, media_type: "tv" })),
    ];
    releases.value = combined.sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date || 0).getTime() -
        new Date(a.release_date || a.first_air_date || 0).getTime(),
    );
  } catch (error) {
    console.error("Failed to load releases:", error);
  } finally {
    loading.value = false;
  }
};

watch(selectedPeriod, loadReleases);
onMounted(loadReleases);
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
