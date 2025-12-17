<!-- components/Navigation/Footer.vue -->
<template>
  <footer class="bg-black/60 border-t border-white/10 mt-20">
    <div class="mx-auto px-14 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Company -->
        <div>
          <h3 class="text-white font-[Gilroy-Bold] text-2xl mb-4">FilmRitz</h3>
          <p class="text-gray-400 font-[Gilroy-Regular] text-base">
            Your premium movie and TV discovery platform with trailers and
            curated collections.
          </p>
        </div>

        <!-- Browse -->
        <div>
          <h3 class="text-white font-[Gilroy-Bold] text-2xl mb-4">Browse</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/ng/movies"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Movies</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/tv-shows"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >TV Shows</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/trending"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Trending</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/popular"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Popular</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/top-rated"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Top Rated</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/coming-soon"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Coming Soon</router-link
              >
            </li>
          </ul>
        </div>

        <!-- Discover -->
        <div>
          <h3 class="text-white font-[Gilroy-Bold] text-lg mb-4">Discover</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/ng/collections"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Collections</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/trailers"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Trailers</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/trending-trailers"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Trending Trailers</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/new-releases"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >New Releases</router-link
              >
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h3 class="text-white font-[Gilroy-Bold] text-lg mb-4">Company</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/ng/about"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >About</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/privacy"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Privacy Policy</router-link
              >
            </li>
            <li>
              <router-link
                to="/ng/terms"
                class="text-gray-400 hover:text-white font-[Gilroy-Medium] text-base transition-colors"
                >Terms of Service</router-link
              >
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <p class="text-gray-400 font-[Gilroy-Regular] text-sm">
          © 2024 FilmRitz. Built by
          <a
            href="https://emanncode.vercel.app"
            target="_blank"
            class="text-[#b20710] hover:text-[#e32125]"
            >@EmannCode</a
          >
        </p>
        <div class="flex gap-4">
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <i class="pi pi-twitter text-xl"></i>
          </a>
          <a
            href="https://github.com/Emann-Code-01"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <i class="pi pi-github text-xl"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/emann-b66a0b343"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <i class="pi pi-linkedin text-xl"></i>
          </a>
          <a
            href="https://wa.link/cbphkn"
            target="_blank"
            class="text-gray-400 hover:text-white transition-colors"
            ><i class="pi pi-whatsapp text-xl"></i
          ></a>
          <a
            href="mailto:olajubajeifeoluwa93@gmail.com"
            target="_blank"
            class="text-gray-400 hover:text-white transition-colors"
            ><i class="pi pi-envelope text-xl"></i
          ></a>
        </div>
      </div>
    </div>
  </footer>
</template>
