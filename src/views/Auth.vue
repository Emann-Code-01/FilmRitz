<template>
  <div
    class="min-h-screen flex items-center justify-center md:bg-[linear-gradient(to_top_left,_rgba(229,9,20,0.65)_0%,_rgba(255,75,0,0.55)_25%,_rgba(25,25,50,0.75)_75%,_rgba(0,0,10,0.85)_100%)] px-4 transition-all duration-700 animate-fade-up"
  >
    <div
      class="bg-[#0b0b0f]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative mt-18"
    >
      <h1 class="text-3xl font-[Gilroy-Bold] text-white mb-6 text-center">
        {{
          isSignUp ? "Create a FilmRitz Account" : "Welcome Back to FilmRitz"
        }}
      </h1>

      <form @submit.prevent="handleAuth" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-gray-300 text-sm mb-2"
            >Email</label
          >
          <input
            id="email"
            name="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="Enter your email"
            required
            class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 caret-white focus:ring-red-600 focus:outline-none"
          />
        </div>

        <div
          class="flex items-center w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus-within:ring-2 caret-white focus:ring-red-600 focus:outline-none"
        >
          <input
            id="password"
            name="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :autocomplete="isSignUp ? 'new-password' : 'current-password'"
            placeholder="Enter your password"
            required
            minlength="6"
            class="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <!-- 👁 Toggle password visibility -->
          <button
            v-if="password"
            type="button"
            @click="togglePassword"
            class="text-gray-400 hover:text-white transition-all duration-200 focus:outline-none"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <button
          ref="initialFocus"
          type="submit"
          :disabled="auth.loading"
          class="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-[Gilroy-SemiBold] text-white"
        >
          {{
            auth.loading
              ? isSignUp
                ? "Creating Account..."
                : "Signing In..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"
          }}
        </button>

        <p v-if="auth.error" class="text-red-400 text-sm text-center mt-3">
          {{ auth.error }}
        </p>

        <p v-if="success" class="text-green-400 text-sm text-center mt-3">
          {{
            isSignUp
              ? "🎉 Account created successfully! Check your inbox to confirm your email."
              : "✅ Signed in successfully! Redirecting..."
          }}
        </p>
      </form>
      <div class="text-center mt-6">
        <p class="text-gray-400 text-sm">
          {{ isSignUp ? "Already have an account?" : "Don’t have an account?" }}
          <button
            ref="initialFocus"
            @click="toggleMode"
            class="text-red-500 hover:underline font-medium cursor-pointer"
          >
            {{ isSignUp ? "Sign In" : "Sign Up" }}
          </button>
        </p>
        <h1>OR</h1>
        <p class="text-sm text-gray-400">
          Forgot your password?
          <button
            @click="goToForgotPassword"
            class="text-indigo-400 hover:underline"
          >
            Reset it
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { supabase } from "../lib/supabaseClient";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const showPassword = ref(false);
const success = ref(false);
const isSignUp = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const goToForgotPassword = () => {
  router.push("/forgot-password");
};

// ✅ Pull prefilled email if it exists
onMounted(() => {
  const savedEmail = localStorage.getItem("prefillEmail");
  if (savedEmail) {
    email.value = savedEmail;
    localStorage.removeItem("prefillEmail");
  }
});

const toggleMode = () => {
  auth.error = null;
  success.value = false;
  isSignUp.value = !isSignUp.value;
};

const handleAuth = async () => {
  success.value = false;
  if (isSignUp.value) {
    await auth.signUp(email.value, password.value);
  } else {
    await auth.signIn(email.value, password.value);
  }

  if (!auth.error) {
    success.value = true;
    if (!isSignUp.value) {
      setTimeout(() => router.push("/ng"), 800);
    }
  }
};
</script>
