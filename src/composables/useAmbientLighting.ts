import { Ref } from "vue";
import { useAmbient } from "./useAmbient";
import type { ColorPalette } from "@/types/media";

export const useAmbientLighting = (_videoRef: Ref<HTMLVideoElement | null>) => {
  const {
    updateFromPalette,
    isAmbientEnabled,
    ambientColor,
    activate: activateAmbient,
    deactivate: deactivateAmbient,
  } = useAmbient();

  const updateAmbientLight = (palette: ColorPalette) => {
    if (!isAmbientEnabled.value) return;
    // Update the global ambient system
    updateFromPalette(palette);
  };

  const activate = () => {
    activateAmbient();
  };

  const deactivate = () => {
    deactivateAmbient();
  };

  return {
    ambientColor,
    isActive: isAmbientEnabled,
    updateAmbientLight,
    activate,
    deactivate,
  };
};
