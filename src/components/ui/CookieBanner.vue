<!-- components/ui/CookieBanner.vue (Example) -->
<template>
  <div
    v-if="!hasConsented"
    class="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur p-4"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <p class="text-sm text-gray-300">
        We use cookies to enhance your experience. By continuing, you accept our
        <router-link
          to="/ng/privacy-policy"
          class="text-[#b20710] hover:underline"
          >Privacy Policy</router-link
        >.
      </p>
      <div class="flex gap-2">
        <button
          @click="acceptCookies"
          class="px-4 py-2 bg-[#b20710] text-white rounded"
        >
          Accept
        </button>
        <button
          @click="declineCookies"
          class="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Decline
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const hasConsented = ref(true);

onMounted(() => {
  const consent = localStorage.getItem("cookieConsent");
  if (!consent) {
    hasConsented.value = false;
  }
});

const acceptCookies = () => {
  localStorage.setItem("cookieConsent", "accepted");
  hasConsented.value = true;
};

const declineCookies = () => {
  localStorage.setItem("cookieConsent", "declined");
  hasConsented.value = true;
};
</script>
