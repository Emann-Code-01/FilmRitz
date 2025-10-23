<template>
  <div
    class="bg-black/80 backdrop-blur-xl rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-4"
  >
    <!-- Genre -->
    <div>
      <label class="text-white font-semibold mb-1 block">Genre</label>
      <select
        v-model="localFilters.genre"
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
        v-model.number="localFilters.year"
        placeholder="e.g. 2023"
        class="p-2 rounded bg-gray-800 text-white w-24"
      />
    </div>

    <!-- Rating -->
    <div>
      <label class="text-white font-semibold mb-1 block">Min Rating</label>
      <input
        type="number"
        v-model.number="localFilters.rating"
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
        v-model="localFilters.type"
        class="p-2 rounded bg-gray-800 text-white cursor-pointer"
      >
        <option value="">All</option>
        <option value="movie">Movie</option>
        <option value="tv">Series</option>
      </select>
    </div>

    <!-- Buttons -->
    <div class="flex items-end gap-2">
      <button
        @click="applyFilter"
        class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-semibold cursor-pointer"
      >
        Apply
      </button>
      <button
        @click="clearFilter"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold cursor-pointer"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { genreNameToId } from "../../types/genres";
import { useMediatore } from "../../stores/mediaStore";

const store = useMediatore();

const emit = defineEmits(["apply", "clear"]);

const localFilters = ref({
  genre: "",
  year: null as number | null,
  rating: null as number | null,
  type: "",
});

// ✅ Use genreNameToId (name ➜ id)
const genres = computed(() =>
  Object.entries(genreNameToId).map(([name, id]) => ({
    id,
    name,
  }))
);

function applyFilter() {
  const appliedFilters = {
    genre: localFilters.value.genre,
    year: localFilters.value.year,
    rating: localFilters.value.rating,
    type: localFilters.value.type,
  };
  emit("apply", appliedFilters);
}

function clearFilter() {
  localFilters.value = { genre: "", year: null, rating: null, type: "" };
  emit("clear");
}
</script>
