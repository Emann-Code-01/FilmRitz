<template>
  <div class="min-h-screen text-white flex flex-col">
    <Navbar />
    <main class="flex-1 px-6 md:px-12 py-8">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../common/Navbar.vue'
import Footer from '../common/Footer.vue'
</script>
