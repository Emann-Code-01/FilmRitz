<template>
  <nav
    class="absolute top-0 left-0 w-full py-5 z-50 xl:px-32 pr-5 flex items-center justify-between transition-all animate-ease-out duration-500">
    <div class="flex justify-center items-center">
      <img :src="Logo" alt="Filmritz Logo" class="transition-all duration-900 animate-fade-up w-44" />
      <div v-if="auth.isLoggedIn" class="hidden md:flex space-x-6 transition-all duration-900 animate-fade-up">
        <router-link to="/ng" class="hover:text-red-500">Home</router-link>
        <router-link to="/profile" class="hover:text-red-500">My Watchlist</router-link>
      </div>
    </div>
    <div class="flex">
      <div class="flex space-x-4" v-if="router.currentRoute.value.path === '/ng' || auth.isLoggedIn">
        <div v-if="!auth.isLoggedIn && router.currentRoute.value.path === '/ng'">
          <router-link to="/login"
            class="px-6 py-1 rounded bg-[#b20710] hover:bg-[#e32125] text-white font-[Gilroy-SemiBold] transition-all animate-fade-up duration-500">
            Sign In
          </router-link>
        </div>

        <div v-else>
          <router-link to="/profile"
            class="px-4 py-2 rounded border border-gray-400 hover:border-red-500 transition-all duration-900 animate-fade-up">
            Profile
          </router-link>
          <button v-if="isLoggedIn" @click="logout" :disabled="isLoggingOut"
            class="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition-all duration-900 animate-fade-up cursor-pointer disabled:opacity-50">
            <span v-if="!isLoggingOut">Log Out</span>
            <span v-else>Logging out...</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Logo from '../../assets/filmritzlogo.svg';
import { ref, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const isLoggingOut = ref(false);

const isLoggedIn = computed(() => !!auth.user);

async function logout() {
  isLoggingOut.value = true;
  await auth.signOut();
  router.push("/ng");
  isLoggingOut.value = false;
}

</script>
