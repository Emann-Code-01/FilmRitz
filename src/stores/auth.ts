import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient";

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
      const { data, error } = await supabase.auth.signUp({ email, password });
      this.loading = false;
      if (error) this.error = error.message;
      else this.user = data.user;
    },

    async signIn(email: string, password: string) {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      this.loading = false;
      if (error) this.error = error.message;
      else this.user = data.user;
    },

    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      this.loaded = true; // prevent infinite "loading"
      localStorage.removeItem("user");
    },

    async syncUser() {
      this.loaded = false; // start loading
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        this.user = data.session.user;
        localStorage.setItem("user", JSON.stringify(this.user));
      } else {
        const cached = localStorage.getItem("user");
        this.user = cached ? JSON.parse(cached) : null;
      }
      this.loaded = true; // done loading
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
