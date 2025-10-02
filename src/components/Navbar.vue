<template>
  <nav
    class="absolute top-0 left-0 w-full py-5 z-50 xl:px-32 pr-5 flex items-center justify-between transition-all animate-ease-out duration-500">
    <div>
      <img v-if="!auth.isLoggedIn" :src="Logo" alt="Filmritz Logo"
        class="transition-all duration-900 animate-fade-up w-44" />
      <router-link v-else to="/">
        <img :src="Logo" alt="Filmritz Logo" class="transition-all duration-900 animate-fade-up w-44" />
      </router-link>
    </div>
    <div v-if="auth.isLoggedIn" class="hidden md:flex space-x-6">
      <router-link to="/" class="hover:text-red-500">Home</router-link>
      <router-link to="/profile" class="hover:text-red-500">My Watchlist</router-link>
    </div>
    <div class="flex space-x-4">
      <template v-if="!auth.isLoggedIn">
        <button
          class="px-6 py-1 rounded bg-[#b20710] hover:bg-[#e32125] text-white font-[Gilroy-SemiBold] transition-all animate-fade-up duration-500">
          <router-link to="/signin">
            Sign In
          </router-link>
        </button>
      </template>

      <template v-else>
        <router-link to="/profile" class="px-4 py-2 rounded border border-gray-400 hover:border-red-500 transition">
          Profile
        </router-link>
        <button @click="handleLogout" class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 transition">
          Logout
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Logo from '@/assets/filmritzlogo.svg';
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

// handle logout
const handleLogout = async () => {
  try {
    await auth.logout();
    router.push("/signin");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
</script>
