<template>
  <div
    class="fixed inset-0 bg-black flex flex-col items-center justify-center z-9999"
  >
    <div class="text-center space-y-6 animate-fade-up">
      <!-- Logo -->
      <!-- <img
        src="/filmritzlogo2.png"
        alt="Filmritz Logo"
        class="w-20 h-20 mx-auto animate-pulse"
      /> -->

      <!-- Loading Spinner -->
      <div class="relative">
        <div
          class="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"
        ></div>
      </div>

      <!-- Status Text -->
      <div class="space-y-2">
        <h2 class="text-2xl font-[Gilroy-Bold] text-white">
          {{ statusText }}
        </h2>
        <p class="text-gray-400 font-[Gilroy-Medium]">
          {{ subText }}
        </p>
      </div>

      <!-- Progress Bar (optional visual feedback) -->
      <div class="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
        <div
          class="h-full bg-red-500 transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const statusText = ref("Signing you out...");
const subText = ref("Please wait a moment");
const progress = ref(0);

const MINIMUM_DISPLAY_TIME = 5000; // 5 seconds
const MAXIMUM_WAIT_TIME = 30000; // 30 seconds
const PROGRESS_INTERVAL = 100; // Update progress every 100ms

onMounted(async () => {
  const startTime = Date.now();
  let progressInterval: number;
  let timeoutId: number;

  // Start progress bar animation
  progressInterval = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    const targetProgress = Math.min((elapsed / MINIMUM_DISPLAY_TIME) * 100, 95);
    progress.value = targetProgress;
  }, PROGRESS_INTERVAL);

  // Set timeout for maximum wait time
  timeoutId = window.setTimeout(() => {
    clearInterval(progressInterval);
    statusText.value = "Taking longer than expected...";
    subText.value = "Redirecting you back";
    progress.value = 100;

    setTimeout(() => {
      router.push("/ng");
    }, 2000);
  }, MAXIMUM_WAIT_TIME);

  try {
    // Perform the actual sign out
    await auth.signOut();
    localStorage.removeItem("visitedLogin");

    // Calculate remaining time to show logout screen
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);

    // Update status
    statusText.value = "Successfully signed out";
    subText.value = "Redirecting to home...";
    progress.value = 100;

    // Clear the timeout since logout succeeded
    clearTimeout(timeoutId);
    clearInterval(progressInterval);

    // Wait for remaining time, then redirect
    setTimeout(() => {
      router.push("/ng");
    }, remainingTime);
  } catch (error) {
    // Clear intervals and timeout
    clearInterval(progressInterval);
    clearTimeout(timeoutId);

    console.error("Logout error:", error);
    statusText.value = "Logout failed";
    subText.value = "Redirecting you back...";
    progress.value = 100;

    // Redirect back to logged-in page after showing error
    setTimeout(() => {
      router.push("/ng");
    }, 2000);
  }
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
  animation: fade-up 0.6s ease-out;
}
</style>
