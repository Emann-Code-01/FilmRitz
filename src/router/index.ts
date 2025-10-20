// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import Home from "../views/Home.vue";
import Auth from "../components/auth/Auth.vue";
import MovieDetails from "../components/movies/MovieDetails.vue";
import Watch from "../views/Watch.vue";
import Search from "../views/Search.vue";
import Profile from "../views/Profile.vue";
import ForgotPassword from "../components/auth/ForgotPassword.vue";
import ResetPassword from "../components/auth/ResetPassword.vue";
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
        path: "login",
        name: "Auth",
        component: Auth,
        meta: { guestOnly: true },
      },
      {
        path: "movie/:id",
        name: "MovieDetails",
        component: MovieDetails,
        props: true,
      },
      {
        path: '/ng/tv/:id',
        name: 'TVDetails',
        component: MovieDetails, // same component handles both
      },
      {
        path: "watch/:id",
        name: "Watch",
        component: Watch,
        props: true,
      },
      {
        path: "/ng/search",
        name: "Search",
        component: Search,
      },
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
      },
      {
        path: "/reset-password",
        name: "ResetPassword",
        component: ResetPassword,
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
  const visitedLogin = localStorage.getItem("visitedLogin");

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next("/login");
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return next("/ng");
  }

  if (
    ["/forgot-password", "/reset-password"].includes(to.path) &&
    !visitedLogin
  ) {
    return next("/ng/login");
  }

  next();
});


export default router;
