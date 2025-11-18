<template>
  <div class="min-h-screen text-white flex flex-col">
    <div v-if="isLoggingOut">
      Logging Out ... <i class="pi pi-sign-in"></i>
    </div>

    <div v-else>
      <Navbar />

      <main class="w-full">
        <router-view class="w-full block" />
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../common/Navbar.vue';
import Footer from '../common/Footer.vue';
import { ref } from 'vue';
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

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
