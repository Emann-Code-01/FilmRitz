import { defineStore } from "pinia";
import { supabase } from "../lib/supabaseClient";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    loading: false,
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
    },
    async syncUser() {
      const { data } = await supabase.auth.getSession();
      this.user = data.session?.user || null;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
