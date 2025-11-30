// composables/useTrailerAutoplay.ts
import { ref, onUnmounted } from 'vue';

interface TrailerConfig {
  autoplayDelay?: number;
  muteByDefault?: boolean;
}

export const useTrailerAutoplay = (config: TrailerConfig = {}) => {
  const { autoplayDelay = 3000, muteByDefault = true } = config;

  const isPlaying = ref<boolean>(false);
  const isMuted = ref<boolean>(muteByDefault);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);

  let autoplayTimer: ReturnType<typeof setTimeout> | null = null;

  const startAutoplay = (
    videoElement: HTMLVideoElement,
    onEnded?: () => void
  ) => {
    autoplayTimer = setTimeout(() => {
      videoElement.play();
      isPlaying.value = true;

      if (onEnded) {
        videoElement.addEventListener('ended', onEnded, { once: true });
      }
    }, autoplayDelay);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const toggleMute = (videoElement: HTMLVideoElement) => {
    isMuted.value = !isMuted.value;
    videoElement.muted = isMuted.value;
  };

  const updateProgress = (videoElement: HTMLVideoElement) => {
    currentTime.value = videoElement.currentTime;
    duration.value = videoElement.duration;
  };

  onUnmounted(() => {
    stopAutoplay();
  });

  return {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    startAutoplay,
    stopAutoplay,
    toggleMute,
    updateProgress
  };
};