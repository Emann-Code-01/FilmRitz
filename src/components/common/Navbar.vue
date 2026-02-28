<template>
  <nav
    :class="[
      auth.isLoggedIn &&
      router.currentRoute.value.path !== '/forgot-password' &&
      router.currentRoute.value.path !== '/reset-password'
        ? 'fixed top-0 left-0 w-full py-5 pl-6 z-50 flex items-center justify-between transition-all duration-500 ease-out'
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
            router.currentRoute.value.path.startsWith('/ng')
              ? auth.isLoggedIn &&
                router.currentRoute.value.path !== '/forgot-password' &&
                router.currentRoute.value.path !== '/reset-password'
                ? 'transition-all duration-900 animate-fade-up w-12 md:w-15'
                : 'transition-all duration-900 animate-fade-up w-13 md:w-16'
              : 'hidden'
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
          router.currentRoute.value.path !== '/reset-password' &&
          router.currentRoute.value.path.startsWith('/ng')
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
                : 'hover:text-red-500 text-white font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
            ]"
            >Home</router-link
          >
          <div class="relative group cursor-pointer pt-0.5">
            <button
              class="text-white font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Browse
              <span
                class="flex items-center justify-center transition-transform duration-300 group-hover:rotate-180 group-hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              <router-link
                to="/ng/movies"
                class="px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-t-[11px] rounded-t-[11px] text-white font-[Gilroy-Medium] transition-all flex items-center gap-1"
              >
                Movies
              </router-link>
              <router-link
                to="/ng/tv-shows"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                TV Shows
              </router-link>
              <router-link
                to="/ng/trending"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                Trending
              </router-link>
              <router-link
                to="/ng/popular"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                Popular
              </router-link>
              <router-link
                to="/ng/top-rated"
                class="flex items-center gap-2 px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                Top Rated
              </router-link>
              <router-link
                to="/ng/new-releases"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                New Releases
              </router-link>
              <router-link
                to="/ng/coming-soon"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-b-[11px] rounded-b-[11px] text-white font-[Gilroy-Medium] transition-colors"
              >
                Coming Soon
              </router-link>
            </div>
          </div>
          <div class="relative group cursor-pointer pt-0.5">
            <button
              class="text-white font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Discover
              <span
                class="flex items-center justify-center transition-transform duration-300 group-hover:rotate-180 group-hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              <router-link
                to="/ng/discover"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-t-[11px] rounded-t-[11px] text-white font-[Gilroy-Medium] transition-colors"
              >
                Match Me
              </router-link>
              <router-link
                to="/ng/collections"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                Collections
              </router-link>
              <router-link
                to="/ng/mood/happy"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                By Mood
              </router-link>
              <router-link
                to="/ng/trailers"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                All Trailers
              </router-link>
              <router-link
                to="/ng/trending-trailers"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
              >
                Trending Trailers
              </router-link>
              <router-link
                to="/ng/trailercinema"
                class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] rounded-b-[11px] hover:rounded-b-[11px] text-white font-[Gilroy-Medium] transition-colors"
              >
                Trailer Cinema
              </router-link>
            </div>
          </div>
          <router-link
            to="/ng/genre/action"
            :class="[
              isActiveLink('/ng/genre/action')
                ? 'hover:text-red-500 text-red-500 font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                : 'hover:text-red-500 text-white font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
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
                : 'hover:text-red-500 text-white font-[Gilroy-SemiBold] text-lg transition-all duration-200 hover:underline false',
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6 text-gray-300"
        >
          <path
            fill-rule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-9999">
          <TransitionChild
            as="template"
            enter="duration-500 ease-out"
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
          class="w-10 h-10 lg:aspect-square rounded-full bg-red-600 flex text-center select-none items-center justify-center text-white font-[Gilroy-Bold] leading-none text-2xl cursor-pointer hover:bg-red-700 transition-colors"
        >
          <span class="mt-1.5 lg:mt-0">{{ userInitial }}</span>
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
                  : 'hover:text-red-500 block px-4 py-3 text-white font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              Home
            </router-link>
            <button
              @click="handleMenuButtonClick"
              class="text-white font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer px-4 py-3 xl:hidden"
            >
              Browse
              <span
                class="flex items-center justify-center transition-transform duration-300"
                :class="[show ? 'rotate-180 text-white' : '']"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
            <transition name="slide-fade">
              <div
                v-if="show"
                class="bg-black/95 backdrop-blur-xl border border-white/10 transition-all"
              >
                <router-link
                  to="/ng/movies"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Movies
                </router-link>
                <router-link
                  to="/ng/tv-shows"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  TV Shows
                </router-link>
                <router-link
                  to="/ng/trending"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Trending
                </router-link>
                <router-link
                  to="/ng/popular"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Popular
                </router-link>
                <router-link
                  to="/ng/top-rated"
                  @click="closeMenuOnMobile"
                  class="flex items-center gap-2 px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Top Rated
                </router-link>
                <router-link
                  to="/ng/new-releases"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  New Releases
                </router-link>
                <router-link
                  to="/ng/coming-soon"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Coming Soon
                </router-link>
              </div>
            </transition>
            <button
              @click="handleMenuButtonClick2"
              class="text-white font-[Gilroy-SemiBold] hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer px-4 py-3 xl:hidden"
            >
              Discover
              <span
                class="flex items-center justify-center transition-transform duration-300"
                :class="[show2 ? 'rotate-180 text-white' : '']"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
            <transition name="slide-fade">
              <div
                v-if="show2"
                class="bg-black/95 backdrop-blur-xl border border-white/10 transition-all"
              >
                <router-link
                  to="/ng/discover"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] hover:rounded-t-[11px] rounded-t-[11px] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Match Me
                </router-link>
                <router-link
                  to="/ng/collections"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Collections
                </router-link>
                <router-link
                  to="/ng/mood/happy"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  By Mood
                </router-link>
                <router-link
                  to="/ng/trailers"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  All Trailers
                </router-link>
                <router-link
                  to="/ng/trending-trailers"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Trending Trailers
                </router-link>
                <router-link
                  to="/ng/trailercinema"
                  @click="closeMenuOnMobile"
                  class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
                >
                  Trailer Cinema
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
                  : 'hover:text-red-500 block px-4 py-3 text-white font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
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
                  : 'hover:text-red-500 block px-4 py-3 text-white font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
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
                  : 'hover:text-red-500 block px-4 py-3 text-white font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              History
            </router-link>
            <router-link
              to="/ng/watchlists"
              @click="closeMenuOnMobile"
              :class="[
                isActiveLink('/ng/watchlists')
                  ? 'hover:text-red-500 block px-4 py-3 text-red-500 font-[Gilroy-SemiBold] transition-all duration-200 hover:duration-500 hover:underline bg-accent ease-in'
                  : 'hover:text-red-500 block px-4 py-3 text-white font-[Gilroy-SemiBold] transition-all duration-200 hover:underline false',
              ]"
            >
              Watchlist
            </router-link>
            <router-link
              to="/ng/profile"
              class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
            >
              Profile
            </router-link>
            <router-link
              to="/ng/watchlists"
              class="block px-4 py-3 hover:bg-white/10 hover:text-red-500 hover:font-[Gilroy-Medium] text-white font-[Gilroy-Medium] transition-colors"
            >
              Watchlist
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
                >Sign Out<svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
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
            class="px-3 md:px-6 py-2 md:py-2.5 rounded-full bg-red-500 hover:bg-[#e32125] text-white font-[Gilroy-SemiBold] transition-all animate-fade-up duration-900"
          >
            Sign In
          </router-link>
          <!-- you can use this text color if white is not too good text-white -->
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
  try {
    isLoggingOut.value = true;
    // Remove local storage flag
    localStorage.removeItem("visitedLogin");

    // Perform actual logout
    await auth.signOut();

    // Redirect to login page
    router.push("/ng/login");
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if it fails, try to redirect
    router.push("/ng/login");
  } finally {
    isLoggingOut.value = false;
  }
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
