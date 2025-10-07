<template>
    <div class="relative overflow-hidden -mt-22 z-20 flex items-center justify-center rounded-sm mx-auto bg-[radial-gradient(circle_at_center,_rgba(255,153,0,0.6)_0%,_rgba(229,9,20,0.6)_14%,_rgba(14,27,79,0.6)_77%,_rgba(0,4,19,0.6)_100%)] min-h-40 shadow-2xl shadow-black/50 transition-all duration-900 animate-fade-up md:space-x-3">
        <img :src="popcorn" alt="popcorn image" class="transition-all duration-900 animate-fade-up"></img>
        <div class="flex flex-col items-start justify-start">
            <div class="flex flex-col items-start justify-start text-white">
                <h3 class="text-2xl font-[Gilroy-Bold] transition-all duration-900 animate-fade-up">The
                    FilmRitz you love for just ₦2,500.</h3>
                <p class="text-sm font-[Gilroy-Medium] transition-all duration-900 animate-fade-up">Get the
                    Standard with ads plan.</p>
            </div>
            <div
                class="flex items-start justify-start text-[#448EF4] hover:text-[#0071EB] font-[Gilroy-Medium] mt-2 transition-all duration-900 ease-out">
                <router-link class="text-center items-center flex gap-3">
                    <span class="underline">
                        Learn More
                    </span>
                    <i class="pi pi-chevron-right text-lg"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import popcorn from '../../assets/popcorn.png';
</script>

<style scoped></style>