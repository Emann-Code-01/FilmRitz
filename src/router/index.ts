// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import SplashScreen from "../views/SplashScreen.vue";
import Home from "../views/Home.vue";
import Auth from "../components/auth/Auth.vue";
import MovieDetails from "../components/media/MediaDetails.vue";
import Watch from "../views/Watch.vue";
import Search from "../views/Search.vue";
import Profile from "../views/Profile.vue";
import ForgotPassword from "../components/auth/ForgotPassword.vue";
import ResetPassword from "../components/auth/ResetPassword.vue";
import { useAuthStore } from "../stores/auth";
import GenreView from "../views/GenreView.vue";
import TvDetails from "../components/media/TvDetails.vue";
import Watchlist from "../components/media/Watchlist.vue";
import MediaPage from "../components/media/MediaPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/ng",
    component: MainLayout,
    children: [
      {
        path: "splash",
        name: "Splash",
        component: SplashScreen,
        meta: { requiresAuth: true },
      },
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
        path: "movie/:name", //
        name: "MovieDetails",
        component: MovieDetails,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: 'tv/:name',
        name: 'TVDetails',
        component: MovieDetails,
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: "watch/:name",
        name: "Watch",
        component: Watch,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "/tv/:name",
        name: "tv-details",
        component: TvDetails,
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: "genre/:name",
        name: "GenreView",
        component: GenreView,
        props: true,
      },
      {
        path: "search",
        name: "Search",
        component: Search,
      },
      {
        path: 'watchlist',
        name: 'Watchlist',
        component: Watchlist,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "movies",
        name: "Movies",
        component: MediaPage,
        props: { type: 'movie' },
        meta: { requiresAuth: true },
      },
      {
        path: "tv-shows",
        name: "TVShows",
        component: MediaPage,
        props: { type: 'tv' },
        meta: { requiresAuth: true },
      },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
      },
      {
        path: "reset-password",
        name: "ResetPassword",
        component: ResetPassword,
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../components/error/NotAvailable.vue"),
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
  const visitedSplash = localStorage.getItem("visitedSplash");

  if (!visitedSplash && to.name !== "Splash") {
    return next({ name: "Splash" });
  }

  if (to.name === "Splash") {
    localStorage.setItem("visitedSplash", "true");
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: "Auth", query: { redirect: to.fullPath } });
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return next("/ng");
  }

  if (
    ["/ng/forgot-password", "/ng/reset-password"].includes(to.path) &&
    !visitedLogin && !isLoggedIn
  ) {
    return next("/ng/login");
  }

  if (to.name === "Splash" && from.name !== "Auth") {
    return next("/ng");
  }

  next();
});


export default router;
