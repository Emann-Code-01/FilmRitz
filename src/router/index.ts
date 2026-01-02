// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Eager load critical pages for initial render
import MainLayout from "@/components/layout/MainLayout.vue";
import SplashScreen from "@/pages/SplashScreen.vue";
import Home from "@/pages/Home.vue";
import Auth from "@/pages/auth/Auth.vue";

// Lazy load all other pages for better performance
const MediaDetails = () => import("@/pages/details/MediaDetails.vue");
const Search = () => import("@/pages/search/Search.vue");
const ForgotPassword = () => import("@/pages/auth/ForgotPassword.vue");
const ResetPassword = () => import("@/pages/auth/ResetPassword.vue");
const GenreView = () => import("@/pages/genre/GenreView.vue");
const MediaPage = () => import("@/pages/browse/MediaPage.vue");
const Profile = () => import("@/pages/user/ProfileSettings.vue");
const ActorDetails = () => import("@/pages/details/ActorDetails.vue");
const Watch = () => import("@/pages/Watch.vue");
const TvDetails = () => import("@/pages/TvDetails.vue");
const CollectionsPage = () => import("@/pages/discovery/CollectionsPage.vue");
const CollectionDetails = () =>
  import("@/pages/discovery/CollectionsDetailsPage.vue");
const TrendingTrailers = () => import("@/pages/trailers/TrendingTrailers.vue");
const Trailers = () => import("@/pages/trailers/TrailersPage.vue");
const NewReleases = () => import("@/pages/discovery/NewReleases.vue");
const Popular = () => import("@/pages/browse/PopularPage.vue");
const TopRated = () => import("@/pages/browse/TopRatedPage.vue");
const ComingSoon = () => import("@/pages/browse/ComingSoon.vue");
const Trending = () => import("@/pages/browse/TrendingPage.vue");
const MyList = () => import("@/pages/user/MyListPage.vue");
const History = () => import("@/pages/user/HistoryPage.vue");
const About = () => import("@/pages/static/AboutPage.vue");
const Privacy = () => import("@/pages/static/PrivacyPage.vue");
const Terms = () => import("@/pages/static/TermsPage.vue");
const Mood = () => import("@/pages/discovery/MoodPage.vue");
const Advertising = () => import("@/pages/AdsInfo.vue");
const TrailerCinema = () => import("@/pages/trailers/TrailerCinema.vue");

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
        path: "mood/:slug",
        name: "Mood",
        component: Mood,
        meta: { requiresAuth: true },
      },
      {
        path: "collections",
        name: "Collections",
        component: CollectionsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "collections/:name",
        name: "CollectionDetails",
        component: CollectionDetails,
        props: true,
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
        component: Trailers,
        meta: { requiresAuth: true },
      },
      {
        path: "trending-trailers",
        name: "TrendingTrailers",
        component: TrendingTrailers,
        meta: { requiresAuth: true },
      },
      {
        path: "trailercinema",
        name: "TrailerCinema",
        component: TrailerCinema,
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
        path: "advertising",
        name: "Advertising",
        component: Advertising,
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
router.beforeEach(async (to, _from, next) => {
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
