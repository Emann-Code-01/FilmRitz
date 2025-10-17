<template>
  <div class="w-full">
    <Menu as="div" class="relative inline-block text-left">
      <div class="flex text-gray-300 cursor-pointer">
        <MenuButton
          class="inline-flex focus:outline-none items-center cursor-pointer border-2 hover:ring-1 hover:border-red-600 hover:text-red-600 transition-all duration-500 px-3 py-2 rounded-full"
        >
          <span class="pi pi-user text-xl"></span>
          <i class="-mr-1 ml-2 pi pi-caret-down" aria-hidden="true"></i>
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <span class="xl:hidden">
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  @click="goTo('/ng')"
                  :class="[
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm font-[Gilroy-SemiBold] transition-all duration-200',
                    active
                      ? 'bg-red-700 text-white'
                      : 'text-gray-900 hover:text-red-500',
                    isActiveLink('/ng')
                      ? 'text-red-500 underline bg-accent ease-in'
                      : '',
                  ]"
                >
                  Home
                </button>
              </MenuItem>
            </div>
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  @click="goTo('/ng/tvshows')"
                  :class="[
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm font-[Gilroy-SemiBold] transition-all duration-200',
                    active
                      ? 'bg-red-700 text-white'
                      : 'text-gray-900 hover:text-red-500',
                    isActiveLink('/ng/tvshows')
                      ? 'text-red-500 underline bg-accent ease-in'
                      : '',
                  ]"
                >
                  My Tv Shows
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="goTo('/ng/movies')"
                  :class="[
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm font-[Gilroy-SemiBold] transition-all duration-200',
                    active
                      ? 'bg-red-700 text-white'
                      : 'text-gray-900 hover:text-red-500',
                    isActiveLink('/ng/movies')
                      ? 'text-red-500 underline bg-accent ease-in'
                      : '',
                  ]"
                >
                  My Movies
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="goTo('/ng/new&popular')"
                  :class="[
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm font-[Gilroy-SemiBold] transition-all duration-200',
                    active
                      ? 'bg-red-700 text-white'
                      : 'text-gray-900 hover:text-red-500',
                    isActiveLink('/ng/new&popular')
                      ? 'text-red-500 underline bg-accent ease-in'
                      : '',
                  ]"
                >
                  New & Popular
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  @click="goTo('/ng/watchlist')"
                  :class="[
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm font-[Gilroy-SemiBold] transition-all duration-200',
                    active
                      ? 'bg-red-700 text-white'
                      : 'text-gray-900 hover:text-red-500',
                    isActiveLink('/ng/watchlist')
                      ? 'text-red-500 underline bg-accent ease-in'
                      : '',
                  ]"
                >
                  My Watchlist
                </button>
              </MenuItem>
            </div>
          </span>
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                ref="initialFocus"
                v-if="isLoggedIn"
                @click="logout"
                :disabled="isLoggingOut"
                :class="[
                  active
                    ? 'text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-[Gilroy-SemiBold] transition-all duration-500 cursor-pointer disabled:opacity-50'
                    : 'text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-[Gilroy-SemiBold] transition-all duration-500 cursor-pointer disabled:opacity-50',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                <span v-if="!isLoggingOut" class="flex items-center gap-3"
                  >Log Out <i class="pi pi-sign-in"></i
                ></span>
                <span v-else>Logging out...</span>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isLoggingOut = ref(false);
const isLoggedIn = computed(() => !!auth.user);

const isActiveLink = (routePath: string): boolean => {
  return route.path === routePath;
};
const goTo = (path: string) => router.push(path);

async function logout() {
  isLoggingOut.value = true;
  await auth.signOut();
  router.push("/ng");
  isLoggingOut.value = false;
}
</script>

<style scoped></style>
