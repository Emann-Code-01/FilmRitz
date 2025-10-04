<template>
    <div class="relative w-full overflow-hidden h-screen md:-mt-44 xl:mt-auto bg-fixed bg-center bg-cover bg-no-repeat transition-all"
        :style="{ backgroundImage: loaded ? `url('${bgUrl}')` : 'none' }">
        <div v-if="!loaded" class="absolute inset-0 bg-black/80"></div>
        <div class="absolute inset-0 bg-black/60"></div>
        <img :src="bgUrl" alt="" loading="lazy" class="hidden" @load="onImageLoaded" />
        <div
            class="relative z-10 flex flex-col xl:pt-10 text-center items-center justify-center h-full text-white gap-7 transition-all duration-900 animate-fade-up">
            <div class=""></div>
        </div>
    </div>
</template>

<script setup>
import HeroImg from '@/assets/Hero Image.png';
import { ref, computed } from "vue";

const bgUrl = HeroImg;
const loaded = ref(false);

function onImageLoaded() {
    loaded.value = true
}
</script>

<style scoped></style>