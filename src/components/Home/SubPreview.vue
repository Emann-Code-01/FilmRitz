<template class="bg-black relative">
  <div
    class="relative md:hidden overflow-hidden -mt-20 z-20 flex items-center justify-center rounded-sm mx-auto bg-[radial-gradient(circle_at_center,rgba(255,153,0,0.6)_0%,rgba(229,9,20,0.6)_14%,rgba(14,27,79,0.6)_77%,rgba(0,4,19,0.6)_100%)] min-h-40 shadow-2xl shadow-black/50 transition-all duration-900 animate-fade-up"
  >
    <img
      :src="popcorn"
      loading="lazy"
      alt="Popcorn"
      class="transition-all duration-900 animate-fade-up"
    />
    <div class="flex flex-col items-center justify-center -ml-8">
      <div class="flex flex-col items-center justify-center text-white">
        <h3
          class="relative items-center text-2xl font-[Gilroy-Bold] transition-all duration-900 animate-fade-up"
        >
          The FilmRitz you love
        </h3>
        <div
          class="custom-container flex items-center justify-center transition-all duration-900 animate-fade-up"
        >
          <Swiper
            :modules="[Autoplay]"
            :slides-per-group="1"
            :space-between="0"
            :loop="true"
            :autoplay="{ delay: 0, disableOnInteraction: false }"
            :speed="8000"
            class="relative transition-all duration-900 animate-fade-up mySwiper"
          >
            <SwiperSlide v-for="(item, index) in items" :key="index">
              <span
                class="text-sm font-[Gilroy-Medium] transition-all duration-900"
              >
                {{ item.title }}
              </span>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <!-- <div
                class="flex items-center justify-center text-[#448EF4] hover:text-[#0071EB] font-[Gilroy-Medium] mt-2 transition-all duration-900 ease-out">
                <router-link to="/ng/login" class="inline-flex items-center gap-3 text-center">
                    <span class="underline">Sign In</span>
                    <i class="pi pi-chevron-right text-lg"></i>
                </router-link>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import popcorn from "../../assets/popcorn.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const items = [
  { title: "Wherever, whenever — your world of entertainment in one click." },
  {
    title:
      "Discover the newest films, hidden gems, and timeless classics — all in one place.",
  },
  {
    title:
      "Your escape from the ordinary — stories that move, thrill, and inspire.",
  },
  {
    title:
      "Built for fans, by fans. Stream the stories that bring us all together.",
  },
];
</script>
