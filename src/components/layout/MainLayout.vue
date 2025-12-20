<template>
  <Navbar />

  <!-- Consent Banner -->
  <div
    v-if="!consentChecked"
    class="fixed bottom-0 left-0 w-full bg-[#222] text-white p-4 text-center z-50"
  >
    This site uses cookies for ads.
    <button @click="grantConsent" class="ml-2 px-4 py-1 bg-green-600 rounded">
      Consent
    </button>
    <button @click="denyConsent" class="ml-2 px-4 py-1 bg-red-600 rounded">
      Do Not Consent
    </button>
    <button @click="manageConsent" class="ml-2 px-4 py-1 bg-gray-600 rounded">
      Manage
    </button>
  </div>

  <main class="w-full text-[#d1d5dc]">
    <router-view class="w-full block" />

    <!-- Ads after main sections -->
    <AdSlot v-if="isLoggedIn && consentGranted" />
    <AdsenseAd v-if="consentGranted" adSlot="5823677820" />
  </main>

  <Footer />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Navbar from "../common/Navbar.vue";
import Footer from "../common/Footer.vue";
import AdSlot from "@/components/ads/AdSlot.vue";
import AdsenseAd from "@/components/ads/AdsenseAd.vue";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);

// Consent
const consentGranted = ref(false);
const consentChecked = ref(false);

function grantConsent() {
  localStorage.setItem("adConsent", "granted");
  consentGranted.value = true;
  consentChecked.value = true;
}

function denyConsent() {
  localStorage.setItem("adConsent", "denied");
  consentGranted.value = false;
  consentChecked.value = true;
}

function manageConsent() {
  alert("Manage consent settings (custom CMP logic)");
}

// Check consent on mount
onMounted(() => {
  const consent = localStorage.getItem("adConsent");
  if (consent === "granted") {
    consentGranted.value = true;
  }
  consentChecked.value = true;
});
</script>

<style scoped>
/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0a0a0a;
}
::-webkit-scrollbar-thumb {
  background: #b20710;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #e32125;
}
</style>
