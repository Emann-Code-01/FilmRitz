<template>
  <div class="flex items-center gap-2">
    <!-- Star Display -->
    <div class="flex items-center gap-1">
      <button
        v-for="star in 5"
        :key="star"
        @click="handleStarClick(star)"
        @mousemove="handleMouseMove($event, star)"
        @mouseleave="hoverRating = 0"
        :disabled="!interactive"
        class="relative transition-transform focus:outline-none disabled:cursor-default"
        :class="{ 'cursor-pointer hover:scale-110': interactive }"
        :aria-label="'Rate ' + star + ' stars'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-6 transition-colors"
          :class="getStarClass(star)"
        >
          <defs>
            <linearGradient :id="`half-${star}-${componentId}`">
              <stop offset="50%" :stop-color="activeColor" />
              <stop offset="50%" :stop-color="inactiveColor" />
            </linearGradient>
          </defs>
          <path
            :fill="getStarFill(star)"
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Rating Text -->
    <span v-if="showText" class="text-sm text-gray-300 font-medium">
      {{ displayRating }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  modelValue: number; // 0-5 in 0.5 increments
  interactive?: boolean; // Can user click to rate?
  showText?: boolean; // Show numerical rating?
  activeColor?: string;
  inactiveColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  interactive: false,
  showText: true,
  activeColor: "#FBBF24", // yellow-400
  inactiveColor: "#374151", // gray-700
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const componentId = Math.random().toString(36).substring(2, 9);
const hoverRating = ref(0);

const displayRating = computed(() => {
  const rating = hoverRating.value || props.modelValue;
  // If no rating yet, show nothing or 'Rate'
  if (rating === 0 && props.interactive) return "Rate";
  if (rating === 0) return "";
  return rating.toFixed(1);
});

function getStarType(starPosition: number): "full" | "half" | "empty" {
  const rating = hoverRating.value || props.modelValue;

  if (rating >= starPosition) return "full";
  if (rating >= starPosition - 0.5) return "half";
  return "empty";
}

function getStarFill(starPosition: number): string {
  const type = getStarType(starPosition);
  if (type === "full") return props.activeColor;
  if (type === "half") return `url(#half-${starPosition}-${componentId})`;
  return props.inactiveColor;
}

function getStarClass(starPosition: number): string {
  const type = getStarType(starPosition);
  return type !== "empty" ? "drop-shadow-md" : "";
}

// Logic to determine if user is hovering over left or right half of star
function handleMouseMove(event: MouseEvent, starPosition: number) {
  if (!props.interactive) return;

  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect(); // relative to viewport
  const x = event.clientX - rect.left; // x position within the element
  const width = rect.width;

  // If x is less than half width, it's a half star
  if (x < width / 2) {
    hoverRating.value = starPosition - 0.5;
  } else {
    hoverRating.value = starPosition;
  }
}

function handleStarClick(starPosition: number) {
  if (!props.interactive) return;
  // Use the current hover rating which already accounts for half stars
  // Fallback to starPosition for touch devices where hover might not trigger first
  emit("update:modelValue", hoverRating.value || starPosition);
}
</script>
