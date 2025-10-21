<template>
  <div
    class="bg-black/80 backdrop-blur-xl rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-4"
  >
    <!-- Genre -->
    <div>
      <label class="text-white font-semibold mb-1 block">Genre</label>
      <select
        v-model="selectedGenre"
        class="p-2 rounded bg-gray-800 text-white cursor-pointer"
      >
        <option value="">All</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>
    </div>

    <!-- Year -->
    <div>
      <label class="text-white font-semibold mb-1 block">Year</label>
      <input
        type="number"
        v-model.number="selectedYear"
        placeholder="e.g. 2023"
        class="p-2 rounded bg-gray-800 text-white w-24"
      />
    </div>

    <!-- Rating -->
    <div>
      <label class="text-white font-semibold mb-1 block">Min Rating</label>
      <input
        type="number"
        v-model.number="selectedRating"
        min="0"
        max="10"
        step="0.1"
        placeholder="0 - 10"
        class="p-2 rounded bg-gray-800 text-white w-24"
      />
    </div>

    <!-- Type -->
    <div>
      <label class="text-white font-semibold mb-1 block">Type</label>
      <select
        v-model="selectedType"
        class="p-2 rounded bg-gray-800 text-white cursor-pointer"
      >
        <option value="">All</option>
        <option value="movie">Movie</option>
        <option value="tv">Series</option>
      </select>
    </div>

    <div class="flex items-end">
      <button
        @click="applyFilters"
        class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-semibold cursor-pointer"
      >
        Apply
      </button>
      <button
        @click="clearFilters"
        class="ml-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold cursor-pointer"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from "vue";
import { genreMap } from "../../types/genres";

const emit = defineEmits<{
  (
    e: "apply",
    filters: { genre?: string; year?: number; rating?: number; type?: string }
  ): void;
  (e: "clear"): void;
}>();

const genres = computed(() =>
  Object.entries(genreMap).map(([id, name]) => ({ id, name }))
);

const selectedGenre = ref("");
const selectedYear = ref<number | null>(null);
const selectedRating = ref<number | null>(null);
const selectedType = ref("");

const applyFilters = () => {
  emit("apply", {
    genre: selectedGenre.value || undefined,
    year: selectedYear.value || undefined,
    rating: selectedRating.value || undefined,
    type: selectedType.value || undefined,
  });
};

const clearFilters = () => {
  selectedGenre.value = "";
  selectedYear.value = null;
  selectedRating.value = null;
  selectedType.value = "";
  emit("clear");
};
</script>
