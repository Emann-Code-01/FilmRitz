// composables/useAmbient.ts
import { ref, computed } from 'vue';

// Ambient colors pool for variety
const ambientColors = [
  '#b20710', // FilmRitz Red
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Green
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

// Global state - created at module scope, shared across all components
const ambientColor = ref<string>('#b20710');
const ambientPosition = ref<{ x: number; y: number }>({ x: 50, y: 30 });
const isAmbientEnabled = ref<boolean>(false);
const isInitialized = ref<boolean>(false);

// Get random color from pool
const getRandomAmbientColor = () => {
  return ambientColors[Math.floor(Math.random() * ambientColors.length)];
};

// Initialize from localStorage (call once in App.vue or main layout)
export const initializeAmbient = () => {
  if (isInitialized.value) return;

  // Check saved preference
  const savedPreference = localStorage.getItem('ambientEnabled');
  
  // Detect device capabilities
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Set initial state
  if (savedPreference !== null) {
    isAmbientEnabled.value = savedPreference === 'true';
  } else {
    // Default: ON for mobile, OFF for desktop
    isAmbientEnabled.value = isMobile && !prefersReducedMotion;
  }

  // Set random color if enabled
  if (isAmbientEnabled.value) {
    ambientColor.value = getRandomAmbientColor();
  }

  isInitialized.value = true;

  console.log('🎨 Global Ambient System Initialized:', {
    enabled: isAmbientEnabled.value,
    color: ambientColor.value,
    isMobile,
    prefersReducedMotion,
  });
};

export function useAmbient() {
  // Computed gradient background for the ambient layer
  const ambientGradient = computed(() => {
    if (!isAmbientEnabled.value) return 'transparent';
    
    return `radial-gradient(
      circle at ${ambientPosition.value.x}% ${ambientPosition.value.y}%,
      ${ambientColor.value}40 0%,
      ${ambientColor.value}20 30%,
      transparent 70%
    )`;
  });

  // Update ambient color
  const updateColor = (color: string) => {
    if (!isAmbientEnabled.value || !color) return;
    ambientColor.value = color;
  };

  // Update ambient position for dynamic movement
  const updatePosition = (position: { x: number; y: number }) => {
    if (!isAmbientEnabled.value || !position) return;
    ambientPosition.value = position;
  };

  // Toggle ambient on/off
  const toggle = () => {
    isAmbientEnabled.value = !isAmbientEnabled.value;
    localStorage.setItem('ambientEnabled', String(isAmbientEnabled.value));
    
    if (isAmbientEnabled.value) {
      ambientColor.value = getRandomAmbientColor();
    }

    console.log('🎨 Ambient toggled:', isAmbientEnabled.value);
  };

  // Activate ambient
  const activate = () => {
    isAmbientEnabled.value = true;
    localStorage.setItem('ambientEnabled', 'true');
  };

  // Deactivate ambient
  const deactivate = () => {
    isAmbientEnabled.value = false;
    localStorage.setItem('ambientEnabled', 'false');
  };

  // Set random color
  const randomizeColor = () => {
    if (!isAmbientEnabled.value) return;
    ambientColor.value = getRandomAmbientColor();
  };

  // Update with color palette (for video/image analysis)
  const updateFromPalette = (palette: { vibrant?: string; dominant?: string; muted?: string }) => {
    if (!isAmbientEnabled.value) return;
    
    // Prioritize vibrant, then dominant, then muted
    const color = palette.vibrant || palette.dominant || palette.muted;
    if (color) {
      ambientColor.value = color;
    }
  };

  return {
    // State
    ambientColor,
    ambientPosition,
    isAmbientEnabled,
    ambientGradient,

    // Methods
    updateColor,
    updatePosition,
    toggle,
    activate,
    deactivate,
    randomizeColor,
    updateFromPalette,
  };
}