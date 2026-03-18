<template>
  <div v-if="loading" class="space-y-4">
    <div
      v-for="index in count"
      :key="index"
      class="bg-white/5 rounded-2xl p-4 animate-pulse border border-white/5"
    >
      <div class="flex items-start gap-4">
        <div class="w-16 h-24 bg-white/10 rounded-lg shrink-0"></div>
        <div class="flex-1 space-y-3">
          <div class="h-4 bg-white/10 rounded-full w-3/4"></div>
          <div class="h-4 bg-white/10 rounded-full w-1/2"></div>
          <div class="h-3 bg-white/10 rounded-full w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  count?: number;
}

withDefaults(defineProps<Props>(), {
  count: 6,
});
</script>
