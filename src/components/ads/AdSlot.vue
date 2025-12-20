<template>
  <div
    class="adsbygoogle block w-full my-10"
    aria-label="Advertisement"
  >
    <ins
      class="adsbygoogle block w-full max-w-4xl"
      style="display: block"
      data-ad-client="ca-pub-4160697772127882"
      data-ad-slot="5690255382"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>

    <p class="text-xs text-gray-500 mt-2 text-center">Sponsored content</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAdsense } from "@/composables/useAdsense";

const { loadAdsense } = useAdsense();

onMounted(() => {
  loadAdsense();

  // Push ONCE for this ad slot
  try {
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {
    console.warn("AdSense push skipped:", err);
  }
});
</script>
