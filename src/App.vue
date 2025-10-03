<template>
  <div>
    <Navbar />
    <router-view />
    <Footer />
    <MovieModal />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue';
import MovieModal from './components/modals/MovieModal.vue';
</script>
