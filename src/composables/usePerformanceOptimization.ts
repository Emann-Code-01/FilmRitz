// composables/usePerformanceOptimization.ts
import { ref, onMounted } from 'vue';

export const usePerformanceOptimization = () => {
  const canHandleAdvancedEffects = ref<boolean>(false);
  const preferReducedMotion = ref<boolean>(false);

  const detectCapabilities = () => {
    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 2;

    // Check if mobile
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

    // Check connection speed
    const connection = (navigator as any).connection;
    const isSlowConnection = connection?.effectiveType === '2g' ||
      connection?.effectiveType === 'slow-2g';

    // Check reduced motion preference
    preferReducedMotion.value = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    canHandleAdvancedEffects.value =
      cores > 4 &&
      !isMobile &&
      !isSlowConnection &&
      !preferReducedMotion.value;
  };

  onMounted(() => {
    detectCapabilities();
  });

  return {
    canHandleAdvancedEffects,
    preferReducedMotion
  };
};