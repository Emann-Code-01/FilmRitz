<template>
  <Navbar />

  <main class="w-full text-[#d1d5dc]">
  <router-view class="w-full block" />
  </main>

  <Footer />
</template>

<script setup lang="ts">
import Navbar from '../common/Navbar.vue';
import Footer from '../common/Footer.vue';
</script>
