// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/ng",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Auth",
    component: Auth,
    meta: { guestOnly: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/error/NotAvailable.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  await auth.syncUser();
  const isLoggedIn = auth.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (to.meta.guestOnly && isLoggedIn) {
    next("/ng"); // ✅ make sure this matches your Home route
  } else {
    next();
  }
});

export default router;
