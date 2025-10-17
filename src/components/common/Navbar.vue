<template>
  <nav
    class=""
    :class="{
      'absolute top-0 left-0 w-full py-5 px-5 z-50 flex items-center justify-between transition-all animate-ease-out duration-500':
        auth.isLoggedIn,
      'absolute top-0 left-0 w-full py-5 z-50 xl:px-32 px-5 flex items-center justify-between transition-all animate-ease-out duration-500':
        !auth.isLoggedIn,
    }"
  >
    <div class="flex justify-center items-center">
      <img
        :src="Logo"
        alt="Filmritz Logo"
        class="transition-all duration-900 animate-fade-up w-44 -ml-10"
      />
      <!-- <img :src="Logo2" alt="Filmritz Logo" class="md:hidden transition-all duration-900 animate-fade-up w-44" /> -->
      <div v-if="auth.isLoggedIn">
        <div
          class="hidden xl:flex xl:space-x-6 transition duration-500 animate-fade-up"
        >
          <router-link
            to="/ng"
            :class="[
              isActiveLink('/ng')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >Home</router-link
          >
          <router-link
            to="/ng/tvshows"
            :class="[
              isActiveLink('/ng/tvshows')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >My TV Shows</router-link
          >
          <router-link
            to="/ng/movies"
            :class="[
              isActiveLink('/ng/movies')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >My Movies</router-link
          >
          <router-link
            to="/ng/new&popular"
            :class="[
              isActiveLink('/ng/new&popular')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >New & Popular</router-link
          >
          <router-link
            to="/ng/watchlist"
            :class="[
              isActiveLink('/ng/watchlist')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >My Watchlist</router-link
          >
        </div>
      </div>
    </div>
    <div
      v-if="!auth.isLoggedIn && router.currentRoute.value.path === '/ng'"
      class="hidden md:flex xl:flex pr-2 transition duration-500 animate-fade-up cursor-pointer"
    >
      <SearchBar />
    </div>
    <div class="flex xl:gap-8 items-center gap-5">
      <button
        class="flex md:hidden cursor-pointer"
        type="button"
        @click="openModal"
      >
        <i class="pi pi-search text-gray-300 text-xl"></i>
      </button>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-[9999]">
          <!-- Remove the full-page overlay if you only want it over the navbar -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 -translate-y-5"
            enter-to="opacity-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 translate-y-0"
            leave-to="opacity-0 -translate-y-5"
          >
            <div class="fixed top-5 left-0 w-full z-[9999] backdrop-blur-md">
              <SearchBar @close="closeModal" />
            </div>
          </TransitionChild>
        </Dialog>
      </TransitionRoot>
      <div
        class="flex space-x-4"
        v-if="router.currentRoute.value.path === '/ng' || auth.isLoggedIn"
      >
        <div
          v-if="!auth.isLoggedIn && router.currentRoute.value.path === '/ng'"
        >
          <router-link
            to="/ng/login"
            class="px-6 py-3 rounded bg-[#b20710] hover:bg-[#e32125] text-white font-[Gilroy-SemiBold] transition-all animate-fade-up duration-500"
          >
            Sign In
          </router-link>
        </div>

        <div
          v-else
          class="flex justify-between items-center text-white transition-all duration-900 animate-fade-up relative"
        >
          <Profile />
          <!--make sure you change the user icon to allow users input their own profile picture-->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Logo from "../../assets/filmritzlogo.svg";
// import Logo2 from '../../assets/FR logo.svg';
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import SearchBar from "../movies/SearchBar.vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter, useRoute } from "vue-router";
import Profile from "../../views/Profile.vue";
import { TransitionRoot, TransitionChild, Dialog } from "@headlessui/vue";
import "swiper/css";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const query = ref("");
const focused = ref(false);
const isOpen = ref(false);

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

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

onMounted(() => {
  window.addEventListener("keydown", handleShortcut);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleShortcut);
});
</script>
