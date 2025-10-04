<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription, TransitionRoot } from "@headlessui/vue"
import { ref, watch } from "vue"
import { useModalStore } from "../../store/modalStore"
import { getMovieDetails } from "../../api/tmdb"

const modalStore = useModalStore()
const movie = ref<any>(null)

const baseUrl = "https://image.tmdb.org/t/p/w1280"

watch(
  () => modalStore.movieId,
  async (id) => {
    if (id) {
      movie.value = await getMovieDetails(id)
    }
  }
)
</script>

<template>
  <TransitionRoot :show="modalStore.isMovieModal" as="template">
    <Dialog @close="modalStore.closeMovie" class="relative z-50 transition-all duration-200">
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[linear-gradient(to_bottom,_#000000CC_10%,#000000_50%)]"></div>

        <DialogPanel class="relative w-full max-w-4xl h-[40em] overflow-hidden rounded-xl text-white shadow-xl">
          <div v-if="movie?.backdrop_path"
            class="absolute inset-0 bg-fixed bg-center bg-cover mx-auto bg-no-repeat transition-all duration-500 animate-fade-up"
            :style="{ backgroundImage: `url(${baseUrl + movie.backdrop_path})` }"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

          <button @click="modalStore.closeMovie"
            class="hover:bg-white/30 absolute top-5 right-5 rounded-full p-1 cursor-pointer transition-all duration-300">
            <svg viewBox="0 0 36 36" width="36" height="36" class="transform -rotate-45"
              xmlns="http://www.w3.org/2000/svg" fill="none" role="img">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z"
                fill="currentColor"></path>
            </svg>
          </button>

          <div class="absolute bottom-0 left-0 z-10 p-6 space-y-3">
            <DialogTitle as="h2" class="text-6xl font-[Gilroy-Bold]">
              {{ movie?.title }}
            </DialogTitle>

            <div class="flex items-center gap-4">
              <span class="px-2 py-1 bg-green-700 text-green-100 rounded-md text-sm font-[Gilroy-SemiBold]">
                {{ movie?.vote_average.toFixed(1) }}
              </span>
              <span class="text-sm font-[Gilroy-Medium]">
                {{ new Date(movie?.release_date).getFullYear() }}
              </span>
            </div>

            <DialogDescription as="p" class="mt-3 max-w-2xl text-xl font-[Gilroy-SemiBold]">
              {{ movie?.overview }}
            </DialogDescription>

            <router-link @click="modalStore.closeMovie"
              class="gap-3 bg-[#b20710] text-white focus:outline-none font-[Gilroy-Bold] md:text-2xl px-8 py-4 md:py-3 rounded-sm hover:bg-[#e32125] group transition-all duration-500"
              to="/ng/login">
              Get Started
              <i class="pi pi-chevron-right text-xl group-hover:animate-pulse"></i>
            </router-link>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
