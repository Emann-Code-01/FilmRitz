<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="px-6 md:px-10 max-w-7xl mx-auto pt-24">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="h-96 bg-gray-800/50 rounded-2xl animate-pulse"></div>
        <div class="md:col-span-2 space-y-4">
          <div class="h-12 bg-gray-800/50 rounded animate-pulse"></div>
          <div class="h-32 bg-gray-800/50 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="px-6 md:px-10 max-w-7xl mx-auto pt-24">
      <div class="text-center py-20">
        <p class="text-2xl text-gray-400">Actor not found</p>
        <router-link to="/ng" class="text-[#b20710] hover:underline mt-4 block">
          Back to Home
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="person" class="px-6 md:px-10 max-w-7xl mx-auto pt-24">
      <!-- PERSON INFO -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <!-- Profile Image -->
        <div>
          <div
            class="relative rounded-2xl overflow-hidden border-2 border-white/10 group"
          >
            <img
              v-if="person.profile_path"
              :src="getPoster(person.profile_path, 'w500')"
              :alt="person.name"
              class="w-full object-cover"
            />
            <div
              v-else
              class="w-full aspect-2/3 bg-gray-800 flex items-center justify-center text-8xl"
            >
              👤
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="mt-6 space-y-3">
            <div class="bg-white/5 rounded-xl p-4 border border-white/10">
              <p class="text-gray-400 text-sm font-[Gilroy-Medium] mb-1">
                Known For
              </p>
              <p class="text-white font-[Gilroy-Bold]">
                {{ person.known_for_department }}
              </p>
            </div>

            <div
              v-if="person.birthday"
              class="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <p class="text-gray-400 text-sm font-[Gilroy-Medium] mb-1">
                Birthday
              </p>
              <p class="text-white font-[Gilroy-Bold]">
                {{
                  new Date(person.birthday).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}
              </p>
            </div>

            <div
              v-if="person.place_of_birth"
              class="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <p class="text-gray-400 text-sm font-[Gilroy-Medium] mb-1">
                Place of Birth
              </p>
              <p class="text-white font-[Gilroy-Bold]">
                {{ person.place_of_birth }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bio & Details -->
        <div class="md:col-span-2">
          <h1 class="text-5xl font-[Gilroy-Bold] mb-4">{{ person.name }}</h1>

          <div v-if="person.biography" class="mb-8">
            <h2 class="text-2xl font-[Gilroy-Bold] mb-4">Biography</h2>
            <p class="text-gray-300 font-[Gilroy-Regular] leading-relaxed">
              {{ person.biography }}
            </p>
          </div>
        </div>
      </div>

      <!-- KNOWN FOR -->
      <div v-if="knownFor.length" class="mb-12">
        <h2 class="text-3xl font-[Gilroy-Bold] mb-6">Known For</h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          <div
            v-for="item in knownFor"
            :key="item.id"
            @click="openModal(item)"
            class="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b20710]/50 transition-all hover:scale-105"
          >
            <div class="aspect-2/3">
              <img
                :src="getPoster(item.poster_path, 'w342')"
                :alt="item.title || item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- FILMOGRAPHY -->
      <div v-if="filmography.length">
        <h2 class="text-3xl font-[Gilroy-Bold] mb-6">Filmography</h2>
        <div class="space-y-3">
          <div
            v-for="item in filmography.slice(0, 20)"
            :key="item.id"
            @click="openModal(item)"
            class="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-[#b20710]/50 transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-[Gilroy-Bold] text-white">
                  {{ item.title || item.name }}
                </h3>
                <p class="text-gray-400 font-[Gilroy-Medium] text-sm">
                  {{ item.character || item.job }} •
                  {{
                    new Date(
                      item.release_date || item.first_air_date || ""
                    ).getFullYear() || "TBA"
                  }}
                </p>
              </div>
              <span class="text-yellow-400">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import {
  getPoster,
  getActorDetails,
  getActorCredits,
  searchMulti,
} from "@/api/tmdb";

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  birthday: string | null;
  place_of_birth: string | null;
  biography: string;
}

interface Credit {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  character?: string;
  job?: string;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
}

const route = useRoute();
const modalStore = useModalStore();

const person = ref<Person | null>(null);
const knownFor = ref<Credit[]>([]);
const filmography = ref<Credit[]>([]);
const loading = ref(true);
const notFound = ref(false);

const openModal = (item: Credit) => {
  const mediaType = (item.media_type || (item.title ? "movie" : "tv")) as "movie" | "tv";
  modalStore.open(mediaType, { movieId: item.id, mediaType });
};

onMounted(async () => {
  const actorName = route.params.name as string;

  try {
    // 1. Search actor by name
    const searchResults = await searchMulti(actorName);
    const actor = searchResults.find((r: any) => r.media_type === "person");

    if (!actor) {
      notFound.value = true;
      loading.value = false;
      return;
    }

    const actorId = actor.id;

    // 2. Fetch actor details and credits
    person.value = await getActorDetails(actorId);
    const credits = await getActorCredits(actorId);

    // Known For (top rated/popular)
    knownFor.value = credits
      .sort((a: Credit, b: Credit) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12);

    // Full Filmography
    filmography.value = [...credits].sort((a: Credit, b: Credit) => {
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Failed to load actor details:", error);
    notFound.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped></style>
