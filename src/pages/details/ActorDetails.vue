<template>
  <div class="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white pb-20 px-4 md:px-10">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-[1230px] lg:max-w-[1440px] mx-auto pt-24 px-4">
      <div class="grid md:grid-cols-12 gap-6 lg:gap-8">
        <div class="md:col-span-4 lg:col-span-3">
          <div class="h-96 lg:h-[500px] bg-gray-800/50 rounded-2xl animate-pulse" />
        </div>
        <div class="md:col-span-8 lg:col-span-9 space-y-4">
          <div class="h-12 bg-gray-800/50 rounded-xl animate-pulse" />
          <div class="h-32 bg-gray-800/50 rounded-xl animate-pulse" />
          <div class="h-24 bg-gray-800/50 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="notFound" class="max-w-[1230px] lg:max-w-[1440px] mx-auto pt-24 px-4">
      <div class="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
        <p class="text-2xl lg:text-3xl font-[Gilroy-Bold] text-white mb-2">
          Actor Not Found
        </p>
        <p class="text-gray-400 font-[Gilroy-Regular] mb-6">
          We couldn't find the actor you're looking for
        </p>
        <router-link to="/ng"
          class="inline-flex items-center gap-2 px-4 py-3 bg-[#b20710] hover:bg-[#8f0509] text-white font-[Gilroy-Bold] rounded-xl transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd"
              d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
              clip-rule="evenodd" />
          </svg>
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Actor Details -->
    <div v-else-if="person" class="max-w-[1230px] lg:max-w-[1440px] mx-auto pt-20 lg:pt-24 px-4">
      <!-- Hero Section -->
      <div class="grid md:grid-cols-12 gap-6 lg:gap-8 mb-12 lg:mb-16">
        <!-- Profile Image & Core Identity -->
        <div class="md:col-span-4 lg:col-span-3">
          <div class="sticky top-24 space-y-4 lg:space-y-6">
            <!-- Profile Image -->
            <div class="relative rounded-2xl overflow-hidden border-2 border-white/10 group shadow-2xl">
              <img v-if="person.profile_path" :src="getPoster(person.profile_path, 'w500')" :alt="person.name"
                class="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else
                class="w-full aspect-2/3 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl lg:text-8xl">
                👤
              </div>
            </div>

            <!-- Core Identity Cards -->
            <div class="space-y-3">
              <!-- Professions -->
              <div
                class="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p class="text-gray-400 text-xs lg:text-sm font-[Gilroy-Medium] mb-2 uppercase tracking-wider">
                  Profession
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="dept in getDepartments()" :key="dept"
                    class="px-3 py-1 bg-[#b20710]/20 border border-[#b20710]/30 text-[#ff4444] rounded-full font-[Gilroy-SemiBold] text-sm">
                    {{ dept }}
                  </span>
                </div>
              </div>

              <!-- Gender -->
              <div v-if="person.gender"
                class="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p class="text-gray-400 text-xs lg:text-sm font-[Gilroy-Medium] mb-1 uppercase tracking-wider">
                  Gender
                </p>
                <p class="text-white font-[Gilroy-Bold] text-base lg:text-lg">
                  {{ getGender(person.gender) }}
                </p>
              </div>

              <!-- Birthday & Age -->
              <div v-if="person.birthday"
                class="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#b20710]/30 transition-all duration-300">
                <p class="text-gray-400 text-xs lg:text-sm font-[Gilroy-Medium] mb-1 uppercase tracking-wider">
                  Born
                </p>
                <p class="text-white font-[Gilroy-Bold] text-base lg:text-lg">
                  {{
                    new Date(person.birthday).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                </p>
                <p class="text-gray-400 text-sm font-[Gilroy-Regular] mt-1">
                  {{ calculateAge(person.birthday) }} years old
                </p>
              </div>

              <!-- Place of Birth -->
              <div v-if="person.place_of_birth"
                class="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#b20710]/30 transition-all duration-300">
                <p class="text-gray-400 text-xs lg:text-sm font-[Gilroy-Medium] mb-1 uppercase tracking-wider">
                  Place of Birth
                </p>
                <p class="text-white font-[Gilroy-Bold] text-base">
                  {{ person.place_of_birth }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-8 lg:col-span-9">
          <div class="space-y-6 lg:space-y-8">
            <!-- Name & Title -->
            <div class="space-y-2">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-[Gilroy-Bold] text-white leading-tight">
                {{ person.name }}
              </h1>
              <p class="text-lg text-gray-400 font-[Gilroy-Medium]">
                {{ person.known_for_department }}
              </p>
            </div>

            <!-- Biography with Read More -->
            <div
              class="bg-linear-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
              <h2 class="text-2xl lg:text-3xl font-[Gilroy-Bold] mb-4 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="w-7 h-7 text-[#b20710]">
                  <path
                    d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                Biography
              </h2>
              <div class="space-y-4">
                <p v-if="!person.biography" class="text-gray-400 italic text-sm lg:text-base">
                  No biography available for this person yet.
                </p>

                <div v-else>
                  <p v-for="(paragraph, index) in getBiographyParagraphs()" :key="index"
                    v-show="showFullBio || index < 2"
                    class="text-gray-300 font-[Gilroy-Regular] leading-relaxed text-sm lg:text-base">
                    {{ paragraph }}
                  </p>
                  <button v-if="getBiographyParagraphs().length > 2" @click="showFullBio = !showFullBio"
                    class="mt-4 text-[#b20710] hover:text-[#ff4444] font-[Gilroy-SemiBold] text-sm flex items-center gap-2 transition-all cursor-pointer">
                    {{ showFullBio ? "Read Less" : "Read More" }}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      class="w-4 h-4 transition-transform duration-300" :class="showFullBio ? 'rotate-180' : ''">
                      <path fill-rule="evenodd"
                        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Known For Carousel -->
    <div v-if="knownFor.length" class="mb-12 lg:mb-16 max-w-[1230px] lg:max-w-[1440px] mx-auto pt-4 px-4">
      <div class="flex items-center justify-between mb-6 lg:mb-8">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="w-8 h-8 text-[#b20710]">
            <path fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clip-rule="evenodd" />
          </svg>
          <h2 class="text-2xl lg:text-3xl font-[Gilroy-Bold]">Known For</h2>
        </div>
      </div>
      <div class="relative">
        <div class="flex gap-3 lg:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          <div v-for="item in knownFor" :key="item.id" @click="openModal(item)"
            class="shrink-0 w-[140px] sm:w-40 md:w-[180px] lg:w-[200px] snap-start group cursor-pointer">
            <div
              class="relative rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#b20710]/20">
              <div class="aspect-2/3 relative">
                <img v-if="item.poster_path" :src="getPoster(item.poster_path, 'w342')" :alt="item.title || item.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div v-else
                  class="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl">
                </div>
                <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <p class="text-white font-[Gilroy-Bold] text-xs lg:text-sm line-clamp-2 mb-1">
                    {{ item.title || item.name }}
                  </p>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="text-yellow-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16" fill="currentColor" class="size-4">
                        <path fill-rule="evenodd"
                          d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ item.vote_average?.toFixed(1) }}</span>
                    <span class="text-gray-300">{{
                      new Date(
                        item.release_date || item.first_air_date || "",
                      ).getFullYear()
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filmography Tabs -->
    <div class="mb-12 lg:mb-16 max-w-[1230px] lg:max-w-[1440px] mx-auto pt-4 px-4">
      <div class="flex items-center justify-between mb-6 lg:mb-8">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="w-8 h-8 text-[#b20710]">
            <path
              d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
          </svg>
          <h2 class="text-2xl lg:text-3xl font-[Gilroy-Bold]">Filmography</h2>
        </div>

        <!-- Sort Dropdown -->
        <div class="relative">
          <select v-model="sortOrder" class="bg-gray-800 rounded px-3 py-1 outline-none cursor-pointer">
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto">
        <button @click="activeTab = 'movies'" :class="[
          'px-4 py-3 rounded-xl font-[Gilroy-Bold] text-sm transition-all whitespace-nowrap cursor-pointer',
          activeTab === 'movies'
            ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white',
        ]">
          Movies ({{ movieCredits.length }})
        </button>
        <button @click="activeTab = 'tv'" :class="[
          'px-4 py-3 rounded-xl font-[Gilroy-Bold] text-sm transition-all whitespace-nowrap cursor-pointer',
          activeTab === 'tv'
            ? 'bg-[#b20710] text-white shadow-lg shadow-[#b20710]/50'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white',
        ]">
          TV Shows ({{ tvCredits.length }})
        </button>
      </div>

      <!-- Filmography List -->
      <div class="space-y-3">
        <div v-for="item in displayedFilmography" :key="item.id + item.credit_id" @click="openModal(item)"
          class="bg-linear-to-r from-white/5 to-transparent hover:from-white/10 hover:to-transparent backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/10 hover:border-[#b20710]/50 transition-all duration-300 cursor-pointer group">
          <div class="flex items-start gap-4">
            <div class="shrink-0 w-12 h-16 lg:w-16 lg:h-20 rounded-lg overflow-hidden border border-white/20">
              <img v-if="item.poster_path" :src="getPoster(item.poster_path, 'w92')" :alt="item.title || item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div v-else
                class="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xl">
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3
                class="text-base lg:text-lg font-[Gilroy-Bold] text-white group-hover:text-[#b20710] transition-colors line-clamp-1">
                {{ item.title || item.name }}
              </h3>
              <p class="text-gray-400 font-[Gilroy-Medium] text-xs lg:text-sm mt-1">
                <span class="text-white">{{ item.character || item.job }}</span>
                <span v-if="item.character" class="mx-2 text-gray-600">•</span>
                <span v-if="item.character" :class="getRoleTypeColor(item)">{{
                  getRoleType(item)
                }}</span>
                <span class="mx-2">•</span>
                <span>{{
                  new Date(
                    item.release_date || item.first_air_date || "",
                  ).getFullYear() || "TBA"
                }}</span>
              </p>
            </div>
            <div class="shrink-0 flex items-center gap-2">
              <span v-if="item.vote_average"
                class="text-yellow-400 text-sm lg:text-base font-[Gilroy-Bold] flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                  <path fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd" />
                </svg>
                {{ item.vote_average?.toFixed(1) }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-5 h-5 text-gray-400 group-hover:text-[#b20710] transition-colors opacity-0 group-hover:opacity-100">
                <path fill-rule="evenodd"
                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Show More Button -->
      <div v-if="currentFilmography.length > itemsToShow" class="mt-6 text-center">
        <button @click="itemsToShow += 20"
          class="px-8 py-3 bg-linear-to-r from-[#b20710] to-[#8f0509] hover:from-[#8f0509] hover:to-[#b20710] text-white font-[Gilroy-Bold] rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#b20710]/50 inline-flex items-center gap-2 cursor-pointer">
          Load More ({{ currentFilmography.length - itemsToShow }} remaining)
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd"
              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import {
  getPoster,
  getActorDetails,
  getActorCredits,
  searchMulti,
} from "@/api/tmdb";
import type { Person, Credit } from "@/types/media";

const route = useRoute();
const modalStore = useModalStore();

const person = ref<Person | null>(null);
const knownFor = ref<Credit[]>([]);
const movieCredits = ref<Credit[]>([]);
const tvCredits = ref<Credit[]>([]);
const externalIds = ref<any>({});
const loading = ref(true);
const notFound = ref(false);
const showFullBio = ref(false);
const activeTab = ref<"movies" | "tv">("movies");
const sortOrder = ref<"popular" | "newest" | "oldest">("popular");
const itemsToShow = ref(20);
const showStickyHeader = ref(false);

// Computed properties
const currentFilmography = computed(() => {
  const credits =
    activeTab.value === "movies" ? movieCredits.value : tvCredits.value;

  return [...credits].sort((a, b) => {
    if (sortOrder.value === "popular") {
      return (b.popularity || 0) - (a.popularity || 0);
    } else if (sortOrder.value === "newest") {
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
      return dateB - dateA;
    } else {
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
      return dateA - dateB;
    }
  });
});

const displayedFilmography = computed(() => {
  return currentFilmography.value.slice(0, itemsToShow.value);
});

// const careerSpan = computed(() => {
//   if (!person.value) return null;
//   const allDates = [...movieCredits.value, ...tvCredits.value]
//     .map((c) =>
//       new Date(c.release_date || c.first_air_date || "").getFullYear()
//     )
//     .filter((year) => !isNaN(year) && year > 0);

//   if (allDates.length === 0) return null;

//   const firstYear = Math.min(...allDates);
//   const lastYear = Math.max(...allDates);

//   return firstYear === lastYear ? `${firstYear}` : `${firstYear}–present`;
// });

// const hasSocialLinks = computed(() => {
//   return !!(
//     externalIds.value.instagram_id ||
//     externalIds.value.twitter_id ||
//     externalIds.value.imdb_id
//   );
// });

// Methods
const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const getGender = (gender: number): string => {
  const genderMap: { [key: number]: string } = {
    0: "Not specified",
    1: "Female",
    2: "Male",
    3: "Non-binary",
  };
  return genderMap[gender] || "Not specified";
};

const getDepartments = (): string[] => {
  if (!person.value) return [];
  const departments = new Set<string>();

  if (person.value.known_for_department) {
    departments.add(person.value.known_for_department);
  }

  [...movieCredits.value, ...tvCredits.value].forEach((credit) => {
    if (credit.job && !credit.character) {
      if (credit.job.includes("Director")) departments.add("Directing");
      if (credit.job.includes("Producer")) departments.add("Production");
      if (credit.job.includes("Writer")) departments.add("Writing");
    }
  });

  return Array.from(departments).slice(0, 3);
};

const getBiographyParagraphs = (): string[] => {
  if (!person.value?.biography) return [];

  return person.value.biography
    .split(/\n+/) // handles \n, \n\n, \n\n\n
    .map((p) => p.trim())
    .filter(Boolean);
};

const getRoleType = (credit: Credit): string => {
  if (!credit.order) return "Supporting";
  if (credit.order <= 2) return "Lead";
  if (credit.order <= 5) return "Main";
  if (credit.order <= 15) return "Supporting";
  return "Guest";
};

const getRoleTypeColor = (credit: Credit): string => {
  const type = getRoleType(credit);
  if (type === "Lead") return "text-[#b20710] font-semibold";
  if (type === "Main") return "text-[#ff4444]";
  if (type === "Supporting") return "text-gray-300";
  return "text-gray-400";
};

const openModal = (item: Credit) => {
  const mediaType = (item.media_type || (item.title ? "movie" : "tv")) as
    | "movie"
    | "tv";
  modalStore.open(mediaType, { movieId: item.id, mediaType });
};

const handleScroll = () => {
  showStickyHeader.value = window.scrollY > 400;
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);

  try {
    const actorId = route.query.id as string;

    if (actorId) {
      person.value = await getActorDetails(parseInt(actorId));
      const credits = await getActorCredits(parseInt(actorId));

      movieCredits.value = credits.filter(
        (c: Credit) => c.media_type === "movie" || c.title,
      );
      tvCredits.value = credits.filter(
        (c: Credit) => c.media_type === "tv" || c.name,
      );

      knownFor.value = credits
        .sort((a: Credit, b: Credit) => {
          const scoreA = (a.popularity || 0) * (a.vote_average || 0);
          const scoreB = (b.popularity || 0) * (b.vote_average || 0);
          return scoreB - scoreA;
        })
        .slice(0, 8);

      // Fetch external IDs if available
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${actorId}/external_ids?api_key=${import.meta.env.VITE_TMDB_API_KEY
          }`,
        );
        externalIds.value = await response.json();
      } catch (error) {
        console.error("Failed to load external IDs:", error);
      }
    } else {
      const actorName = route.params.name as string;
      const searchResults = await searchMulti(actorName);
      const actor = searchResults.find((r: any) => r.media_type === "person");

      if (!actor) {
        notFound.value = true;
        loading.value = false;
        return;
      }

      person.value = await getActorDetails(actor.id);
      const credits = await getActorCredits(actor.id);

      movieCredits.value = credits.filter(
        (c: Credit) => c.media_type === "movie" || c.title,
      );
      tvCredits.value = credits.filter(
        (c: Credit) => c.media_type === "tv" || c.name,
      );

      knownFor.value = credits
        .sort((a: Credit, b: Credit) => {
          const scoreA = (a.popularity || 0) * (a.vote_average || 0);
          const scoreB = (b.popularity || 0) * (b.vote_average || 0);
          return scoreB - scoreA;
        })
        .slice(0, 8);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${actor.id
          }/external_ids?api_key=${import.meta.env.VITE_TMDB_API_KEY}`,
        );
        externalIds.value = await response.json();
      } catch (error) {
        console.error("Failed to load external IDs:", error);
      }
    }
  } catch (error) {
    console.error("Failed to load actor details:", error);
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped></style>
