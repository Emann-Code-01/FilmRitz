<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden"
  >
    <!-- Animated Background -->
    <div
      class="absolute inset-0 bg-linear-to-br from-[#b20710]/20 via-transparent to-[#e32125]/10"
    ></div>

    <div
      class="relative z-10 bg-black/60 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10"
    >
      <!-- Icon -->
      <div
        class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#b20710] flex items-center justify-center"
      >
        <span class="text-3xl">🔐</span>
      </div>

      <h1 class="text-3xl font-[Gilroy-Bold] text-white mb-2 text-center">
        Reset Password
      </h1>
      <p class="text-gray-400 text-center mb-8 font-[Gilroy-Regular]">
        Enter your new password below
      </p>

      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <!-- New Password -->
        <div>
          <label
            for="newPassword"
            class="block text-gray-300 text-sm mb-2 font-[Gilroy-Medium]"
          >
            New Password
          </label>
          <div class="relative">
            <input
              id="newPassword"
              name="newPassword"
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter new password"
              required
              minlength="6"
              class="w-full p-4 pr-12 rounded-xl bg-white/5 text-white border border-white/10 focus:ring-2 caret-white focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all font-[Gilroy-Regular]"
            />
            <button
              v-if="newPassword"
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label
            for="confirmPassword"
            class="block text-gray-300 text-sm mb-2 font-[Gilroy-Medium]"
          >
            Confirm Password
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
              required
              minlength="6"
              class="w-full p-4 pr-12 rounded-xl bg-white/5 text-white border border-white/10 focus:ring-2 caret-white focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all font-[Gilroy-Regular]"
            />
            <button
              v-if="confirmPassword"
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all"
            >
              <i
                :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
              ></i>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 rounded-xl bg-[#b20710] hover:bg-[#e32125] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-[Gilroy-Bold] text-white text-lg transform hover:scale-[1.02]"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>

        <!-- Error Message -->
        <p
          v-if="error"
          class="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20"
        >
          {{ error }}
        </p>

        <!-- Success Message -->
        <p
          v-if="success"
          class="text-green-400 text-sm text-center bg-green-400/10 p-3 rounded-xl border border-green-400/20"
        >
          ✅ Password reset successful! Redirecting...
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "vue-router";
import { useHead } from "@unhead/vue";

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const success = ref(false);
const error = ref("");

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }

  loading.value = true;
  error.value = "";

  const { error: resetError } = await supabase.auth.updateUser({
    password: newPassword.value,
  });

  loading.value = false;

  if (resetError) {
    error.value = resetError.message;
  } else {
    success.value = true;
    setTimeout(() => router.push("/ng/login"), 2000);
  }
};

useHead({
  title: "Reset Password | FilmRitz",
  meta: [
    {
      name: "description",
      content: "Create a new password for your FilmRitz account",
    },
  ],
});
</script>
