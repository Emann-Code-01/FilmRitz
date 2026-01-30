<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <!-- Hero Section / Backdrop -->
    <div class="relative w-full h-[50vh] md:h-[60vh]">
      <div
        v-if="media"
        class="absolute inset-0 bg-cover bg-center"
        :style="{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})`,
        }"
      >
        <div
          class="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"
        ></div>
      </div>

      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div
          class="animate-spin w-16 h-16 border-4 border-[#b20710] border-t-transparent rounded-full"
        ></div>
      </div>

      <div
        class="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12 max-w-[1440px] mx-auto"
      >
        <h1 class="text-4xl md:text-6xl font-[Gilroy-Bold] mb-4 drop-shadow-lg">
          {{ media?.title || media?.name }}
        </h1>
        <p
          class="text-xl text-gray-300 font-[Gilroy-Medium] max-w-2xl drop-shadow-md line-clamp-2"
        >
          {{ media?.overview }}
        </p>
      </div>
    </div>

    <!-- Watch Options Content -->
    <div class="px-6 md:px-10 max-w-[1440px] mx-auto py-12 -mt-8 relative z-10">
      <!-- Country Selector -->
      <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 class="text-3xl font-[Gilroy-Bold] flex items-center gap-3">
          Available in
          <span
            class="text-sm font-[Gilroy-Medium] bg-white/10 px-3 py-1 rounded-full text-gray-400"
          >
            {{
              countries.find((c) => c.code === activeCountry)?.name ||
              activeCountry
            }}
          </span>
        </h2>

        <div class="relative">
          <select
            v-model="activeCountry"
            class="appearance-none bg-[#141414] border border-white/20 hover:border-[#b20710]/50 rounded-xl pl-4 pr-10 py-3 text-white cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#b20710]"
          >
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.name }}
            </option>
          </select>
          <div
            class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Skeletons -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="n in 3"
          :key="n"
          class="bg-[#141414] rounded-2xl border border-white/5 p-8 animate-pulse"
        >
          <div class="h-6 w-32 bg-white/10 rounded mb-6"></div>
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="i in 6"
              :key="i"
              class="flex flex-col items-center gap-2"
            >
              <div class="w-16 h-16 bg-white/10 rounded-xl"></div>
              <div class="h-2 w-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="providers && providers[activeCountry]" class="space-y-8">
        
        <!-- Share Button -->
        <div class="flex justify-end mb-4">
            <button 
                @click="shareAvailability" 
                class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all border border-white/10 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
                </svg>
                Share
            </button>
        </div>
        
        <!-- Main Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Streaming (Flatrate) -->
          <div
            class="bg-[#141414] rounded-2xl border border-white/5 p-8 hover:border-[#b20710]/30 transition-all"
          >
            <h3
              class="font-[Gilroy-Bold] text-xl mb-6 text-white flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-[#b20710]"
              >
                <path
                  d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                />
              </svg>
              Stream
            </h3>

            <div
              v-if="providers[activeCountry].flatrate"
              class="grid grid-cols-3 sm:grid-cols-4 gap-4"
            >
              <a
                v-for="prov in providers[activeCountry].flatrate"
                :key="prov.provider_id"
                :href="getProviderLink(prov.provider_id)"
                target="_blank"
                rel="noopener noreferrer"
                :title="`Watch on ${prov.provider_name}`"
                class="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div class="relative">
                  <img
                    :src="getProviderLogo(prov.logo_path)"
                    :alt="prov.provider_name"
                    class="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 group-hover:ring-2 ring-[#b20710] transition-all duration-300"
                  />
                  <div class="absolute inset-0 bg-[#b20710]/0 group-hover:bg-[#b20710]/20 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-white">
                          <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
                          <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                      </svg>
                  </div>
                </div>
                <span
                  class="text-xs text-center text-gray-400 font-[Gilroy-Medium] leading-tight group-hover:text-white transition-colors"
                  >{{ prov.provider_name }}</span
                >
              </a>
            </div>
            <div v-else class="text-gray-500 font-[Gilroy-Medium] italic">
              Not available for streaming
            </div>
          </div>

          <!-- Rent -->
          <div
            class="bg-[#141414] rounded-2xl border border-white/5 p-8 hover:border-[#b20710]/30 transition-all"
          >
            <h3
              class="font-[Gilroy-Bold] text-xl mb-6 text-white flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-blue-500"
              >
                <path
                  d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                />
              </svg>
              Rent
            </h3>

            <div
              v-if="providers[activeCountry].rent"
              class="grid grid-cols-3 sm:grid-cols-4 gap-4"
            >
              <a
                v-for="prov in providers[activeCountry].rent"
                :key="prov.provider_id"
                :href="getProviderLink(prov.provider_id)"
                target="_blank"
                rel="noopener noreferrer"
                :title="`Rent on ${prov.provider_name}`"
                class="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div class="relative">
                  <img
                    :src="getProviderLogo(prov.logo_path)"
                    :alt="prov.provider_name"
                    class="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 group-hover:ring-2 ring-blue-500 transition-all duration-300"
                  />
                  <div class="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-white">
                          <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
                          <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                      </svg>
                  </div>
                </div>
                <span
                  class="text-xs text-center text-gray-400 font-[Gilroy-Medium] leading-tight group-hover:text-white transition-colors"
                  >{{ prov.provider_name }}</span
                >
              </a>
            </div>
            <div v-else class="text-gray-500 font-[Gilroy-Medium] italic">
              Not available for rent
            </div>
          </div>

          <!-- Buy -->
          <div
            class="bg-[#141414] rounded-2xl border border-white/5 p-8 hover:border-[#b20710]/30 transition-all"
          >
            <h3
              class="font-[Gilroy-Bold] text-xl mb-6 text-white flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-green-500"
              >
                <path
                  d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z"
                />
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                  clip-rule="evenodd"
                />
              </svg>
              Buy
            </h3>

            <div
              v-if="providers[activeCountry].buy"
              class="grid grid-cols-3 sm:grid-cols-4 gap-4"
            >
              <a
                v-for="prov in providers[activeCountry].buy"
                :key="prov.provider_id"
                :href="getProviderLink(prov.provider_id)"
                target="_blank"
                rel="noopener noreferrer"
                :title="`Buy on ${prov.provider_name}`"
                class="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div class="relative">
                  <img
                    :src="getProviderLogo(prov.logo_path)"
                    :alt="prov.provider_name"
                    class="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 group-hover:ring-2 ring-green-500 transition-all duration-300"
                  />
                  <div class="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/20 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-white">
                          <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
                          <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                      </svg>
                  </div>
                </div>
                <span
                  class="text-xs text-center text-gray-400 font-[Gilroy-Medium] leading-tight group-hover:text-white transition-colors"
                  >{{ prov.provider_name }}</span
                >
              </a>
            </div>
            <div v-else class="text-gray-500 font-[Gilroy-Medium] italic">
              Not available for purchase
            </div>
          </div>

          <!-- Free / Ads (Conditional) -->
          <div
            v-if="providers[activeCountry].free || providers[activeCountry].ads"
            class="bg-[#141414] rounded-2xl border border-white/5 p-8 hover:border-[#b20710]/30 transition-all"
          >
            <h3
              class="font-[Gilroy-Bold] text-xl mb-6 text-white flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-yellow-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                  clip-rule="evenodd"
                />
              </svg>
              Free / Ads
            </h3>

            <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <div
                v-for="prov in [
                  ...(providers[activeCountry].free || []),
                  ...(providers[activeCountry].ads || []),
                ]"
                :key="prov.provider_id"
                class="flex flex-col items-center gap-3 group"
              >
                <div class="relative">
                  <img
                    :src="getProviderLogo(prov.logo_path)"
                    :alt="prov.provider_name"
                    class="w-16 h-16 rounded-xl shadow-lg group-hover:scale-105 group-hover:ring-2 ring-yellow-500 transition-all duration-300"
                  />
                  <div
                    class="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  >
                    FREE
                  </div>
                </div>
                <span
                  class="text-xs text-center text-gray-400 font-[Gilroy-Medium] leading-tight"
                  >{{ prov.provider_name }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-12 text-center border-t border-white/10 pt-8"
          v-if="providers[activeCountry].link"
        >
          <a
            :href="providers[activeCountry].link"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 bg-[#b20710] hover:bg-[#e32125] text-white rounded-full font-[Gilroy-Bold] transition-all mb-4"
          >
            View All Options on TMDB
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <p class="text-sm text-gray-500 mb-2">
            Streaming data provided by
            <a
              href="https://www.justwatch.com"
              target="_blank"
              class="text-[#b20710] hover:underline"
              >JustWatch</a
            >.
          </p>
          <p class="text-xs text-gray-600">
            Content availability is subject to change. Please verify with the
            service provider directly.
          </p>
        </div>
      </div>

      <div
        v-else-if="!loading"
        class="mt-12 text-center py-20 bg-[#141414] rounded-2xl border border-white/5"
      >
        <div class="text-6xl mb-6">🌍</div>
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">
          No Streaming Info for
          {{
            countries.find((c) => c.code === activeCountry)?.name ||
            activeCountry
          }}
        </h2>
        <p class="text-gray-400 max-w-md mx-auto mb-8 font-[Gilroy-Medium]">
          We couldn't find any streaming providers for this title in
          {{
            countries.find((c) => c.code === activeCountry)?.name ||
            activeCountry
          }}
          right now.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="$router.back()"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-[Gilroy-Bold] transition-all"
          >
            Go Back
          </button>
          <button
            @click="activeCountry = 'US'"
            v-if="activeCountry !== 'US'"
            class="px-6 py-3 bg-[#b20710]/20 hover:bg-[#b20710]/30 text-[#b20710] rounded-full font-[Gilroy-Bold] transition-all"
          >
            Try US Region
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { getMediaDetails } from "@/api/tmdb";
import { getProviderUrl } from "@/utils/providerUrls";

const route = useRoute();
const loading = ref(true);
const media = ref<any>(null);
const providers = ref<any>(null);
const activeCountry = ref("US");

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "NG", name: "Nigeria" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
];

useHead({
  title: "Where to Watch — FilmRitz",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const addToHistory = (item: any) => {
  try {
    const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");
    const filtered = history.filter((h: any) => h.id !== item.id);
    const newEntry = {
      ...item,
      watchedAt: Date.now(),
    };
    const updated = [newEntry, ...filtered].slice(0, 50);
    localStorage.setItem("watchHistory", JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save history:", err);
  }
};

const getProviderLogo = (path: string) =>
  `https://image.tmdb.org/t/p/original${path}`;

const getProviderLink = (providerId: number): string => {
  const url = getProviderUrl(providerId);
  return url || "#";
};

const shareAvailability = async () => {
  const mediaTitle = media.value?.title || media.value?.name || "this content";
  const countryName = countries.find(c => c.code === activeCountry.value)?.name || activeCountry.value;
  
  const shareData = {
    title: `Where to Watch ${mediaTitle}`,
    text: `Check out where you can watch "${mediaTitle}" in ${countryName} on FilmRitz!`,
    url: window.location.href,
  };

  try {
    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing", err);
  }
};

onMounted(async () => {
  const mediaId = route.params.id;
  const mediaType = (route.query.type as "movie" | "tv") || "movie";

  if (!mediaId) {
    loading.value = false;
    return;
  }

  try {
    const id = mediaId.toString().split("-").pop();
    if (id) {
      // Parallel fetch details and providers
      const [details, watchProviders] = await Promise.all([
        getMediaDetails(Number(id), mediaType),
        import("@/api/tmdb").then((m) =>
          m.getWatchProviders(Number(id), mediaType),
        ),
      ]);

      media.value = details;

      if (watchProviders && watchProviders.results) {
        providers.value = watchProviders.results;
      } else {
        providers.value = watchProviders;
      }

      if (media.value) {
        addToHistory({
          id: media.value.id,
          title: media.value.title || media.value.name,
          name: media.value.name || media.value.title,
          poster_path: media.value.poster_path,
          overview: media.value.overview,
          media_type: mediaType,
          vote_average: media.value.vote_average,
          release_date: media.value.release_date || media.value.first_air_date,
        });
      }
    }
  } catch (error) {
    console.error("Failed to load media:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>

<style scoped></style>
