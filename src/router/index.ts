// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PreviewHome from "@/views/PreviewHome.vue";
// import Home from "@/views/HomePage.vue";
import Auth from "@/views/Auth.vue"; // your dual login/signup page
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/ng",
    name: "PreviewHome",
    component: PreviewHome,
    meta: { guestOnly: true },
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
    component: () => import("@/views/error/NotAvailable.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Make sure store reflects Supabase session
  auth.syncUser();

  const isLoggedIn = !!auth.user;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/ng");
  } else if (to.meta.guestOnly && isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
