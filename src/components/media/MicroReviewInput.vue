<template>
  <div class="space-y-4">
    <textarea
      v-model="text"
      class="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b20710] transition resize-none"
      rows="3"
      placeholder="Share a quick thought (max 280 chars)"
      maxlength="280"
    ></textarea>
    <div class="flex justify-end items-center gap-4">
      <span class="text-xs text-gray-400">{{ charCount }}/280</span>
      <button
        :disabled="!isValid || submitting"
        @click="submit"
        class="px-4 py-2 bg-[#b20710] text-white rounded-lg hover:bg-[#e32125] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'Saving...' : 'Post' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{ (e:'submit', text:string):void }>();

const text = ref('');
const submitting = ref(false);

const charCount = computed(() => text.value.length);
const isValid = computed(() => charCount.value >= 5 && charCount.value <= 280);

async function submit() {
  if (!isValid.value) return;
  submitting.value = true;
  await emit('submit', text.value);
  text.value = '';
  submitting.value = false;
}
</script>