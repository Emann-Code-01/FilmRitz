<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white pb-20 mt-10">
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HERO HEADER -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="relative pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <!-- Ambient Glow -->
      <div
        class="absolute inset-0 bg-linear-to-b from-[#b20710]/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto">
        <div class="md:flex items-center gap-4 hidden">
          <div
            class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
          >
            👤
          </div>
          <div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Profile & Settings
            </h1>
            <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
              Manage your account preferences
            </p>
          </div>
        </div>
        <div class="grid items-center gap-4 md:hidden">
          <div class="flex items-center space-x-3">
            <div
              class="w-20 aspect-square rounded-full bg-[#b20710]/20 border-2 border-[#b20710] flex items-center justify-center text-4xl leading-none"
            >
              👤
            </div>
            <h1 class="text-5xl md:text-6xl font-[Gilroy-Bold]">
              Profile & Settings
            </h1>
          </div>
          <p class="text-xl text-gray-400 font-[Gilroy-Medium] mt-2">
            Manage your account preferences
          </p>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- CONTENT -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="px-6 md:px-10 max-w-4xl mx-auto">
      <!-- Tab Navigation -->
      <div class="flex gap-2 mb-8 border-b border-white/10">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-3 md:px-6 py-2 md:py-2.5 font-[Gilroy-SemiBold] transition-all relative cursor-pointer"
          :class="
            activeTab === tab.value
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          "
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.value"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b20710] cursor-pointer"
          ></div>
        </button>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- ACCOUNT TAB -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'account'" class="space-y-6">
        <!-- Profile Picture -->
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 class="text-2xl font-[Gilroy-Bold] mb-4">Profile Picture</h2>
          <div class="flex items-center gap-6">
            <div
              class="w-24 h-24 rounded-full bg-linear-to-br from-[#b20710] to-[#e32125] flex items-center justify-center text-4xl"
            >
              👤
            </div>
            <div>
              <button
                class="px-3 md:px-6 py-2 md:py-2.5 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-SemiBold] transition-alldisabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Change Picture
              </button>
              <p class="text-gray-400 text-sm mt-2 font-[Gilroy-Regular]">
                JPG, PNG or GIF. Max size 2MB
              </p>
            </div>
          </div>
        </div>

        <!-- Account Info -->
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 class="text-2xl font-[Gilroy-Bold] mb-6">Account Information</h2>

          <div class="space-y-4">
            <!-- Email -->
            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >Email</label
              >
              <input
                v-model="userEmail"
                type="email"
                disabled
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] opacity-50 cursor-not-allowed"
              />
            </div>

            <!-- Display Name -->
            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >Display Name</label
              >
              <input
                v-model="displayName"
                type="text"
                placeholder="Enter your name"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <!-- Bio -->
            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >Bio</label
              >
              <textarea
                v-model="bio"
                rows="4"
                placeholder="Tell us about yourself"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all resize-none"
              ></textarea>
            </div>

            <!-- Save Button -->
            <button
              @click="saveAccountSettings"
              :disabled="saving"
              class="w-full py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all disabled:opacity-50 cursor-pointer"
            >
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>

        <!-- Change Password -->
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 class="text-2xl font-[Gilroy-Bold] mb-6">Change Password</h2>

          <div class="space-y-4">
            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >Current Password</label
              >
              <input
                v-model="currentPassword"
                type="password"
                placeholder="Enter current password"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >New Password</label
              >
              <input
                v-model="newPassword"
                type="password"
                placeholder="Enter new password"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >Confirm New Password</label
              >
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <button
              @click="changePassword"
              :disabled="changingPassword"
              class="w-full py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all disabled:opacity-50 cursor-pointer"
            >
              {{ changingPassword ? "Updating..." : "Update Password" }}
            </button>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- PREFERENCES TAB -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'preferences'" class="space-y-6">
        <!-- Content Preferences -->
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 class="text-2xl font-[Gilroy-Bold] mb-6">Content Preferences</h2>

          <div class="space-y-4">
            <!-- Favorite Genres -->
            <div>
              <label
                class="block text-gray-400 text-sm mb-3 font-[Gilroy-Medium]"
                >Favorite Genres</label
              >
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="genre in allGenres"
                  :key="genre.id"
                  @click="toggleGenre(genre.id)"
                  class="px-4 py-2 rounded-xl font-[Gilroy-SemiBold] transition-all"
                  :class="
                    favoriteGenres.includes(genre.id)
                      ? 'bg-[#b20710] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  "
                >
                  {{ genre.name }}
                </button>
              </div>
            </div>

            <!-- Language Preference -->
            <div>
              <label
                class="block text-gray-400 text-sm mb-2 font-[Gilroy-Medium]"
                >Preferred Language</label
              >
              <select
                v-model="preferredLanguage"
                class="w-full px-4 py-3 rounded-xl bg-gray-700 border border-white/10 text-white font-[Gilroy-Regular] focus:ring-2 focus:ring-[#b20710] focus:border-transparent focus:outline-none transition-all"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>

            <!-- Autoplay Trailers -->
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-white font-[Gilroy-SemiBold]">
                  Autoplay Trailers
                </p>
                <p class="text-gray-400 text-sm font-[Gilroy-Regular]">
                  Automatically play trailers when browsing
                </p>
              </div>
              <button
                @click="autoplayTrailers = !autoplayTrailers"
                class="relative w-14 h-7 rounded-full transition-all"
                :class="
                  autoplayTrailers
                    ? 'bg-[#b20710] cursor-pointer'
                    : 'bg-gray-600 cursor-pointer'
                "
              >
                <div
                  class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                  :class="autoplayTrailers ? 'translate-x-7' : ''"
                ></div>
              </button>
            </div>

            <!-- Save Button -->
            <button
              @click="savePreferences"
              :disabled="saving"
              class="w-full py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all disabled:opacity-50 cursor-pointer"
            >
              {{ saving ? "Saving..." : "Save Preferences" }}
            </button>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- PRIVACY TAB -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'privacy'" class="space-y-6">
        <div
          class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 class="text-2xl font-[Gilroy-Bold] mb-6">Privacy Settings</h2>

          <div class="space-y-6">
            <!-- Profile Visibility -->
            <div
              class="flex items-center justify-between py-3 border-b border-white/10"
            >
              <div>
                <p class="text-white font-[Gilroy-SemiBold]">Public Profile</p>
                <p class="text-gray-400 text-sm font-[Gilroy-Regular]">
                  Allow others to view your watchlist and favorites
                </p>
              </div>
              <button
                @click="publicProfile = !publicProfile"
                class="relative w-14 h-7 rounded-full transition-all"
                :class="publicProfile ? 'bg-[#b20710]' : 'bg-gray-600'"
              >
                <div
                  class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                  :class="publicProfile ? 'translate-x-7' : ''"
                ></div>
              </button>
            </div>

            <!-- Activity Tracking -->
            <div
              class="flex items-center justify-between py-3 border-b border-white/10"
            >
              <div>
                <p class="text-white font-[Gilroy-SemiBold]">
                  Activity Tracking
                </p>
                <p class="text-gray-400 text-sm font-[Gilroy-Regular]">
                  Help improve recommendations
                </p>
              </div>
              <button
                @click="activityTracking = !activityTracking"
                class="relative w-14 h-7 rounded-full transition-all"
                :class="activityTracking ? 'bg-[#b20710]' : 'bg-gray-600'"
              >
                <div
                  class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                  :class="activityTracking ? 'translate-x-7' : ''"
                ></div>
              </button>
            </div>

            <!-- Email Notifications -->
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-white font-[Gilroy-SemiBold]">
                  Email Notifications
                </p>
                <p class="text-gray-400 text-sm font-[Gilroy-Regular]">
                  Receive updates about new releases
                </p>
              </div>
              <button
                @click="emailNotifications = !emailNotifications"
                class="relative w-14 h-7 rounded-full transition-all"
                :class="emailNotifications ? 'bg-[#b20710]' : 'bg-gray-600'"
              >
                <div
                  class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                  :class="emailNotifications ? 'translate-x-7' : ''"
                ></div>
              </button>
            </div>

            <!-- Save Button -->
            <button
              @click="savePrivacySettings"
              :disabled="saving"
              class="w-full py-3 bg-[#b20710] hover:bg-[#e32125] rounded-xl font-[Gilroy-Bold] transition-all disabled:opacity-50 cursor-pointer"
            >
              {{ saving ? "Saving..." : "Save Privacy Settings" }}
            </button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div
          class="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30"
        >
          <h2 class="text-2xl font-[Gilroy-Bold] text-red-400 mb-4">
            Danger Zone
          </h2>

          <div class="space-y-4">
            <button
              @click="confirmLogout"
              class="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-[Gilroy-Bold] transition-all cursor-pointer"
            >
              Sign Out
            </button>

            <button
              @click="confirmDeleteAccount"
              class="w-full py-3 bg-red-600/20 hover:bg-red-600 border border-red-500/50 rounded-xl font-[Gilroy-Bold] text-red-400 hover:text-white transition-all cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-8 right-8 bg-black/90 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { genreMap } from "@/types/media";

const auth = useAuthStore();
const router = useRouter();

const tabs = [
  { label: "Account", value: "account" },
  { label: "Preferences", value: "preferences" },
  { label: "Privacy", value: "privacy" },
];

const activeTab = ref("account");

// Account Settings
const userEmail = ref("user@example.com");
const displayName = ref("");
const bio = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Preferences
const allGenres = Object.entries(genreMap)
  .map(([id, name]) => ({
    id: Number(id),
    name,
  }))
  .slice(0, 10);

const favoriteGenres = ref<number[]>([]);
const preferredLanguage = ref("en");
const autoplayTrailers = ref(true);

// Privacy
const publicProfile = ref(false);
const activityTracking = ref(true);
const emailNotifications = ref(true);

// UI State
const saving = ref(false);
const changingPassword = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

const toggleGenre = (genreId: number) => {
  if (favoriteGenres.value.includes(genreId)) {
    favoriteGenres.value = favoriteGenres.value.filter((id) => id !== genreId);
  } else {
    favoriteGenres.value.push(genreId);
  }
};
const saveAccountSettings = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  saving.value = false;
  toastMessage.value = "✅ Account settings saved";
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};
const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toastMessage.value = "❌ Passwords do not match";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 3000);
    return;
  }
  changingPassword.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  changingPassword.value = false;
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  toastMessage.value = "✅ Password updated successfully";
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};
const savePreferences = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  saving.value = false;
  toastMessage.value = "✅ Preferences saved";
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};
const savePrivacySettings = async () => {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  saving.value = false;
  toastMessage.value = "✅ Privacy settings saved";
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};
const confirmLogout = () => {
  if (confirm("Are you sure you want to sign out?")) {
    auth.signOut();
    router.push("/ng/login");
  }
};
const confirmDeleteAccount = () => {
  if (
    confirm(
      "⚠️ This action cannot be undone. Are you sure you want to delete your account?"
    )
  ) {
    // Implement account deletion
    toastMessage.value = "🗑️ Account deletion initiated";
    showToast.value = true;
  }
};
onMounted(() => {
  // Load user settings from auth store or API
  if (auth.user) {
    userEmail.value = auth.user.email || "";
  }
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
