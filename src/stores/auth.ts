import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient";

function mapAuthError(error: any): string {
  if (!error?.message) return "Something went wrong. Please try again.";

  const msg = error.message;

  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password";
  }

  if (msg.includes("Email not confirmed")) {
    return "Please confirm your email before signing in";
  }

  if (msg.includes("User already registered")) {
    return "An account with this email already exists";
  }

  if (msg.includes("Password should be at least")) {
    return "Password must be at least 6 characters";
  }

  if (msg.includes("rate limit")) {
    return "Too many attempts. Please wait and try again";
  }

  return "Authentication failed. Please try again.";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    loading: false,
    loaded: false,
    error: null as string | null,
  }),

  actions: {
    async signUp(email: string, password: string) {
      this.loading = true;
      this.error = null;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      this.loading = false;

      if (error) {
        console.error(error); // keep raw error for debugging
        this.error = mapAuthError(error);
        return;
      }

      this.user = data.user;
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    async signIn(email: string, password: string) {
      this.loading = true;
      this.error = null;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      this.loading = false;

      if (error) {
        console.error(error);
        this.error = mapAuthError(error);
        return;
      }

      this.user = data.user;
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      this.loaded = true;
      localStorage.removeItem("user");
    },

    async syncUser() {
      this.loaded = false;
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        this.user = data.session.user;
        localStorage.setItem("user", JSON.stringify(this.user));
      } else {
        const cached = localStorage.getItem("user");
        this.user = cached ? JSON.parse(cached) : null;
      }

      this.loaded = true;
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
