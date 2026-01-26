<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative w-full max-w-lg bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-[Gilroy-Bold] text-white">
            {{ isEditing ? "Edit Review" : "Write a Review" }}
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-white transition rounded-lg p-1 hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Text Area -->
          <div class="mb-4">
            <label
              for="review-text"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Thoughts <span class="text-red-500">*</span>
            </label>
            <textarea
              id="review-text"
              v-model="reviewText"
              rows="6"
              class="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b20710] focus:border-transparent transition resize-none"
              placeholder="What did you think about the plot, acting, or cinematography?"
              :maxlength="500"
              required
            ></textarea>
            <div class="flex justify-between mt-2">
              <p class="text-xs text-gray-500">Minimum 10 characters</p>
              <p
                :class="[
                  'text-xs',
                  charCount >= 500 ? 'text-red-500' : 'text-gray-500',
                ]"
              >
                {{ charCount }}/500
              </p>
            </div>
          </div>

          <!-- Spoiler Toggle -->
          <div class="mb-8">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="isSpoiler"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#b20710]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b20710]"
                ></div>
              </div>
              <span
                class="text-sm font-medium text-gray-300 group-hover:text-white transition"
              >
                Contains Spoilers
              </span>
            </label>
            <p class="text-xs text-gray-500 mt-1 ml-14">
              Mark this if your review reveals key plot twists.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="close"
              class="flex-1 px-4 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isValid || submitting"
              class="flex-1 px-4 py-3 bg-[#b20710] text-white font-medium rounded-lg hover:bg-[#e32125] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                v-if="submitting"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{
                submitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Review"
                    : "Post Review"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  isOpen: boolean;
  initialText?: string;
  initialSpoiler?: boolean;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  initialText: "",
  initialSpoiler: false,
  isEditing: false,
});

const emit = defineEmits<{
  close: [];
  submit: [data: { text: string; isSpoiler: boolean }];
}>();

const reviewText = ref("");
const isSpoiler = ref(false);
const submitting = ref(false);

// Initialize form when opened or props change
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      reviewText.value = props.initialText;
      isSpoiler.value = props.initialSpoiler;
    }
  },
);

const charCount = computed(() => reviewText.value.length);
const isValid = computed(() => charCount.value >= 10 && charCount.value <= 500);

function close() {
  emit("close");
}

async function handleSubmit() {
  if (!isValid.value) return;
  submitting.value = true;

  // Simulate network delay for UX or wait for parent to handle it
  // In a real app the parent component handles the async submit
  emit("submit", {
    text: reviewText.value,
    isSpoiler: isSpoiler.value,
  });

  // Reset submitting state is responsibility of parent or we assume success and close
  // For this UI component we'll let parent close it, but just in case:
  setTimeout(() => {
    submitting.value = false;
  }, 1000);
}
</script>
