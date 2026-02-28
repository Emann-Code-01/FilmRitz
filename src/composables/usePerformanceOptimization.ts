// composables/usePerformanceOptimization.ts
import { ref, onMounted, computed } from 'vue'

export const usePerformanceOptimization = () => {
  const canHandleAdvancedEffects = ref<boolean>(false)
  const preferReducedMotion = ref<boolean>(false)

  const detectCapabilities = () => {
    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 2

    // Check if mobile
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)

    // Check connection speed
    const connection = (navigator as any).connection
    const isSlowConnection = connection?.effectiveType === '2g' ||
      connection?.effectiveType === 'slow-2g'

    // Check reduced motion preference
    preferReducedMotion.value = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    canHandleAdvancedEffects.value =
      cores > 4 &&
      !isMobile &&
      !isSlowConnection &&
      !preferReducedMotion.value
  }

  onMounted(() => {
    detectCapabilities()
  })

  return {
    canHandleAdvancedEffects,
    preferReducedMotion
  }
}

export function useSkeletonLoaders() {
  const skeletonItems = ref(Array(6).fill(null))

  const generateSkeletons = (count: number) => {
    skeletonItems.value = Array(count).fill(null)
  }

  return {
    skeletonItems,
    generateSkeletons
  }
}

export function usePerformanceMetrics() {
  const metrics = ref({
    timeToFirstPaint: 0,
    timeToInteractive: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0
  })

  const captureMetrics = () => {
    if ('PerformanceObserver' in window) {
      // CLS
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            metrics.value.cumulativeLayoutShift += (entry as any).value
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })

      // LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.value.largestContentfulPaint = lastEntry.startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  const getMetricsReport = () => ({
    ...metrics.value,
    isOptimal: metrics.value.largestContentfulPaint < 2500 && metrics.value.cumulativeLayoutShift < 0.1
  })

  return {
    metrics,
    captureMetrics,
    getMetricsReport
  }
}

export function usePerceivedSpeed() {
  const contentReady = ref(false)
  const skeletonVisible = ref(true)

  const minimumLoadTime = 800 // ms

  const simulateLoad = (actualLoadTime: number) => {
    const delay = Math.max(0, minimumLoadTime - actualLoadTime)

    setTimeout(() => {
      contentReady.value = true
      skeletonVisible.value = false
    }, actualLoadTime + delay)
  }

  return {
    contentReady,
    skeletonVisible,
    simulateLoad
  }
}

export function useTransitionAnimations() {
  const transitionClasses = computed(() => ({
    fadeIn: 'opacity-0 animate-fadeIn',
    slideIn: 'translate-x-[-20px] animate-slideIn',
    scaleIn: 'scale-90 opacity-0 animate-scaleIn',
    stagger: 'animate-stagger'
  }))

  return {
    transitionClasses
  }
}