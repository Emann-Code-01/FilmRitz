// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
// import MovieDetails from '../views/MovieDetails.vue';
import Watch from '../views/Watch.vue';
import Profile from '../views/Profile.vue';
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/ng",
    component: MainLayout,
    children: [
      {
        path: "",
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
        path: "/movie/:id",
        name: "MovieDetails",
        component: () => import("../views/MovieDetails.vue"),
        props: true,
      },
      {
        path: "/watch/:id",
        name: "Watch",
        component: Watch,
        props: true,
      },
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/error/NotAvailable.vue"),
      },
    ],
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
    next("/ng/login");
  } else if (to.meta.guestOnly && isLoggedIn) {
    next("/ng"); // ✅ make sure this matches your Home route
  } else {
    next();
  }
});

export default router;
