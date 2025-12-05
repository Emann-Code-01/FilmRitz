// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import SplashScreen from "@/pages/SplashScreen.vue";
import Home from "@/pages/Home.vue";
import Auth from "@/pages/auth/Auth.vue";
import MediaDetails from "@/pages/details/MediaDetails.vue";
import Watch from "@/pages/Watch.vue";
import Search from "@/pages/search/Search.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import { useAuthStore } from "@/stores/auth";
import GenreView from "@/pages/genre/GenreView.vue";
import TvDetails from "@/pages/TvDetails.vue";
import Watchlist from "@/pages/user/Watchlist.vue";
import MediaPage from "@/pages/browse/MediaPage.vue";
import Collections from "@/pages/discovery/CollectionsPage.vue";
import CollectionsDetails from "@/pages/discovery/CollectionsDetailsPage.vue";
import MoodPage from "@/pages/discovery/MoodPage.vue";
import TrailersPage from "@/pages/trailers/TrailersPage.vue";
import Settings from "@/pages/user/ProfileSettings.vue";
import ActorDetails from "@/pages/details/ActorDetails.vue";
import NewReleases from "@/pages/discovery/NewReleases.vue";
import TrendinPage from "@/pages/browse/TrendinPage.vue";
import TrendingTrailers from "@/pages/trailers/TrendingTrailers.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/ng",
    component: MainLayout,
    children: [
      {
        path: "splash",
        name: "Splash",
        component: SplashScreen,
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
        path: "movie/:name",
        name: "MovieDetails",
        component: MediaDetails,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "tv/:name",
        name: "TVShowDetails",
        component: MediaDetails,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "tv-shows/:name",
        name: "TVDetails",
        component: TvDetails,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "trending",
        name: "TrendinPage",
        component: TrendinPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'new-releases',
        name: 'NewReleases',
        component: NewReleases,
        meta: { requiresAuth: true },
      },
      {
        path: 'trending-trailers',
        name: 'TrendingTrailers',
        component: TrendingTrailers,
      },
      {
        path: "watch/:name",
        name: "Watch",
        component: Watch,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "genre/:name",
        name: "GenreView",
        component: GenreView,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "search",
        name: "Search",
        component: Search,
      },
      {
        path: "watchlist",
        name: "Watchlist",
        component: Watchlist,
        meta: { requiresAuth: true },
      },
      {
        path: "movies",
        name: "Movies",
        component: MediaPage,
        props: { type: "movie" },
        meta: { requiresAuth: true },
      },
      {
        path: "tv-shows",
        name: "TVShows",
        component: MediaPage,
        props: { type: "tv" },
        meta: { requiresAuth: true },
      },
      {
        path: "actor/:name",
        name: "ActorDetails",
        component: ActorDetails,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: "collections",
        name: "Collections",
        component: Collections,
        meta: { requiresAuth: true },
      },
      {
        path: "collection/:id",
        name: "CollectionDetail",
        component: CollectionsDetails,
        meta: { requiresAuth: true },
      },
      {
        path: "mood/:name",
        name: "MoodPage",
        component: MoodPage,
        meta: { requiresAuth: true },
      },
      {
        path: "trailers",
        name: "TrailersPage",
        component: TrailersPage,
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        name: "Settings",
        component: Settings,
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
        component: () => import("@/components/error/NotAvailable.vue"),
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

// ==========================
// 🔥 FIXED NAV GUARD LOGIC
// ==========================
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  await auth.syncUser();
  const isLoggedIn = auth.isLoggedIn;

  const visitedSplash = localStorage.getItem("visitedSplash");

  // --- SPLASH FIRST VISIT ONLY ---
  if (!visitedSplash && to.name !== "Splash") {
    return next({ name: "Splash" });
  }

  if (to.name === "Splash") {
    localStorage.setItem("visitedSplash", "true");
  }

  // --- AUTH-ONLY ROUTES ---
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: "Auth", query: { redirect: to.fullPath } });
  }

  // --- GUEST-ONLY ROUTES ---
  if (to.meta.guestOnly && isLoggedIn) {
    return next("/ng");
  }

  next();
});

export default router;
