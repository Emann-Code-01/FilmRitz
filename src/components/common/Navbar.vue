<template>
  <nav
    :class="[
      auth.isLoggedIn &&
      router.currentRoute.value.path !== '/forgot-password' &&
      router.currentRoute.value.path !== '/reset-password'
        ? 'fixed top-0 left-0 w-full py-5 px-6 z-50 flex items-center justify-between transition-all duration-500 ease-out'
        : 'fixed top-0 left-0 w-full py-5 xl:px-32 px-5 z-50 flex items-center justify-between transition-all duration-500 ease-out',
      scrolled
        ? 'bg-black/90 backdrop-blur-xl shadow-lg'
        : 'bg-black/25 backdrop-blur-md',
    ]"
  >
    <div class="flex justify-center items-center gap-3">
      <router-link to="/ng" class="cursor-pointer">
        <img
          loading="lazy"
          :src="currentLogo"
          alt="Filmritz Logo"
          :class="
            auth.isLoggedIn &&
            router.currentRoute.value.path !== '/forgot-password' &&
            router.currentRoute.value.path !== '/reset-password'
              ? 'transition-all duration-900 animate-fade-up w-10'
              : 'transition-all duration-900 animate-fade-up w-11'
          "
        />
      </router-link>
      <div
        v-if="
          show3 &&
          auth.isLoggedIn &&
          router.currentRoute.value.path !== '/forgot-password' &&
          router.currentRoute.value.path !== '/reset-password'
        "
        @click="closeOnClickingOutside"
        class="left-0 top-0 absolute inset-0 w-screen ease-in transition-all duration-500 h-screen bg-black/40 bg-opacity-30 -z-10"
      ></div>
      <div
        v-if="
          auth.isLoggedIn &&
          router.currentRoute.value.path !== '/forgot-password' &&
          router.currentRoute.value.path !== '/reset-password'
        "
      >
        <div
          class="hidden xl:flex xl:space-x-6 transition duration-500 animate-fade-up"
        >
          <router-link
            to="/ng"
            :class="[
              isActiveLink('/ng')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 text-[#d1d5dc] font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >Home</router-link
          >
          <div class="relative group cursor-pointer pt-0.5">
            <button
              class="text-[#d1d5dc] font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Browse
              <i class="pi pi-chevron-down text-lg"></i>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              <router-link
                to="/ng/movies"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-t-[11px] rounded-t-[11px] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🎬 Movies
              </router-link>
              <router-link
                to="/ng/tv-shows"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                📺 TV Shows
              </router-link>
              <router-link
                to="/ng/trending"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🔥 Trending
              </router-link>
              <router-link
                to="/ng/popular"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                👑 Popular
              </router-link>
              <router-link
                to="/ng/top-rated"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                ⭐ Top Rated
              </router-link>
              <router-link
                to="/ng/new-releases"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🆕 New Releases
              </router-link>
              <router-link
                to="/ng/coming-soon"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-b-[11px] rounded-b-[11px] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🎬 Coming Soon
              </router-link>
            </div>
          </div>
          <div class="relative group cursor-pointer pt-0.5">
            <button
              class="text-[#d1d5dc] font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Discover
              <i class="pi pi-chevron-down text-lg"></i>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              <router-link
                to="/ng/collections"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-t-[11px] rounded-t-[11px] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                📚 Collections
              </router-link>
              <router-link
                to="/ng/mood/happy"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🎨 By Mood
              </router-link>
              <router-link
                to="/ng/trailers"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🎥 All Trailers
              </router-link>
              <router-link
                to="/ng/trending-trailers"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🔥 Trending Trailers
              </router-link>
              <router-link
                to="/ng/trailercinema"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] rounded-b-[11px] hover:rounded-b-[11px] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
              >
                🎬 Trailer Cinema
              </router-link>
            </div>
          </div>
          <router-link
            to="/ng/genre/action"
            :class="[
              isActiveLink('/ng/genre/action')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 text-[#d1d5dc] font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
          >
            Genres
          </router-link>

          <!-- My List (if logged in) -->
          <router-link
            v-if="auth.isLoggedIn"
            to="/ng/my-list"
            :class="[
              isActiveLink('/ng/my-list')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 text-[#d1d5dc] font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
          >
            My List
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-if="
        router.currentRoute.value.path.startsWith('/ng') &&
        router.currentRoute.value.path !== '/ng/login'
      "
      class="hidden md:flex xl:flex pr-2 transition duration-500 animate-fade-up cursor-pointer"
    >
      <SearchBar />
    </div>
    <div
      v-if="
        router.currentRoute.value.path.startsWith('/ng') &&
        router.currentRoute.value.path !== '/ng/login'
      "
      class="flex items-center gap-5 transition-all animate-fade-up duration-900"
    >
      <button
        class="flex md:hidden cursor-pointer"
        type="button"
        @click="openModal"
      >
        <i class="pi pi-search text-gray-300 text-xl"></i>
      </button>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-9999">
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
            <div
              class="fixed top-0 left-0 w-full z-9999 h-18 pt-2.5 items-center justify-center backdrop-blur-md"
            >
              <SearchBar @close="closeModal" />
            </div>
          </TransitionChild>
        </Dialog>
      </TransitionRoot>
      <div v-if="auth.isLoggedIn" class="relative group">
        <button
          @click="handleMenuButtonClick3"
          class="w-10 h-10 rounded-full bg-red-600 flex text-center select-none items-center justify-center text-white font-[Gilroy-Bold] leading-12 text-2xl cursor-pointer hover:bg-red-700 transition-colors"
        >
          <span class="mt-1">{{ userInitial }}</span>
        </button>
        <transition name="slide-fade">
          <div
            v-if="show3"
            class="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 transition-all overflow-y-auto"
          >
            <router-link
              to="/ng"
              class="xl:hidden"
              @click="closeMenuOnMobile"
              :class="[
                isActiveLink('/ng')
                  ? 'hover:text-red-500 block px-4 py-3 text-red-500 font-[Gilroy-SemiBold] transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                  : 'hover:text-red-500 block px-4 py-3 text-[#d1d5dc] font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              Home
            </router-link>
            <button
              @click="handleMenuButtonClick"
              class="text-[#d1d5dc] font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer px-4 py-3 xl:hidden"
            >
              Browse
              <i class="pi pi-chevron-down text-lg"></i>
            </button>
            <transition name="slide-fade">
              <div
                v-if="show"
                class="bg-black/95 backdrop-blur-xl border border-white/10 transition-all"
              >
                <router-link
                  to="/ng/movies"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🎬 Movies
                </router-link>
                <router-link
                  to="/ng/tv-shows"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  📺 TV Shows
                </router-link>
                <router-link
                  to="/ng/trending"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🔥 Trending
                </router-link>
                <router-link
                  to="/ng/popular"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  👑 Popular
                </router-link>
                <router-link
                  to="/ng/top-rated"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  ⭐ Top Rated
                </router-link>
                <router-link
                  to="/ng/new-releases"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🆕 New Releases
                </router-link>
                <router-link
                  to="/ng/coming-soon"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🎬 Coming Soon
                </router-link>
              </div>
            </transition>
            <button
              @click="handleMenuButtonClick2"
              class="text-[#d1d5dc] font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer px-4 py-3 xl:hidden"
            >
              Discover
              <i class="pi pi-chevron-down text-lg"></i>
            </button>
            <transition name="slide-fade">
              <div
                v-if="show2"
                class="bg-black/95 backdrop-blur-xl border border-white/10 transition-all"
              >
                <router-link
                  to="/ng/collections"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  📚 Collections
                </router-link>
                <router-link
                  to="/ng/mood/happy"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🎨 By Mood
                </router-link>
                <router-link
                  to="/ng/trailers"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🎥 All Trailers
                </router-link>
                <router-link
                  to="/ng/trending-trailers"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🔥 Trending Trailers
                </router-link>
                <router-link
                  to="/ng/trailercinema"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-[#d1d5dc] font-[Gilroy-Medium] transition-colors"
                >
                  🎬 Trailer Cinema
                </router-link>
              </div>
            </transition>
            <router-link
              to="/ng/genre/action"
              @click="closeMenuOnMobile"
              class="xl:hidden"
              :class="[
                isActiveLink('/ng/genre/action')
                  ? 'hover:text-red-500 block px-4 py-3 text-red-500 font-[Gilroy-SemiBold] transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                  : 'hover:text-red-500 block px-4 py-3 text-[#d1d5dc] font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              Genres
            </router-link>
            <router-link
              to="/ng/my-list"
              class="xl:hidden"
              @click="closeMenuOnMobile"
              :class="[
                isActiveLink('/ng/my-list')
                  ? 'hover:text-red-500 block px-4 py-3 text-red-500 font-[Gilroy-SemiBold] transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                  : 'hover:text-red-500 block px-4 py-3 text-[#d1d5dc] font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              My List
            </router-link>
            <router-link
              to="/ng/history"
              @click="closeMenuOnMobile"
              :class="[
                isActiveLink('/ng/history')
                  ? 'hover:text-red-500 block px-4 py-3 text-red-500 font-[Gilroy-SemiBold] transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                  : 'hover:text-red-500 block px-4 py-3 text-[#d1d5dc] font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              History
            </router-link>
            <router-link
              to="/ng/profile"
              @click="closeMenuOnMobile"
              :class="[
                isActiveLink('/ng/profile')
                  ? 'hover:text-red-500 block px-4 py-3 text-red-500 font-[Gilroy-SemiBold] transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                  : 'hover:text-red-500 block px-4 py-3 text-[#d1d5dc] font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              Profile
            </router-link>
            <div class="border-t border-white/10"></div>
            <button
              v-if="isLoggedIn"
              @click="logout"
              :disabled="isLoggingOut"
              class="w-full text-left px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-red-400 font-[Gilroy-Medium] hover:rounded-b-xl rounded-b-xl transition-colors cursor-pointer"
            >
              <span
                v-if="!isLoggingOut"
                @click="closeMenuOnMobile"
                class="flex items-center gap-3"
                >🚪 Sign Out<i class="pi pi-sign-in"></i
              ></span>
              <span v-else class="">Signing Out...</span>
            </button>
          </div>
        </transition>
      </div>
      <div
        class="flex space-x-4"
        v-if="router.currentRoute.value.path !== '/ng/login' || auth.isLoggedIn"
      >
        <div
          v-if="
            !auth.isLoggedIn && router.currentRoute.value.path !== '/ng/login'
          "
        >
          <router-link
            to="/ng/login"
            class="px-6 py-3 rounded-full bg-red-500 hover:bg-[#e32125] text-[#d1d5dc] font-[Gilroy-SemiBold] transition-all animate-fade-up duration-900"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { Dialog, TransitionChild, TransitionRoot } from "@headlessui/vue";
import "swiper/css";
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchBar from "../media/SearchBar.vue";
import Logo from "/filmritzlogo2.png";
import Logo2 from "/filmritzlogo3.png";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const isLoggingOut = ref(false);
const isLoggedIn = computed(() => !!auth.user);

async function logout() {
  localStorage.removeItem("visitedLogin");
  isLoggingOut.value = true;
  await auth.signOut();
  router.push("/ng");
  isLoggingOut.value = false;
}

const scrolled = ref(false);
const show = ref(false);
const show2 = ref(false);
const show3 = ref(false);
const isOpen = ref(false);

const userInitial = computed(() => {
  if (!auth.user?.email) return "U";
  return auth.user.email.charAt(0).toUpperCase();
});

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

function closeOnClickingOutside() {
  show3.value = false;
}

function closeMenuOnMobile() {
  show3.value = false;
  show2.value = false;
  show.value = false;
}

function handleMenuButtonClick() {
  show.value = !show.value;
  show2.value = false;
}

function handleMenuButtonClick2() {
  show2.value = !show2.value;
  show.value = false;
}

function handleMenuButtonClick3() {
  show3.value = !show3.value;
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
