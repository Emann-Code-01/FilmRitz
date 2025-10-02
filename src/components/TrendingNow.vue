<template>
    <section class="bg-black transition-all duration-900 animate-fade-up relative z-10 overflow-hidden">
        <div class="container relative transition-all duration-900 animate-fade-up">
            <Swiper :modules="[Navigation, Scrollbar]" :slides-per-view="6" :scrollbar="{ draggable: false }"
                :space-between="12" :slides-per-group="4" :loop="false"
                :navigation="{ nextEl: '.custom-next', prevEl: '.custom-prev' }" :breakpoints="{
                    320: { slidesPerView: 2, spaceBetween: 8 },
                    640: { slidesPerView: 3, spaceBetween: 10 },
                    1024: { slidesPerView: 6, spaceBetween: 12 }
                }" class="netflix-swiper transition-all duration-900 animate-fade-up mySwiper w-full"
                @reachBeginning="atBeginning = true" @reachEnd="atEnd = true"
                @fromEdge="() => { atBeginning = false; atEnd = false }">
                <SwiperSlide v-for="(movie, index) in movies" :key="movie.id"
                    class="relative w-full cursor-pointer  transition-all duration-900 animate-fade-up hover:scale-105 py-2 px-2">
                    <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 780px" :alt="movie.title"
                        class="rounded-md hover:rounded-md w-full h-64 transition-all duration-500 animate-fade-up mx-5" />
                    <span class="absolute left-2 bottom-3 text-[100px] font-extrabold leading-none image-style">
                        {{ movieCount[index].number }}
                    </span>
                </SwiperSlide>
            </Swiper>
        </div>
        <div class="custom-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-96 flex items-center justify-center bg-black text-white cursor-pointer transition-all duration-500 pr-2"
            :class="{ 'opacity-0 pointer-events-none': atBeginning, 'opacity-100': !atBeginning }">
            <span
                class="flex items-center w-6 h-32 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-900 animate-fade-up">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </span>
        </div>
        <div class="custom-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-96 flex items-center justify-center bg-black text-white cursor-pointer transition-all duration-500 pl-2"
            :class="{ 'opacity-0 pointer-events-none': atEnd, 'opacity-100': !atEnd }">
            <span
                class="flex items-center w-6 h-32 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-900 animate-fade-up">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </span>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Scrollbar } from "swiper/modules";
import axios from "axios";

const movies = ref([]);
const atBeginning = ref(true);
const atEnd = ref(false);

const movieCount = [
    {
        number: "1",
    },
    {
        number: "2",
    },
    {
        number: "3",
    },
    {
        number: "4",
    },
    {
        number: "5",
    },
    {
        number: "6",
    },
    {
        number: "7",
    },
    {
        number: "8",
    },
    {
        number: "9",
    },
    {
        number: "10",
    }
]

onMounted(async () => {
    try {
        const res = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMDB_API_KEY
            }`
        );
        movies.value = res.data.results.slice(0, 10);
    } catch (err) {
        console.error("Failed to fetch movies:", err);
    }
});
</script>

<style>
.netflix-swiper .swiper-button-prev,
.netflix-swiper .swiper-button-next {
    @apply absolute top-1/2 -translate-y-1/2 z-10 w-[3rem] h-[6rem] flex items-center justify-center bg-[#000000]/50 text-[#ffffff] rounded-[0.375rem] cursor-pointer opacity-0 transition-opacity duration-300;
}

.netflix-swiper:hover .swiper-button-prev,
.netflix-swiper:hover .swiper-button-next {
    @apply opacity-100;
}

.netflix-swiper .swiper-button-prev {
    @apply left-[0rem];
}

.netflix-swiper .swiper-button-next {
    @apply right-[0rem];
}

.netflix-swiper .swiper-button-prev::after,
.netflix-swiper .swiper-button-next::after {
    content: "";
}

.image-style {
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
    -webkit-text-fill-color: rgb(0, 0, 0);
    text-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.5);
}
</style> 
<
