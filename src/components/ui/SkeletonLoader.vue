<template>
  <div v-if="loading" class="space-y-4">
    <div v-for="index in count" :key="index" class="bg-gray-800 rounded-lg p-4 animate-pulse">
      <div class="flex items-start gap-4">
        <div class="w-16 h-24 bg-gray-700 rounded shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-700 rounded w-1/2"></div>
          <div class="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 6
})
</script>