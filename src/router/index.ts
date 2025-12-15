// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import SplashScreen from "@/pages/SplashScreen.vue";
import Home from "@/pages/Home.vue";
import Auth from "@/pages/auth/Auth.vue";
import MediaDetails from "@/pages/details/MediaDetails.vue";
import Search from "@/pages/search/Search.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import { useAuthStore } from "@/stores/auth";
import GenreView from "@/pages/genre/GenreView.vue";
import MediaPage from "@/pages/browse/MediaPage.vue";
import Profile from "@/pages/user/ProfileSettings.vue";
import ActorDetails from "@/pages/details/ActorDetails.vue";
import Watch from "@/pages/Watch.vue";
import TvDetails from "@/pages/TvDetails.vue";
import CollectionsPage from "@/pages/discovery/CollectionsPage.vue";
import TrendingTrailers from "@/pages/trailers/TrendingTrailers.vue";
import Trailers from "@/pages/trailers/TrailersPage.vue"
import NewReleases from "@/pages/discovery/NewReleases.vue";
import Popular from "@/pages/browse/PopularPage.vue";
import TopRated from "@/pages/browse/TopRatedPage.vue";
import ComingSoon from "@/pages/browse/ComingSoon.vue";
import Trending from "@/pages/browse/TrendingPage.vue";
import MyList from "@/pages/user/MyListPage.vue";
import History from "@/pages/user/HistoryPage.vue";
import About from "@/pages/static/AboutPage.vue";
import Privacy from "@/pages/static/PrivacyPage.vue";
import Terms from "@/pages/static/TermsPage.vue";
import Mood from "@/pages/discovery/MoodPage.vue"

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

const routes: RouteRecordRaw[] = [
  {
    path: "/ng",
    component: MainLayout,
    children: [
      // ═══════════════════════════════════════════════════════════════
      // CORE PAGES
      // ═══════════════════════════════════════════════════════════════
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

      // ═══════════════════════════════════════════════════════════════
      // AUTHENTICATION
      // ═══════════════════════════════════════════════════════════════
      {
        path: "login",
        name: "Auth",
        component: Auth,
        meta: { guestOnly: true },
      },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
        meta: { guestOnly: true },
      },
      {
        path: "reset-password/:token",
        name: "ResetPassword",
        component: ResetPassword,
        meta: { guestOnly: true },
      },

      // ═══════════════════════════════════════════════════════════════
      // MEDIA DETAILS
      // ═══════════════════════════════════════════════════════════════
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
        path: "actor/:name",
        name: "ActorDetails",
        component: ActorDetails,
        props: true,
        meta: { requiresAuth: true },
      },

      // ═══════════════════════════════════════════════════════════════
      // BROWSING & DISCOVERY
      // ═══════════════════════════════════════════════════════════════
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
        path: "tv-shows/:name",
        name: "TvDetails",
        component: TvDetails,
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
        path: "trending",
        name: "Trending",
        component: Trending,
        meta: { requiresAuth: true },
      },
      {
        path: "mood/:name",
        name: "Mood",
        component: Mood,
        meta: { requireAuth: true },
      },
      {
        path: "collections",
        name: "Collections",
        component: CollectionsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "new-releases",
        name: "NewReleases",
        component: NewReleases,
        meta: { requiresAuth: true },
      },
      {
        path: "trailers",
        name: "Trailers",
        components: Trailers,
        meta: { requireAuth: true },
      },
      {
        path: "trending-trailers",
        name: "TrendingTrailers",
        component: TrendingTrailers,
        meta: { requiresAuth: true },
      },
      {
        path: "popular",
        name: "Popular",
        component: Popular,
        meta: { requiresAuth: true },
      },
      {
        path: "top-rated",
        name: "TopRated",
        component: TopRated,
        meta: { requiresAuth: true },
      },
      {
        path: "coming-soon",
        name: "ComingSoon",
        component: ComingSoon,
        meta: { requiresAuth: true },
      },

      // ═══════════════════════════════════════════════════════════════
      // USER FEATURES
      // ═══════════════════════════════════════════════════════════════
      {
        path: "search",
        name: "Search",
        component: Search,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "my-list",
        name: "MyList",
        component: MyList,
        meta: { requiresAuth: true },
      },
      {
        path: "history",
        name: "History",
        component: History,
        meta: { requiresAuth: true },
      },

      // ═══════════════════════════════════════════════════════════════
      // STREAMING / WATCH PAGE
      // ═══════════════════════════════════════════════════════════════
      {
        path: "watch/:id",
        name: "Watch",
        component: Watch,
        props: true,
        meta: { requiresAuth: true },
      },

      // ═══════════════════════════════════════════════════════════════
      // STATIC FEATURES
      // ═══════════════════════════════════════════════════════════════
      {
        path: "about",
        name: "About",
        component: About,
        meta: { requiresAuth: true },
      },
      {
        path: "privacy-policy",
        name: "Privacy",
        component: Privacy,
        meta: { requiresAuth: true },
      },
      {
        path: "terms-of-service",
        name: "Terms",
        component: Terms,
        meta: { requiresAuth: true },
      },

      // ═══════════════════════════════════════════════════════════════
      // 404
      // ═══════════════════════════════════════════════════════════════
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/components/error/NotAvailable.vue"),
      },
    ],
  },

  {
    path: "/",
    redirect: "/ng",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// ═══════════════════════════════════════════════════════════════
// NAVIGATION GUARD
// ═══════════════════════════════════════════════════════════════
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
