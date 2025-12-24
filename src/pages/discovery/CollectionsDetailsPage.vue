<template>
  <div class="min-h-screen text-white py-10 mt-10">
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

      <div class="relative z-10 max-w-7xl mx-auto">
        <!-- Back Button -->
        <router-link
          to="/ng/collections"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-[Gilroy-Medium]"
        >
          ← Back to All Collections
        </router-link>

        <!-- Collection Header -->
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8"
        >
          <div
            class="w-20 md:w-30 aspect-square rounded-2xl flex items-center justify-center text-4xl md:text-7xl shrink-0"
            :style="{
              backgroundColor: `${collection?.color}20`,
              border: `3px solid ${collection?.color}`,
            }"
          >
            {{ collection?.icon }}
          </div>

          <div class="flex-1">
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
                Movies
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
        <div
          class="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide"
        >
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
    <div class="px-6 md:px-10 max-w-7xl mx-auto">
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
        v-else-if="collection && collection.items.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
      >
        <div
          v-for="(item, index) in collection.items"
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
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
              <span class="text-yellow-400 text-xs">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
              <span class="text-gray-300 text-xs">
                {{
                  new Date(
                    item.release_date || item.first_air_date || ""
                  ).getFullYear()
                }}
              </span>
            </div>
          </div>

          <!-- Play Icon -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
              :style="{ backgroundColor: collection?.color }"
            >
              <span class="text-3xl text-white ml-1">▶</span>
            </div>
          </div>

          <!-- Ranking Badge -->
          <div
            class="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-[Gilroy-Bold] text-white shadow-xl"
            :style="{ backgroundColor: collection?.color }"
          >
            {{ (currentPage - 1) * 20 + index + 1 }}
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="collection && totalPages > 1"
        class="flex items-center justify-center gap-4 mb-12"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-6 py-3 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        <div class="flex items-center gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            class="w-12 h-12 rounded-xl font-[Gilroy-Bold] text-white transition-all"
            :class="page === currentPage ? '' : 'bg-white/10 hover:bg-white/20'"
            :style="
              page === currentPage ? { backgroundColor: collection?.color } : {}
            "
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-6 py-3 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>

      <!-- Error State -->
      <div v-if="!loading && !collection" class="text-center py-20">
        <p class="text-gray-400 text-xl mb-4">Collection not found</p>
        <router-link
          to="/ng/collections"
          class="text-[#b20710] hover:underline"
        >
          ← Back to All Collections
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

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();

const collection = ref<Collection | null>(null);
const loading = ref(true);
const currentPage = ref(1);
const allCollections = COLLECTIONS;

const totalPages = computed(() => {
  if (!collection.value?.totalItems) return 0;
  return Math.ceil(collection.value.totalItems / 20);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1); // Ellipsis
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push(-1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push(-1);
      pages.push(total);
    }
  }

  return pages;
});

const openModal = (item: any) => {
  modalStore.open(item.media_type || "movie", {
    movieId: item.id,
    mediaType: item.media_type || "movie",
  });
};

const loadCollection = async () => {
  loading.value = true;
  const collectionName = route.params.name as string;

  try {
    collection.value = await fetchCollectionByName(
      collectionName,
      currentPage.value,
      20
    );
  } catch (error) {
    console.error("Failed to load collection:", error);
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
  loadCollection();
};

const switchCollection = (collectionName: string) => {
  currentPage.value = 1;
  router.push({
    name: "CollectionDetails",
    params: { name: collectionName },
  });
};

watch(
  () => route.params.name,
  () => {
    currentPage.value = 1;
    loadCollection();
  }
);

onMounted(() => {
  loadCollection();
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
