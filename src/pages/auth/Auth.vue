<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden"
  >
    <!-- Animated Background Gradient -->
    <div
      class="absolute inset-0 bg-linear-to-br from-[#b20710]/20 via-transparent to-[#e32125]/10 animate-gradient"
    ></div>

    <!-- Floating Particles Effect -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
    </div>

    <div
      class="relative z-10 bg-black/60 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 mt-18"
    >
      <h1 class="text-3xl font-[Gilroy-Bold] text-white mb-2 text-center">
        {{ isSignUp ? "Create Account" : "Welcome Back" }}
      </h1>
      <p class="text-gray-400 text-center mb-8 font-[Gilroy-Regular]">
        {{
          isSignUp
            ? "Join FilmRitz to start discovering"
            : "Sign in to continue, on your journey of discovery"
        }}
      </p>

      <form @submit.prevent="handleAuth" class="space-y-5">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-gray-300 text-sm mb-2 font-[Gilroy-Medium]"
            >Email Address</label
          >
          <input
            id="email"
            name="email"
            v-model="email"
            type="email"
            :disabled="auth.loading"
            autocomplete="email"
            placeholder="you@example.com"
            required
            class="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:ring-2 caret-white focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all font-[Gilroy-Regular]"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-gray-300 text-sm mb-2 font-[Gilroy-Medium]"
            >Password</label
          >
          <div class="relative">
            <input
              id="password"
              name="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :disabled="auth.loading"
              :autocomplete="isSignUp ? 'new-password' : 'current-password'"
              placeholder="Enter your password"
              required
              minlength="6"
              class="w-full p-4 pr-12 rounded-xl bg-white/5 text-white border border-white/10 focus:ring-2 caret-white focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all font-[Gilroy-Regular]"
            />
            <button
              v-if="password"
              type="button"
              @click="togglePassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duartion-500"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          ref="initialFocus"
          type="submit"
          :disabled="auth.loading"
          class="w-full py-4 rounded-xl bg-[#b20710] hover:bg-[#e32125] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-[Gilroy-Bold] text-white text-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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

        <!-- Error Message -->
        <p
          v-if="auth.error"
          class="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20"
        >
          {{ auth.error }}
        </p>

        <!-- Success Message -->
        <p
          v-if="success"
          class="text-green-400 text-sm text-center bg-green-400/10 p-3 rounded-xl border border-green-400/20"
        >
          {{
            isSignUp
              ? "🎉 Account created! Check your email to confirm."
              : "✅ Signed in successfully! Redirecting..."
          }}
        </p>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-black/60 text-gray-400 font-[Gilroy-Regular]"
            >OR</span
          >
        </div>
      </div>

      <!-- Footer Links -->
      <div class="space-y-3 text-center">
        <p class="text-gray-400 text-sm font-[Gilroy-Regular]">
          {{ isSignUp ? "Already have an account?" : "Don't have an account?" }}
          <button
            @click="toggleMode"
            class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] ml-1 transition-colors cursor-pointer"
          >
            {{ isSignUp ? "Sign In" : "Sign Up" }}
          </button>
        </p>

        <p class="text-sm text-gray-400 font-[Gilroy-Regular]">
          Forgot your password?
          <button
            @click="goToForgotPassword"
            class="text-[#b20710] hover:text-[#e32125] font-[Gilroy-SemiBold] ml-1 transition-colors"
          >
            Reset it
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useHead } from "@unhead/vue";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

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
  localStorage.setItem("visitedLogin", "true");
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

  const redirectPath = (route.query.redirect as string) || "/ng/splash";
  if (!auth.error) {
    success.value = true;
    router.push(redirectPath);
  }
};

const pageTitle = computed(() =>
  isSignUp.value ? "Create Account | FilmRitz" : "Sign In | FilmRitz",
);

useHead({
  title: pageTitle,
  meta: [
    {
      name: "description",
      content:
        "Sign in or create your FilmRitz account to explore movies and shows.",
    },
  ],
});
</script>

<style scoped>
@keyframes gradient {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-gradient {
  animation: gradient 8s ease-in-out infinite;
}

.particle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.particle-1 {
  background: #b20710;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  background: #e32125;
  bottom: 20%;
  right: 15%;
  animation-delay: 5s;
}

.particle-3 {
  background: #ff4500;
  top: 50%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
</style>
