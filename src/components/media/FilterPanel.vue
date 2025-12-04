<template>
  <div class="px-6 max-w-[1230px] mx-auto">
    <!-- Genre -->
    <div class="flex flex-wrap gap-3 items-center">
      <div>
        <label class="text-white font-semibold mb-1 block">Genre</label>
        <select
          v-model="localFilters.genre"
          class="px-4 py-2.5 rounded-xl bg-gray-800 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
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
          class="px-4 py-2.5 w-30 rounded-xl bg-gray-800 border border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
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
          class="px-4 py-2.5 rounded-xl w-30 bg-gray-800 border border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
        />
      </div>

      <div>
        <label class="text-white font-semibold mb-1 block">Type</label>
        <select
          v-model="localFilters.type"
          class="px-4 py-2.5 rounded-xl bg-gray-800 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
        >
          <option value="">All</option>
          <option value="movie">Movie</option>
          <option value="tv">Series</option>
        </select>
      </div>

      <div>
        <label class="text-white font-semibold mb-1 block">Sort By</label>
        <select
          v-model="localFilters.sort"
          class="px-4 py-2.5 rounded-xl bg-gray-800 border cursor-pointer border-white/10 text-white font-[Gilroy-Medium] focus:border-[#b20710] focus:outline-none transition-all"
        >
          <option value="">Default</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div class="flex gap-2 md:mt-7">
        <button
          @click="applyFilter"
          class="px-4 py-2 rounded-xl bg-red-600/20 border cursor-pointer border-red-600/50 text-red-400 font-[Gilroy-SemiBold] hover:bg-red-600 hover:text-white transition-all"
        >
          Apply
        </button>
        <button
          @click="clearFilter"
          class="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 cursor-pointer text-white font-[Gilroy-SemiBold] hover:text-white transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { genreNameToId } from "@/types/media";
import { useMediatore } from "@/stores/mediaStore";

const store = useMediatore();

const emit = defineEmits(["apply", "clear"]);

const localFilters = ref({
  genre: "",
  year: null as number | null,
  rating: null as number | null,
  type: "",
  sort: "",
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
    sort: localFilters.value.sort, // ✅ include sort
  };
  emit("apply", appliedFilters);
}

function clearFilter() {
  localFilters.value = {
    genre: "",
    year: null,
    rating: null,
    type: "",
    sort: "", // ✅ reset sort too
  };
  emit("clear");
}
</script>
