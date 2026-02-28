<template>
  <section class="relative z-10" :class="`${category}-grid`">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-12 gap-4">
      <div
        class="col-span-12 md:col-span-6 row-span-2 h-[500px] bg-gray-800/50 rounded-xl animate-pulse"
      ></div>
      <div
        v-for="n in 6"
        :key="n"
        class="col-span-6 md:col-span-3 h-64 bg-gray-800/50 rounded-xl animate-pulse"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-red-500 text-center py-8 bg-red-500/10 rounded-xl border border-red-500/20"
    >
      <p class="font-[Gilroy-SemiBold]">{{ error }}</p>
      <button
        @click="loadMedia"
        class="mt-4 px-6 py-2 bg-[#b20710] hover:bg-[#e32125] text-white rounded-lg transition-all cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <MediaSectionGrid
        :items="mediaList"
        @update-ambient="$emit('update-ambient', $event)"
      />

      <!-- Special case for Trending: "See More" for non-logged-in users -->
      <div v-if="category === 'trending' && !auth.isLoggedIn" class="mt-8">
        <router-link
          to="/ng/login"
          class="block w-full md:w-fit mx-auto px-8 py-4 bg-linear-to-r from-[#b20710] to-[#8a0509] rounded-xl text-center hover:scale-105 transition-all duration-500 cursor-pointer shadow-xl shadow-red-900/20"
        >
          <p class="text-white font-[Gilroy-Bold] text-xl mb-1">
            See More Trending
          </p>
          <p class="text-white/70 font-[Gilroy-Medium] text-sm">
            Sign in to unlock our full Intelligence Engine
          </p>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getRotatedTrending,
  getRotatedPopular,
  getRotatedTopRated,
  getRotatedUpcoming,
} from "@/services/mediaRotation";
import { useAuthStore } from "@/stores/auth";
import { IntelligenceService } from "@/services/intelligenceService";
import MediaSectionGrid from "./MediaSectionGrid.vue";

const props = defineProps<{
  category: "trending" | "popular" | "topRated" | "upcoming";
}>();

defineEmits<{
  "update-ambient": [color: string];
}>();

const auth = useAuthStore();
const mediaList = ref<any[]>([]);
const error = ref<string | null>(null);
const loading = ref(false);

const categoryMap = {
  trending: { fn: getRotatedTrending, label: "trending" },
  popular: { fn: getRotatedPopular, label: "popular" },
  topRated: { fn: getRotatedTopRated, label: "top rated" },
  upcoming: { fn: getRotatedUpcoming, label: "upcoming" },
};

const loadMedia = async () => {
  loading.value = true;
  error.value = null;
  try {
    const config = categoryMap[props.category];
    const rawItems = await config.fn();
    mediaList.value = rawItems
      .slice(0, 7)
      .map((item) => IntelligenceService.normalize(item, item.media_type));
  } catch (err: any) {
    console.error(`❌ Failed to fetch ${props.category} media:`, err);
    error.value = `Couldn't load ${categoryMap[props.category].label} content. Please refresh in a bit.`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMedia();
});
</script>

<style scoped>
section {
  transition: all 0.5s;
}
</style>
