import { createApp } from 'vue'
import { createPinia } from "pinia";
import '@/assets/style.css'
import App from './App.vue'
import router from './router'

// Quick boot-time redirect based on persisted auth to avoid flashing wrong page
try {
	const raw = localStorage.getItem('auth.user');
	const isLoggedIn = !!raw;
	// If visiting root and not logged in, redirect to /ng/ before app mounts
	const url = new URL(window.location.href);
	if (url.pathname === '/' || url.pathname === '') {
		if (!isLoggedIn) {
			url.pathname = '/ng/';
			window.location.replace(url.toString());
		} else {
			// already logged in, ensure the path stays '/'
			url.pathname = '/';
			// replace only if different
			if (window.location.pathname !== '/') window.location.replace(url.toString());
		}
	}
} catch (_e) {
	// ignore localStorage/url errors
}

const app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).mount('#app');

