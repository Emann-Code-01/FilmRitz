import { createApp } from "vue";
import { createHead } from "@unhead/vue";
import { createPinia } from "pinia";
import "./assets/style.css";
import App from "./App.vue";
import router from "./router";
import { injectSpeedInsights } from "@vercel/speed-insights";

// Quick boot-time redirect based on persisted auth to avoid flashing wrong page
try {
  const raw = localStorage.getItem("auth.user");
  const isLoggedIn = !!raw;
  // If visiting root and not logged in, redirect to /ng/ before app mounts
  const url = new URL(window.location.href);
  if (url.pathname === "/" || url.pathname === "") {
    if (!isLoggedIn) {
      url.pathname = "/ng/splash";
      window.location.replace(url.toString());
    } else {
      // already logged in, ensure the path stays '/'
      url.pathname = "/";
      // replace only if different
      if (window.location.pathname !== "/")
        window.location.replace(url.toString());
    }
  }
  // oxlint-disable-next-line no-unused-vars
} catch (_e) {
  // ignore localStorage/url errors
}

injectSpeedInsights();

const app = createApp(App);
const head = createHead();
const pinia = createPinia();
app.use(router).use(head).use(pinia).mount("#app");
