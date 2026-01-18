import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient";
import type { User, Session, AuthError } from "@supabase/supabase-js";

function mapAuthError(error: AuthError | null): string {
  if (!error?.message) {
    return "Something went wrong. Please try again.";
  }

  const msg = error.message;

  // LOGIN ERRORS
  if (msg.includes("Invalid login credentials")) {
    return "No account found with this email, or the password is incorrect.";
  }

  if (msg.includes("Email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  // SIGN UP ERRORS
  if (msg.includes("User already registered")) {
    return "An account with this email already exists.";
  }

  if (
    error.name === "AuthWeakPasswordError" ||
    msg.includes("Password should contain")
  ) {
    return (
      "Password must contain:\n" +
      "• At least one lowercase letter (a–z)\n" +
      "• At least one uppercase letter (A–Z)\n" +
      "• At least one number (0–9)\n" +
      "• At least one special character (!@#$%^&*)"
    );
  }

  if (msg.includes("Password should be at least")) {
    return "Password must be at least 6 characters long.";
  }

  if (msg.toLowerCase().includes("rate limit")) {
    return "Too many attempts. Please wait and try again.";
  }

  // FALLBACK
  return "Authentication failed. Please try again.";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    session: null as Session | null,
    loading: false,
    loaded: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.session?.user,
  },

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
        console.error(error);
        this.error = mapAuthError(error);
        return;
      }

      this.user = data.user;
      this.session = data.session;
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
      this.session = data.session;
    },

    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error("Supabase signOut error:", error);
          throw error;
        }
        
        this.user = null;
        this.session = null;
        this.loaded = true;
      } catch (error) {
        console.error("Sign out failed:", error);
        // Still clear local state even if API call fails
        this.user = null;
        this.session = null;
        this.loaded = true;
        throw error; // Re-throw so LogoutScreen can handle it
      }
    },

    async syncUser() {
      this.loaded = false;

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        this.user = data.session.user;
        this.session = data.session;
      } else {
        this.user = null;
        this.session = null;
      }

      this.loaded = true;
    },

    initAuthListener() {
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth event:", event);

        if (event === "SIGNED_IN") {
          this.user = session?.user ?? null;
          this.session = session;
        }

        if (event === "SIGNED_OUT") {
          this.user = null;
          this.session = null;
        }

        if (event === "TOKEN_REFRESHED") {
          this.session = session;
          this.user = session?.user ?? null;
        }

        if (event === "USER_UPDATED") {
          this.user = session?.user ?? null;
        }
      });
    },
  },
});
