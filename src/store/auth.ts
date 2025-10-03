import { defineStore } from "pinia";

export interface User {
  id: number;
  email: string;
}

export interface AuthState {
  user: User | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    let user: User | null = null;
    try {
      const raw = localStorage.getItem("auth.user");
      if (raw) user = JSON.parse(raw);
    } catch {
      // ignore parse/storage errors
    }
    return { user };
  },

  getters: {
    isLoggedIn: (state: AuthState): boolean => !!state.user,
    currentUser: (state: AuthState): User | null => state.user,
  },

  actions: {
    async login(this: AuthState, email: string, password: string) {
      // Fake login for demo purposes
      if (email === "test@example.com" && password === "password") {
        this.user = { id: 1, email };
        try {
          localStorage.setItem("auth.user", JSON.stringify(this.user));
        } catch {
          // ignore
        }
        return true;
      }
      return false;
    },

    async signup(this: AuthState, email: string, _password: string) {
      // Fake signup for demo purposes
      this.user = { id: Date.now(), email };
      try {
        localStorage.setItem("auth.user", JSON.stringify(this.user));
      } catch {
        // ignore
      }
      return true;
    },

    logout(this: AuthState) {
      this.user = null;
      try {
        localStorage.removeItem("auth.user");
      } catch {
        // ignore
      }
    },
  },
});
