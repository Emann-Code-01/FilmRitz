<template>
  <section class="relative mt-10">
    <!-- Loading State -->
    <div v-if="loading" :class="gridClass">
      <div
        v-for="n in displayLimit"
        :key="n"
        class="h-96 bg-gray-800/50 rounded-2xl animate-pulse"
      ></div>
    </div>

    <!-- Collections Grid -->
    <div v-else :class="gridClass">
      <div
        v-for="collection in displayedCollections"
        :key="collection.id"
        class="relative group"
        @mouseenter="handleHover(collection)"
      >
        <!-- Card Container -->
        <div
          class="relative h-96 rounded-2xl overflow-hidden bg-linear-to-br from-gray-900 to-black border border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:scale-105"
        >
          <div
            class="absolute inset-0 opacity-20"
            :style="{
              background: `linear-gradient(135deg, ${collection.color}40 0%, transparent 100%)`,
            }"
          ></div>

          <!-- Movie Posters Preview -->
          <div class="absolute inset-0 grid grid-cols-2 gap-1 p-2">
            <div
              v-for="item in collection.items.slice(0, 4)"
              :key="item.id"
              class="relative overflow-hidden rounded-2xl"
            >
              <img
                :src="getImageUrl(item.poster_path)"
                :alt="item.title"
                class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>

          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"
          ></div>

          <!-- Collection Info -->
          <div class="absolute inset-x-0 bottom-0 p-6">
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-20 aspect-square rounded-full flex items-center justify-center text-3xl"
                :style="{
                  backgroundColor: `${collection.color}30`,
                  border: `2px solid ${collection.color}`,
                }"
              >
                {{ collection.icon }}
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-[Gilroy-Bold] text-white mb-1">
                  {{ collection.title }}
                </h3>
                <p class="text-sm text-gray-400 font-[Gilroy-Medium]">
                  {{ collection.totalItems || 0 }}+ movies
                </p>
              </div>
            </div>

            <p class="text-gray-300 font-[Gilroy-Regular] text-sm line-clamp-2 mb-4">
              {{ collection.description }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in collection.tags?.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 rounded-full text-xs font-[Gilroy-SemiBold] bg-white/10 text-white"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Explore Button -->
            <button
              @click.stop="navigateToCollection(collection)"
              class="w-full py-3 rounded-xl font-[Gilroy-Bold] text-white transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
              :style="{
                backgroundColor: collection.color,
              }"
            >
              Explore Collection
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          <!-- Hover Glow Effect -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            :style="{
              boxShadow: `0 0 60px ${collection.color}80`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchAllCollections } from "@/api/tmdb";
import type { Collection } from "@/types/media";

const props = defineProps<{
  limit?: number; // Optional limit for home page
}>();

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const router = useRouter();
const collections = ref<Collection[]>([]);
const loading = ref(true);

// Compute displayed collections based on limit prop
const displayedCollections = computed(() => {
  if (props.limit) {
    return collections.value.slice(0, props.limit);
  }
  return collections.value;
});

// Compute display limit for loading skeleton
const displayLimit = computed(() => {
  return props.limit || 12;
});

// Compute grid class based on limit (adjust for home page)
const gridClass = computed(() => {
  if (props.limit === 3) {
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  }
  return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
});

const getImageUrl = (path: string | null): string => {
  return path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : "https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE";
};

const handleHover = (collection: Collection) => {
  emit("update-ambient", collection.color);
};

const navigateToCollection = (collection: Collection) => {
  router.push({
    name: "CollectionDetails",
    params: { name: collection.name },
  });
};

onMounted(async () => {
  try {
    // Fetch more collections if no limit, fewer if limited
    const fetchCount = props.limit ? props.limit + 2 : 12;
    collections.value = await fetchAllCollections(fetchCount);
  } catch (error) {
    console.error("Failed to load collections:", error);
  } finally {
    loading.value = false;
  }
});
</script>
