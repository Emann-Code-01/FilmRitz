<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-black text-white">
    <h1 class="text-5xl font-bold mb-4 animate-pulse">🚧 Page Not Available</h1>
    <p class="text-lg text-gray-400 mb-6">
      This page is under construction. Check back soon!
    </p>
    <router-link 
      to="/ng/" 
      class="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-300">
      Go Home
    </router-link>
  </div>
</template>

<script setup>
</script>
