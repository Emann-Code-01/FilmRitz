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
import MovieModal from './components/movies/MovieModal.vue';
</script>
