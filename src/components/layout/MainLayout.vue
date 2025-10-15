<template>
  <div class="min-h-screen text-white flex flex-col">
    <span v-if="isLoggingOut">
      Logging Out ... <i class="pi pi-sign-in"></i>
    </span>
    <span v-else>
      <Navbar />
      <main>
        <router-view />
      </main>
    </span>
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
