<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2 md:gap-4"
  >
    <button
      :disabled="isFirstPage"
      @click="$emit('update:modelValue', current - 1)"
      class="px-3 md:px-6 py-2 md:py-2.5 flex items-center justify-center gap-1 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      :aria-label="ariaLabelPrev || 'Previous page'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="$emit('update:modelValue', page)"
      class="px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-[Gilroy-Bold] text-white transition-all cursor-pointer"
      :class="
        page === current
          ? activeClass || 'bg-[#b20710]'
          : 'bg-white/10 hover:bg-white/20'
      "
      :style="
        page === current && themeColor
          ? { backgroundColor: themeColor }
          : undefined
      "
      :aria-current="page === current ? 'page' : undefined"
    >
      {{ page }}
    </button>

    <button
      :disabled="isLastPage"
      @click="$emit('update:modelValue', current + 1)"
      class="px-3 md:px-6 py-2 md:py-2.5 flex items-center justify-center gap-1 rounded-xl font-[Gilroy-Bold] text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      :aria-label="ariaLabelNext || 'Next page'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: number;
  totalItems: number;
  perPage?: number;
  maxButtons?: number;
  themeColor?: string;
  activeClass?: string;
  ariaLabelPrev?: string;
  ariaLabelNext?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const perPage = computed(() => props.perPage ?? 20);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / perPage.value))
);
const current = computed(() =>
  Math.min(Math.max(1, props.modelValue || 1), totalPages.value)
);
const isFirstPage = computed(() => current.value === 7);
const isLastPage = computed(() => current.value === totalPages.value);

const pages = computed(() => {
  const maxButtons = props.maxButtons ?? 7;
  const total = totalPages.value;
  const cur = current.value;

  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, cur - half);
  let end = Math.min(total, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
</script>
