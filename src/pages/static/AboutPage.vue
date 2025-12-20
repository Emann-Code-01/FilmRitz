<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="flex items-center gap-4">
          <div
            class="w-20 h-20 rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl"
          >
            ℹ️
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              About FilmRitz
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Your premium movie and TV discovery platform
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 md:px-10 max-w-4xl mx-auto space-y-12">
      <!-- Mission Section -->
      <section
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">Our Mission</h2>
        <p class="text-lg text-gray-300 font-[Gilroy-Regular] leading-relaxed">
          FilmRitz is dedicated to revolutionizing how you discover and explore
          movies and TV shows. We combine cutting-edge design with powerful
          features to create an immersive entertainment discovery experience.
          Our platform brings you trailers, curated collections, and
          personalized recommendations all in one beautiful interface.
        </p>
      </section>

      <!-- Features Section -->
      <section
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <h2 class="text-3xl font-[Gilroy-Bold] mb-6">What We Offer</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-[#b20710] flex items-center justify-center text-2xl shrink-0"
            >
              🎬
            </div>
            <div>
              <h3 class="text-xl font-[Gilroy-Bold] mb-2">Watch Trailers</h3>
              <p class="text-gray-400 font-[Gilroy-Regular]">
                Preview every movie and show with high-quality trailers before
                you commit to watching.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-[#b20710] flex items-center justify-center text-2xl shrink-0"
            >
              📚
            </div>
            <div>
              <h3 class="text-xl font-[Gilroy-Bold] mb-2">
                Curated Collections
              </h3>
              <p class="text-gray-400 font-[Gilroy-Regular]">
                Explore handpicked collections organized by mood, genre, and
                theme.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-[#b20710] flex items-center justify-center text-2xl shrink-0"
            >
              🔥
            </div>
            <div>
              <h3 class="text-xl font-[Gilroy-Bold] mb-2">Trending Content</h3>
              <p class="text-gray-400 font-[Gilroy-Regular]">
                Stay updated with what's hot right now based on global trends.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-[#b20710] flex items-center justify-center text-2xl shrink-0"
            >
              ♥️
            </div>
            <div>
              <h3 class="text-xl font-[Gilroy-Bold] mb-2">
                Personal Watchlist
              </h3>
              <p class="text-gray-400 font-[Gilroy-Regular]">
                Save your favorite content and build your perfect watchlist.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">The Team</h2>
        <p
          class="text-lg text-gray-300 font-[Gilroy-Regular] leading-relaxed mb-6"
        >
          FilmRitz is built by passionate developers and designers who love
          cinema and technology. We're constantly working to improve your
          experience and bring you the best movie discovery platform on the web.
        </p>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 flex items-center justify-center text-2xl">
            <img src="../../assets/EmannCode01 Logo.png" />
          </div>
          <div>
            <p class="font-[Gilroy-Bold] text-lg">Ifeoluwa Olajubaje</p>
            <p class="text-gray-400 font-[Gilroy-Regular]">
              Founder & Developer
            </p>
            <p class="text-sm text-gray-500">@EmannCode</p>
          </div>
        </div>
      </section>

      <!-- Technology Section -->
      <section
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">Powered By</h2>
        <p
          class="text-lg text-gray-300 font-[Gilroy-Regular] leading-relaxed mb-6"
        >
          FilmRitz is built with modern web technologies to ensure a fast,
          reliable, and beautiful experience.
        </p>
        <div class="flex flex-wrap gap-3">
          <span
            class="px-4 py-2 bg-white/10 rounded-xl font-[Gilroy-SemiBold] text-sm"
            >Vue.js</span
          >
          <span
            class="px-4 py-2 bg-white/10 rounded-xl font-[Gilroy-SemiBold] text-sm"
            >TypeScript</span
          >
          <span
            class="px-4 py-2 bg-white/10 rounded-xl font-[Gilroy-SemiBold] text-sm"
            >Tailwind CSS</span
          >
          <span
            class="px-4 py-2 bg-white/10 rounded-xl font-[Gilroy-SemiBold] text-sm"
            >TMDB API</span
          >
          <span
            class="px-4 py-2 bg-white/10 rounded-xl font-[Gilroy-SemiBold] text-sm"
            >Supabase</span
          >
        </div>
      </section>

      <!-- Contact Section -->
      <section
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <h2 class="text-3xl font-[Gilroy-Bold] mb-4">Get In Touch</h2>
        <p
          class="text-lg text-gray-300 font-[Gilroy-Regular] leading-relaxed mb-6"
        >
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="mailto:olajubajeifeoluwa93@gmail.com"
            class="px-6 py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center justify-center gap-2"
          >
            <i class="pi pi-envelope text-xl"></i> Email Us
          </a>
          <a
            href="https://x.com/emanncodedev"
            target="_blank"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center justify-center gap-2"
          >
            <i class="pi pi-twitter text-lg"></i> Twitter
          </a>
          <a
            href="https://github.com/Emann-Code-01"
            target="_blank"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-[Gilroy-SemiBold] transition-all flex items-center justify-center gap-2"
          >
            <i class="pi pi-github text-xl"></i> GitHub
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
  title: "About FilmRitz | Movie & TV Discovery Platform",
  meta: [
    {
      name: "description",
      content:
        "Learn about FilmRitz, your premium movie and TV show discovery platform with trailers, curated collections, and personalized recommendations.",
    },
  ],
});
</script>
