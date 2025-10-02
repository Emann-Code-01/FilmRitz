// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import Home from "@/pages/HomePage.vue";
import PreviewHome from "@/pages/PreviewHome.vue";
// import Signup from "@/pages/SignIn.vue";
// import Profile from "@/pages/Profile.vue";
import { useAuthStore } from "../store/auth";

const routes: RouteRecordRaw[] = [
  // { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
  {
    path: "/ng/",
    name: "PreviewHome",
    component: PreviewHome,
    meta: { guestOnly: true },
  },
  // { path: "/signin", name: "SignIn", component: Signup },
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: Profile,
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotAvailable.vue"),
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
  const isLoggedIn = auth.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/ng/");
  } else if (to.meta.guestOnly && isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
