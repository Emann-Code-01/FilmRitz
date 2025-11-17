<template>
  <nav :class="[
    auth.isLoggedIn
      ? 'fixed top-0 left-0 w-full py-5 px-6 z-50 flex items-center justify-between transition-all duration-500 ease-out'
      : 'fixed top-0 left-0 w-full py-5 xl:px-32 px-5 z-50 flex items-center justify-between transition-all duration-500 ease-out',
    scrolled ? 'bg-black/90 backdrop-blur-xl shadow-lg' : 'bg-transparent',
  ]">
    <div class="flex justify-center items-center gap-3">
      <router-link to="/ng" class="cusor-pointer">
        <img loading="lazy" :src="currentLogo" alt="Filmritz Logo" :class="auth.isLoggedIn
          ? 'transition-all duration-900 animate-fade-up w-18'
          : 'transition-all duration-900 animate-fade-up w-19'
          " />
      </router-link>
      <div v-if="auth.isLoggedIn">
        <div class="hidden xl:flex xl:space-x-6 transition duration-500 animate-fade-up">
          <router-link to="/ng" :class="[
            isActiveLink('/ng')
              ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
              : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
          ]">Home</router-link>
          <router-link to="/ng/tv-shows" :class="[
            isActiveLink('/ng/tv-shows')
              ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
              : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
          ]">My TV Shows</router-link>
          <router-link to="/ng/movies" :class="[
            isActiveLink('/ng/movies')
              ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
              : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
          ]">My Movies</router-link>
          <router-link to="/ng/watchlist" :class="[
            isActiveLink('/ng/watchlist')
              ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
              : 'hover:text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
          ]">My Watchlist</router-link>
        </div>
      </div>
    </div>
    <div v-if="
      router.currentRoute.value.path.startsWith('/ng') &&
      router.currentRoute.value.path !== '/ng/login'
    " class="hidden md:flex xl:flex pr-2 transition duration-500 animate-fade-up cursor-pointer">
      <SearchBar />
    </div>
    <div v-if="
      router.currentRoute.value.path.startsWith('/ng') &&
      router.currentRoute.value.path !== '/ng/login'
    " class="flex items-center gap-5 transition-all animate-fade-up duration-900">
      <button class="flex md:hidden cursor-pointer" type="button" @click="openModal">
        <i class="pi pi-search text-gray-300 text-xl"></i>
      </button>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-9999">
          <!-- Remove the full-page overlay if you only want it over the navbar -->
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 -translate-y-5"
            enter-to="opacity-100 translate-y-0" leave="duration-200 ease-in" leave-from="opacity-100 translate-y-0"
            leave-to="opacity-0 -translate-y-5">
            <div class="fixed top-0 left-0 w-full z-9999 h-18 pt-2.5 items-center justify-center backdrop-blur-md">
              <SearchBar @close="closeModal" />
            </div>
          </TransitionChild>
        </Dialog>
      </TransitionRoot>
      <div class="flex space-x-4" v-if="router.currentRoute.value.path !== '/ng/login' || auth.isLoggedIn">
        <div v-if="
          !auth.isLoggedIn && router.currentRoute.value.path !== '/ng/login'
        ">
          <router-link to="/ng/login"
            class="px-6 py-3 rounded bg-[#b20710] hover:bg-[#e32125] text-white font-[Gilroy-SemiBold] transition-all animate-fade-up duration-900">
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
import Logo from "/filmritzlogo2.png";
import Logo2 from "/filmritzlogo3.png";
import { ref, onUnmounted, onMounted, onBeforeUnmount } from "vue";
import SearchBar from "../media/SearchBar.vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter, useRoute } from "vue-router";
import Profile from "../../views/Profile.vue";
import { TransitionRoot, TransitionChild, Dialog } from "@headlessui/vue";
import "swiper/css";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const scrolled = ref(false);
const isOpen = ref(false);

const searchInput = ref<HTMLInputElement | null>(null);

const currentLogo = ref(Logo);

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

function handleScroll() {
  scrolled.value = window.scrollY > window.innerHeight * 0.08;
}

function updateLogo() {
  currentLogo.value = window.innerWidth <= 640 ? Logo2 : Logo;
}

onMounted(() => {
  updateLogo();
  window.addEventListener("resize", updateLogo);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateLogo);
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

onMounted(() => {
  window.addEventListener("keydown", handleShortcut);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleShortcut);
});
</script>
