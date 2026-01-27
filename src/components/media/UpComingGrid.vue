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
        @click="loadUpcomingMedia"
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getRotatedUpcoming } from "@/services/mediaRotation";
import { IntelligenceService } from "@/services/intelligenceService";
import MediaSectionGrid from "./MediaSectionGrid.vue";

const emit = defineEmits<{
  "update-ambient": [color: string];
}>();

const mediaList = ref<any[]>([]);
const error = ref<string | null>(null);
const loading = ref(false);

const loadUpcomingMedia = async () => {
  loading.value = true;
  error.value = null;
  try {
    const rawItems = await getRotatedUpcoming();
    mediaList.value = rawItems
      .slice(0, 7)
      .map((item) => IntelligenceService.normalize(item, item.media_type));
  } catch (err: any) {
    console.error("❌ Failed to fetch upcoming media:", err);
    error.value = "Couldn't load upcoming content. Please refresh in a bit.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUpcomingMedia();
});
</script>

<style scoped>
/* Ensure smooth animations */
.upcoming-grid {
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
.upcoming-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
