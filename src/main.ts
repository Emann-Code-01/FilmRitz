import { createApp } from "vue";
import { createHead } from "@unhead/vue";
import { createPinia } from "pinia";
import "./assets/style.css";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "@/stores/auth";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

const app = createApp(App);
const head = createHead();
const pinia = createPinia();

// Install Pinia FIRST
app.use(pinia);
app.use(head);
app.use(router);

// NOW initialize auth listener (after Pinia is available)
const authStore = useAuthStore();
authStore.initAuthListener();

// Mount the app
app.mount("#app");