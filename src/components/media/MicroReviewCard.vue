<template>
  <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
    <div class="flex items-center justify-between mb-2">
      <p class="text-white text-sm font-semibold">
        {{ review.user?.email || 'Anon' }}
      </p>
      <div class="flex gap-2">
        <button
          v-if="isOwn"
          @click="$emit('edit')"
          class="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
          title="Edit"
        >✏️</button>
        <button
          v-if="isOwn"
          @click="$emit('delete')"
          class="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/30"
          title="Delete"
        >🗑️</button>
      </div>
    </div>
    <p class="text-gray-200 text-sm mb-2">{{ review.content }}</p>
    <div class="flex items-center gap-3 text-xs text-gray-400">
      <button
        @click="$emit('helpful', true)"
        class="flex items-center gap-1"
      >👍 {{ review.helpful_count }}</button>
      <button
        @click="$emit('helpful', false)"
        class="flex items-center gap-1"
      >👎 {{ review.unhelpful_count }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MicroReview } from '@/types/intelligence';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{ review: MicroReview; userVote?: boolean | null }>();
const emit = defineEmits<{ (e:'helpful', isHelpful:boolean):void; (e:'edit'):void; (e:'delete'):void; }>();

const auth = useAuthStore();
const isOwn = computed(() => auth.user?.id === props.review.user_id);
</script>