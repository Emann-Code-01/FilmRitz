<template>
  <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-12">
    <h2 class="text-xl font-semibold mb-4">Content Moderation</h2>

    <!-- Flagged Reviews -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Flagged Reviews</h3>
      <div v-if="loadingReviews" class="text-gray-400">Loading reviews...</div>
      <div v-else-if="flaggedReviews.length === 0" class="text-gray-500">
        No flagged reviews.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="rev in flaggedReviews"
          :key="rev.id"
          class="bg-gray-700 p-3 rounded-lg flex justify-between items-start"
        >
          <div class="flex-1">
            <p class="text-white font-semibold text-sm">
              {{ rev.user?.email || 'Anonymous' }}
            </p>
            <p class="text-gray-300 text-sm">
              {{ rev.reviewText }}
            </p>
          </div>
          <div class="flex flex-col gap-2 ml-4">
            <button
              @click="approveReview(rev.id)"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            >
              Approve
            </button>
            <button
              @click="deleteReview(rev.id)"
              class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Flagged Micro Reviews -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Flagged Micro‑reviews</h3>
      <div v-if="loadingMicro" class="text-gray-400">Loading micro‑reviews...</div>
      <div v-else-if="flaggedMicro.length === 0" class="text-gray-500">
        No flagged micro‑reviews.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="mr in flaggedMicro"
          :key="mr.id"
          class="bg-gray-700 p-3 rounded-lg flex justify-between items-start"
        >
          <div class="flex-1">
            <p class="text-white font-semibold text-sm">
              {{ mr.user?.email || 'Anonymous' }}
            </p>
            <p class="text-gray-300 text-sm">
              {{ mr.content }}
            </p>
          </div>
          <div class="flex flex-col gap-2 ml-4">
            <button
              @click="approveMicro(mr.id)"
              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
            >
              Approve
            </button>
            <button
              @click="deleteMicro(mr.id)"
              class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ratingService, Review } from '@/services/ratingService';
import { microReviewService } from '@/services/microReviewService';
import type { MicroReview } from '@/types/intelligence';

const flaggedReviews = ref<Review[]>([]);
const flaggedMicro = ref<MicroReview[]>([]);
const loadingReviews = ref(false);
const loadingMicro = ref(false);

async function loadFlags() {
  loadingReviews.value = true;
  loadingMicro.value = true;
  try {
    flaggedReviews.value = await ratingService.fetchFlaggedReviews();
  } catch (e) {
    console.error('failed loading flagged reviews', e);
  } finally {
    loadingReviews.value = false;
  }
  try {
    flaggedMicro.value = await microReviewService.fetchFlagged();
  } catch (e) {
    console.error('failed loading flagged micro reviews', e);
  } finally {
    loadingMicro.value = false;
  }
}

async function approveReview(id: string) {
  await ratingService.moderateReview(id, 'approve');
  loadFlags();
}
async function deleteReview(id: string) {
  await ratingService.moderateReview(id, 'delete');
  loadFlags();
}
async function approveMicro(id: string) {
  await microReviewService.moderate(id, 'approve');
  loadFlags();
}
async function deleteMicro(id: string) {
  await microReviewService.moderate(id, 'delete');
  loadFlags();
}

onMounted(loadFlags);
</script>
