<template>
  <nav class=""
    :class="{ 'absolute top-0 left-0 w-full py-5 px-5 z-50 flex items-center justify-between transition-all animate-ease-out duration-500': auth.isLoggedIn, 'absolute top-0 left-0 w-full py-5 z-50 xl:px-32 px-5 flex items-center justify-between transition-all animate-ease-out duration-500': !auth.isLoggedIn }">
    <div class="flex justify-center items-center">
      <img :src="Logo" alt="Filmritz Logo" class="transition-all duration-900 animate-fade-up w-44" />
      <!-- <img :src="Logo2" alt="Filmritz Logo" class="md:hidden transition-all duration-900 animate-fade-up w-44" /> -->
      <div v-if="auth.isLoggedIn">
        <div class="hidden xl:flex xl:space-x-6 transition duration-500 animate-fade-up">
          <router-link to="/ng"
            :class="[isActiveLink('/ng') ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in' : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false']">Home</router-link>
          <router-link to="/ng/tvshows"
            :class="[isActiveLink('/ng/tvshows') ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in' : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false']">My
            TV Shows</router-link>
          <router-link to="/ng/movies"
            :class="[isActiveLink('/ng/movies') ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in' : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false']">My
            Movies</router-link>
          <router-link to="/ng/new&popular"
            :class="[isActiveLink('/ng/new&popular') ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in' : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false']">New
            &
            Popular</router-link>
          <router-link to="/ng/watchlist"
            :class="[isActiveLink('/ng/watchlist') ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in' : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false']">My
            Watchlist</router-link>
        </div>
      </div>
    </div>
    <div v-if="auth.isLoggedIn" class="hidden md:flex transition duration-500 animate-fade-up">
      <div class="relative w-96 mx-auto">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300"
          :class="{ 'opacity-0 translate-x-2': query }"></i>
        <i v-if="query"
          class="pi pi-times absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white"
          @click="query = ''"></i>
        <input ref="searchInput" v-model="query" type="text" placeholder="Search"
          class="w-full pl-10 pr-8 py-2 bg-[#0F1117] text-white rounded-xl border border-gray-600 focus:border-[#E50914] outline-none transition-all duration-300"
          @focus="focused = true" @blur="focused = false" />
        <span v-if="!query"
          class="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-300"
          :class="{ 'opacity-0': focused }">
          Search ( / )
        </span>
      </div>
    </div>
    <div class="flex">
      <div class="flex space-x-4" v-if="router.currentRoute.value.path === '/ng' || auth.isLoggedIn">
        <div v-if="!auth.isLoggedIn && router.currentRoute.value.path === '/ng'">
          <router-link to="/ng/login"
            class="px-6 py-3 rounded bg-[#b20710] hover:bg-[#e32125] text-white font-[Gilroy-SemiBold] transition-all animate-fade-up duration-500">
            Sign In
          </router-link>
        </div>

        <div v-else
          class="flex justify-between items-center text-white transition-all duration-900 animate-fade-up relative">
          <Profile />
          <!--make sure you change the user icon to allow users input their own profile picture-->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Logo from '../../assets/filmritzlogo.svg';
// import Logo2 from '../../assets/FR logo.svg';
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter, useRoute } from "vue-router";
import Profile from '../../views/Profile.vue';
import 'swiper/css';


const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const query = ref("");
const focused = ref(false);

const searchInput = ref<HTMLInputElement | null>(null);

const isActiveLink = (routePath: string): boolean => {
  return route.path === routePath;
};
const handleShortcut = (e: KeyboardEvent) => {
  if (e.key === "/") {
    e.preventDefault();
    searchInput.value?.focus();
  }

  if (e.key === "Escape") {
    searchInput.value?.blur();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleShortcut);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleShortcut);
});
</script>
