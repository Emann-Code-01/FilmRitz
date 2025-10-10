<template>
    <div
        class="relative overflow-hidden -mt-20 z-20 flex items-center justify-center rounded-sm mx-auto bg-[radial-gradient(circle_at_center,_rgba(255,153,0,0.6)_0%,_rgba(229,9,20,0.6)_14%,_rgba(14,27,79,0.6)_77%,_rgba(0,4,19,0.6)_100%)] min-h-[10rem] shadow-2xl shadow-black/50 transition-all duration-900 animate-fade-up md:space-x-3">
        <img :src="popcorn" alt="Popcorn" class="transition-all duration-900 animate-fade-up" />
        <div class="flex flex-col items-start justify-start">
            <div class="flex flex-col items-start justify-start text-white">
                <h3 class="text-2xl font-[Gilroy-Bold] transition-all duration-900 animate-fade-up">
                    The FilmRitz you love
                </h3>
                <Swiper :modules="[Autoplay, Navigation]" :slides-per-group="1" :loop="true"
                    :autoplay="{ delay: 2500, disableOnInteraction: false }" class="transition-all duration-900 animate-fade-up mySwiper w-full">
                    <SwiperSlide v-for="(item, index) in items" :key="index">
                        <p class="text-sm font-[Gilroy-Medium] transition-all duration-900  ">
                            {{ item.title }}
                        </p>
                    </SwiperSlide>
                </Swiper>
            </div>

            <div
                class="flex items-start justify-start text-[#448EF4] hover:text-[#0071EB] font-[Gilroy-Medium] mt-2 transition-all duration-900 ease-out">
                <router-link to="/login" class="inline-flex items-center gap-3 text-center">
                    <span class="underline">Sign In</span>
                    <i class="pi pi-chevron-right text-lg"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import popcorn from "../../assets/popcorn.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";

const items = [
    { title: "Wherever, whenever — your world of entertainment in one click." },
    { title: "Discover the newest films, hidden gems, and timeless classics — all in one place." },
    { title: "Your escape from the ordinary — stories that move, thrill, and inspire." },
    { title: "Built for fans, by fans. Stream the stories that bring us all together." },
];
</script>
