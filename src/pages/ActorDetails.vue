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

    <!-- Main Content -->
    <div v-else-if="person" class="px-6 md:px-10 max-w-7xl mx-auto pt-24">
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- PERSON INFO -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <!-- Profile Image -->
        <div>
          <div
            class="relative rounded-2xl overflow-hidden border-2 border-white/10 group"
          >
            <img
              v-if="person.profile_path"
              :src="`https://image.tmdb.org/t/p/w500${person.profile_path}`"
              :alt="person.name"
              class="w-full object-cover"
            />
            <div
              v-else
              class="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-8xl"
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

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- KNOWN FOR -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
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
            <div class="aspect-[2/3]">
              <img
                :src="`https://image.tmdb.org/t/p/w342${item.poster_path}`"
                :alt="item.title || item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- FILMOGRAPHY -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
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
import axios from "axios";

const route = useRoute();
const modalStore = useModalStore();

const person = ref<any>(null);
const knownFor = ref<any[]>([]);
const filmography = ref<any[]>([]);
const loading = ref(true);

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const openModal = (item: any) => {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  modalStore.open(mediaType, { movieId: item.id, mediaType });
};

onMounted(async () => {
  const personId = Number(route.params.id);

  try {
    const [detailsRes, creditsRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/person/${personId}`, {
        params: { api_key: API_KEY },
      }),
      axios.get(
        `https://api.themoviedb.org/3/person/${personId}/combined_credits`,
        { params: { api_key: API_KEY } }
      ),
    ]);

    person.value = detailsRes.data;

    // Known For (top rated)
    knownFor.value = creditsRes.data.cast
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12);

    // Full Filmography
    filmography.value = [...creditsRes.data.cast, ...creditsRes.data.crew].sort(
      (a: any, b: any) => {
        const dateA = new Date(
          a.release_date || a.first_air_date || 0
        ).getTime();
        const dateB = new Date(
          b.release_date || b.first_air_date || 0
        ).getTime();
        return dateB - dateA;
      }
    );
  } catch (error) {
    console.error("Failed to load person details:", error);
  } finally {
    loading.value = false;
  }
});
</script>
