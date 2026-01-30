<template>
  <div
    class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
  >
    <!-- User Info -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div
          class="size-10 rounded-full bg-linear-to-br from-[#b20710] to-[#e32125] flex items-center justify-center shrink-0"
        >
          <span class="text-white font-bold text-sm select-none">
            {{ getUserInitial(review.user?.email || "A") }}
          </span>
        </div>
        <div>
          <p class="text-white font-semibold text-sm md:text-base">
            {{ getUserName(review.user?.email) }}
          </p>
          <p class="text-gray-400 text-xs">
            {{ formatDate(review.createdAt) }}
          </p>
        </div>
      </div>

      <div v-if="isOwnReview" class="flex gap-2">
        <button
          @click="emit('edit')"
          class="text-gray-400 hover:text-white transition p-1 rounded hover:bg-gray-700"
          title="Edit review"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 md:h-5 md:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
        </button>
        <button
          @click="emit('delete')"
          class="text-red-400 hover:text-red-300 transition p-1 rounded hover:bg-red-900/30"
          title="Delete review"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 md:h-5 md:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Review Text -->
    <div class="mb-4">
      <div
        v-if="review.isSpoiler && !revealed"
        class="flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-lg border border-gray-700 border-dashed"
      >
        <p class="text-yellow-500 font-semibold mb-2 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          Contains Spoilers
        </p>
        <button
          @click="revealed = true"
          class="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition"
        >
          Reveal Content
        </button>
      </div>
      <p
        v-else
        class="text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap"
      >
        {{ review.reviewText }}
      </p>
    </div>

    <!-- Helpfulness -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-700/50 pt-3"
    >
      <span class="text-xs text-gray-500">Was this review helpful?</span>
      <div class="flex gap-3">
        <button
          @click="handleHelpful(true)"
          :disabled="isOwnReview"
          :class="[
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
            userVote === true
              ? 'bg-green-900/30 text-green-400 ring-1 ring-green-700'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
            />
          </svg>
          {{ review.helpfulCount }}
        </button>
        <button
          @click="handleHelpful(false)"
          :disabled="isOwnReview"
          :class="[
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed',
            userVote === false
              ? 'bg-red-900/30 text-red-400 ring-1 ring-red-700'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5 rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
            />
          </svg>
          {{ review.notHelpfulCount }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Review } from "@/services/ratingService";

interface Props {
  review: Review;
  userVote?: boolean | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  helpful: [isHelpful: boolean];
  edit: [];
  delete: [];
}>();

const auth = useAuthStore();
const revealed = ref(false);

// Auto-reveal own reviews or already revealed
const isOwnReview = computed(() => {
  const currentUserId = auth.user?.id;
  const reviewUserId = props.review.userId;

  // Debug logging
  console.log("ReviewCard ownership check:", {
    currentUserId,
    reviewUserId,
    match: currentUserId === reviewUserId,
  });

  // Explicit boolean return to satisfy TypeScript
  if (!currentUserId || !reviewUserId) {
    return false;
  }
  return currentUserId === reviewUserId;
});

function getUserName(email?: string): string {
  if (!email) return "FilmRitz User";
  return email.split("@")[0];
}

function getUserInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}

function formatDate(dateString: string): string {
  // Simple relative time or date formatting
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });
}

function handleHelpful(isHelpful: boolean) {
  if (isOwnReview.value) return;
  emit("helpful", isHelpful);
}
</script>
