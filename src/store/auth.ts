import { defineStore } from "pinia";

export interface User {
  id: number;
  email: string;
}

export interface AuthState {
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state): boolean => state.user !== null,
  },

  actions: {
    login(email: string, password: string) {
      if (email === "test@example.com" && password === "password") {
        this.user = { id: 1, email };
      } else {
        throw new Error("Invalid credentials (use test@example.com / password)");
      }
    },
    signup(email: string, _password: string) {
      this.user = { id: Date.now(), email };
    },

    logout() {
      this.user = null;
    },
  },
});
