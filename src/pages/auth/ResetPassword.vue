<template>
  <div
    class="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo / Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-[Gilroy-Bold] mb-2">FilmRitz</h1>
        <p class="text-gray-400 font-[Gilroy-Medium]">Reset Your Password</p>
      </div>

      <!-- Form -->
      <div
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <!-- New Password -->
        <div class="mb-6">
          <label class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]">
            New Password
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter new password"
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-6">
          <label class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]">
            Confirm Password
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm new password"
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
          />
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm"
        >
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          @click="resetPassword"
          :disabled="loading"
          class="w-full py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>

        <!-- Back to Login -->
        <p class="text-center mt-6 text-gray-400 font-[Gilroy-Regular]">
          Remembered your password?
          <router-link
            to="/ng/login"
            class="text-[#b20710] hover:underline font-[Gilroy-SemiBold]"
          >
            Sign In
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { supabase } from "@/lib/supabaseClient";

const router = useRouter();

useHead({
  title: "Reset Password — FilmRitz",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const form = ref({
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");

const resetPassword = async () => {
  error.value = "";

  if (!form.value.password || !form.value.confirmPassword) {
    error.value = "Please fill in all fields";
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (form.value.password.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  loading.value = true;

  try {
    const { error: supabaseError } = await supabase.auth.updateUser({
      password: form.value.password,
    });

    if (supabaseError) throw supabaseError;

    router.push({
      name: "Auth",
      query: {
        success:
          "Password reset successful. Please log in with your new password.",
      },
    });
  } catch (err: any) {
    console.error("Reset password error:", err);
    error.value = err.message || "Failed to reset password. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
