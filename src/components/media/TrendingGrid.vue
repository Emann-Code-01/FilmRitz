<template>
  <section class="relative z-10">
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

    <div
      v-else-if="error"
      class="text-red-500 text-center py-8 bg-red-500/10 rounded-xl border border-red-500/20"
    >
      <p class="font-[Gilroy-SemiBold]">{{ error }}</p>
      <button
        @click="loadTrendingMedia"
        class="mt-4 px-6 py-2 bg-[#b20710] hover:bg-[#e32125] text-white rounded-lg transition-all cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <div v-else>
      <MediaSectionGrid
        :items="mediaList"
        @update-ambient="$emit('update-ambient', $event)"
      />

      <div v-if="!auth.isLoggedIn" class="mt-8">
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
import { getRotatedTrending } from "@/services/mediaRotation";
import { useAuthStore } from "@/stores/auth";
import { IntelligenceService } from "@/services/intelligenceService";
import MediaSectionGrid from "./MediaSectionGrid.vue";

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const auth = useAuthStore();
const mediaList = ref<any[]>([]);
const error = ref<string | null>(null);
const loading = ref(false);

const loadTrendingMedia = async () => {
  loading.value = true;
  error.value = null;
  try {
    const rawItems = await getRotatedTrending();
    mediaList.value = rawItems
      .slice(0, 7)
      .map((item) => IntelligenceService.normalize(item, item.media_type));
  } catch (err: any) {
    console.error("❌ Failed to fetch trending media:", err);
    error.value = "Couldn't load trending content. Please refresh in a bit.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTrendingMedia();
});
</script>

<style scoped>
/* Ensure smooth animations */
.trending-grid {
  transition: all 0.5s;
}

/* Custom hover lift effect */
@keyframes lift {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-8px);
  }
}

.group:hover {
  animation: lift 0.3s ease-out forwards;
}

/* Film grain texture overlay (optional premium effect) */
.trending-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
