<template>
  <div class="adsense-container" v-if="consentGranted" ref="adContainer">
    <ins
      class="adsbygoogle"
      style="display: block; min-height: 280px"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { useAdsense } from "@/composables/useAdsense";

defineProps<{ adSlot: string }>();

const adClient = "ca-pub-4160697772127882";
const adFormat = "auto";

const consentGranted = ref(false);
const adContainer = ref<HTMLElement | null>(null);
const pushed = ref(false);
const retryCount = ref(0);

const MAX_RETRIES = 5;

const { loadAdsense } = useAdsense();

const pushAd = () => {
  if (pushed.value || retryCount.value >= MAX_RETRIES) return;

  nextTick(() => {
    if (!adContainer.value) return;

    const width = adContainer.value.clientWidth;

    if (width > 0) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.value = true;
        console.log("✅ AdSense pushed");
      } catch (e) {
        console.warn("AdSense push failed:", e);
      }
    } else {
      retryCount.value++;
      console.warn(
        `AdSense width = 0 (retry ${retryCount.value}/${MAX_RETRIES})`
      );
      setTimeout(pushAd, 400);
    }
  });
};

onMounted(() => {
  const consent = localStorage.getItem("adConsent");
  if (consent !== "granted") return;

  consentGranted.value = true;
  loadAdsense();
  pushAd();
});
</script>

<style scoped>
.adsense-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
