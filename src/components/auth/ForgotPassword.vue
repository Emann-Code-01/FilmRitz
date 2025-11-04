<template>
  <div
    class="min-h-screen flex items-center justify-center md:bg-[linear-gradient(to_top_left,_rgba(229,9,20,0.65)_0%,_rgba(255,75,0,0.55)_25%,_rgba(25,25,50,0.75)_75%,_rgba(0,0,10,0.85)_100%)] px-4 transition-all duration-700 animate-fade-up">
    <div
      class="bg-[#0b0b0f]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative mt-18">
      <h1 class="text-3xl font-[Gilroy-Bold] text-white mb-6 text-center">
        Reset Your Password 🔑
      </h1>

      <p class="text-gray-400 text-sm text-center mb-6">
        Enter your account email and we’ll send you a password reset link.
      </p>

      <form @submit.prevent="handleForgotPassword" class="space-y-5">
        <div>
          <label for="email" class="block text-gray-300 text-sm mb-2">
            Email Address
          </label>
          <input id="email" v-model="email" type="email" placeholder="Enter your email" required
            class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-red-600 focus:outline-none" />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-[Gilroy-SemiBold] text-white">
          {{ loading ? "Sending..." : "Send Reset Link" }}
        </button>

        <p v-if="message" class="text-green-400 text-sm text-center mt-3">
          {{ message }}
        </p>

        <p v-if="error" class="text-red-400 text-sm text-center mt-3">
          {{ error }}
        </p>
      </form>

      <p class="text-gray-400 text-sm text-center mt-6">
        Remembered your password?
        <RouterLink to="/login" class="text-red-500 hover:underline font-medium">
          Sign In
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHead } from '@unhead/vue';
import { supabase } from "../../lib/supabaseClient";

const email = ref("");
const message = ref("");
const error = ref("");

const router = useRouter();

const loading = ref(false);

const handleForgotPassword = async () => {
  error.value = "";
  message.value = "";

  if (!email.value) {
    error.value = "Please enter your email.";
    return;
  }

  loading.value = true;

  const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
    email.value,
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  loading.value = false;

  if (supabaseError) {
    error.value = supabaseError.message;
  } else {
    message.value = "✅ Password reset link sent! Check your email.";
    setTimeout(() => {
      router.push("/ng/login");
    }, 1500);
  }
};

useHead({
  title: 'Forgot Password | FilmRitz — Discover Movies & TV Series',
  meta: [
    {
      name: 'description',
      content:
        'Reset your FilmRitz account password quickly and securely. Receive a password reset link via email to regain access to your account.',
    },
    {
      name: 'keywords',
      content:
        'FilmRitz, reset password, account recovery, forgot password, movie streaming, login help',
    },

    // Open Graph (for Facebook / LinkedIn)
    { property: 'og:title', content: 'Forgot Password | FilmRitz' },
    {
      property: 'og:description',
      content:
        'Forgot your password? Get a reset link to recover your FilmRitz account and continue exploring movies and shows.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://filmritz.vercel.app/forgot-password' },
    { property: 'og:image', content: 'https://filmritz.vercel.app/default-og.jpg' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Forgot Password | FilmRitz' },
    {
      name: 'twitter:description',
      content:
        'Recover your FilmRitz account easily — request a password reset link sent to your email address.',
    },
    { name: 'twitter:image', content: 'https://filmritz.vercel.app/default-og.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://filmritz.vercel.app/forgot-password' },
  ],
})
</script>
