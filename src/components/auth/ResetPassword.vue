<template>
  <div
    class="min-h-screen flex items-center justify-center md:bg-[linear-gradient(to_top_left,rgba(229,9,20,0.65)_0%,rgba(255,75,0,0.55)_25%,rgba(25,25,50,0.75)_75%,rgba(0,0,10,0.85)_100%)] px-4 transition-all duration-700 animate-fade-up">
    <div
      class="bg-[#0b0b0f]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative">
      <h1 class="text-3xl font-[Gilroy-Bold] text-white mb-6 text-center">
        Reset Your Password
      </h1>

      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <!-- New Password -->
        <div>
          <label for="newPassword" class="block text-gray-300 text-sm mb-2">
            New Password
          </label>
          <div
            class="flex items-center w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus-within:ring-2 caret-white focus-within:ring-red-600 focus:outline-none">
            <input id="newPassword" name="newPassword" v-model="newPassword" :type="showPassword ? 'text' : 'password'"
              placeholder="Enter new password" required minlength="6"
              class="flex-1 bg-transparent outline-none text-white placeholder-gray-400" />
            <button type="button" @click="showPassword = !showPassword" class="ml-2 text-gray-400 hover:text-white">
              <i v-if="newPassword" :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-gray-300 text-sm mb-2">
            Confirm Password
          </label>
          <div
            class="flex items-center w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus-within:ring-2 caret-white focus-within:ring-red-600 focus:outline-none">
            <input id="confirmPassword" name="confirmPassword" v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm new password" required
              minlength="6" class="flex-1 bg-transparent outline-none text-white placeholder-gray-400" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
              class="ml-2 text-gray-400 hover:text-white">
              <i v-if="confirmPassword" :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit"
          class="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-[Gilroy-SemiBold] text-white"
          :disabled="loading">
          {{ loading ? "Resetting Password..." : "Reset Password" }}
        </button>

        <p v-if="error" class="text-red-400 text-sm text-center mt-3">
          {{ error }}
        </p>

        <p v-if="success" class="text-green-400 text-sm text-center mt-3">
          ✅ Password successfully reset! Redirecting...
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "vue-router";
import { useHead } from '@unhead/vue'

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
  title: 'Reset Password | FilmRitz — Discover Movies & TV Series',
  meta: [
    {
      name: 'description',
      content:
        'Reset your FilmRitz password securely. Create a new password to regain access to your account and continue watching your favorite movies and shows.',
    },
    {
      name: 'keywords',
      content:
        'FilmRitz, reset password, change password, account recovery, movie app, secure login, Ifeoluwa Olajubaje, EmannCode, EmannCodeDev',
    },

    // Open Graph (Facebook / LinkedIn)
    { property: 'og:title', content: 'Reset Password | FilmRitz' },
    {
      property: 'og:description',
      content:
        'Reset your FilmRitz password easily and regain access to your personalized movie streaming experience.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://filmritz.vercel.app/ng/reset-password' },
    { property: 'og:image', content: 'https://filmritz.vercel.app/filmritzlogo2.png' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Reset Password | FilmRitz' },
    {
      name: 'twitter:description',
      content:
        'Securely reset your FilmRitz password and get back to streaming your favorite movies and series.',
    },
    { name: 'twitter:image', content: 'https://filmritz.vercel.app/filmritzlogo2.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://filmritz.vercel.app/ng/reset-password' },
  ],
})
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.8s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
