<!-- <template>
  <div>
    <router-view />
    <MovieModal />
  </div>
</template>

<script setup>
import MovieModal from './components/media/MovieModal.vue'; 
</script>-->

<template>
  <span v-if="isLoggingOut">
    Logging Out ... <i class="pi pi-sign-in"></i>
  </span>
  <span v-else>
    <router-view />
    <MovieModal />
  </span>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
import MovieModal from './components/media/MovieModal.vue';

const auth = useAuthStore();
const router = useRouter();

const isLoggingOut = ref(false);

async function logout() {
  isLoggingOut.value = true;
  await auth.signOut();
  router.push("/ng");
  isLoggingOut.value = false;
}
</script>
