<template>
  <span class="app-container">
    <router-view />
    <MovieModal />
  </span>
</template>

<script setup>
import MovieModal from "./components/media/MediaModal.vue";
</script>
