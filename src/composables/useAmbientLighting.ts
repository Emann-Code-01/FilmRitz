// composables/useAmbientLighting.ts
import { ref, Ref } from 'vue';
import { ColorPalette } from '../types/media';

export const useAmbientLighting = (_videoRef: Ref<HTMLVideoElement | null>) => {
  const ambientColor = ref<string>('rgba(0,0,0,0)');
  const isActive = ref<boolean>(false);

  const updateAmbientLight = (palette: ColorPalette) => {
    if (!isActive.value) return;

    // Create gradient glow effect
    ambientColor.value = `radial-gradient(
      circle at 50% 50%,
      ${palette.vibrant}40 0%,
      ${palette.dominant}20 50%,
      transparent 100%
    )`;
  };

  const activate = () => {
    isActive.value = true;
  };

  const deactivate = () => {
    isActive.value = false;
    ambientColor.value = 'rgba(0,0,0,0)';
  };

  return {
    ambientColor,
    isActive,
    updateAmbientLight,
    activate,
    deactivate
  };
};