<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden"
  >
    <!-- Animated Background -->
    <div
      class="absolute inset-0 bg-linear-to-br from-[#b20710]/20 via-transparent to-[#e32125]/10"
    ></div>

    <div
      class="relative z-10 bg-black/60 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 mt-18"
    >
      <!-- Icon -->
      <div
        class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#b20710] flex items-center justify-center"
      >
        <span class="text-3xl">🔑</span>
      </div>

      <h1 class="text-3xl font-[Gilroy-Bold] text-white mb-2 text-center">
        Reset Password
      </h1>
      <p class="text-gray-400 text-center mb-8 font-[Gilroy-Regular]">
        Enter your email and we'll send you a reset link
      </p>

      <form @submit.prevent="handleForgotPassword" class="space-y-5">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-gray-300 text-sm mb-2 font-[Gilroy-Medium]"
          >
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            class="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all font-[Gilroy-Regular]"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 rounded-xl bg-[#b20710] hover:bg-[#e32125] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-[Gilroy-Bold] text-white text-lg transform hover:scale-[1.02]"
        >
          {{ loading ? "Sending..." : "Send Reset Link" }}
        </button>

        <!-- Success Message -->
        <p
          v-if="message"
          class="text-green-400 text-sm text-center bg-green-400/10 p-3 rounded-xl border border-green-400/20"
        >
          {{ message }}
        </p>

        <!-- Error Message -->
        <p
          v-if="error"
          class="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20"
        >
          {{ error }}
        </p>
      </form>

      <!-- Back to Login -->
      <p class="text-gray-400 text-sm text-center mt-6 font-[Gilroy-Regular]">
        Remembered your password?
        <router-link
          to="/ng/login"
          class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] ml-1 transition-colors"
        >
          Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { supabase } from "@/lib/supabaseClient";

const email = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

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
    }, 2000);
  }
};

useHead({
  title: "Forgot Password | FilmRitz",
  meta: [{ name: "description", content: "Reset your FilmRitz password" }],
});
</script>
