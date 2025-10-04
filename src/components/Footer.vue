<template>
    <footer class="relative z-10 bg-transparent min-h-fit w-full bottom-0">
        <div
            class="text-[#ffffffb3] font-[Gilroy-Medium] px-2 xl:px-32 md:px-14 py-18 transition-all animation-fade-up duration-900 space-y-8">
            <div class="">
                <router-link to="" class=" underline font-[Gilroy-Medium] text-lg cursor-pointer">
                    <p>Questions? Contact us.</p>
                </router-link>
            </div>
            <div class="mx-auto grid grid-cols-3 md:grid-cols-4 gap-3">
                <div v-for="(link, index) in links" :key="index">
                    <router-link :to="link.to"
                        class="underline font-[Gilroy-Medium] hover:text-gray-300 text-sm transition-all animation-fade-up duration-200">
                        {{ link.label }}
                    </router-link>
                </div>
            </div>
            <div class="pt-3">
                <p class="text-[rgba(255,255,255,0.7)] font-[Gilroy-SemiBold] text-sm">
                    FilmRitz Nigeria
                </p>
            </div>
            <div class="pt-3 text-xs text-[#737373] font-[Gilroy-SemiBold]">
                <p>© 2025 FILMRITZ, Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
const links = [
    {
        label: "FAQ",
        to: "/faq"
    },
    {
        label: "Help Center",
        to: "/help"
    },
    {
        label: "Account",
        to: "/account"
    },
    {
        label: "Media Center",
        to: "/media"
    },
    {
        label: "Investor Relations",
        to: "/investors"
    },
    {
        label: "Jobs",
        to: "/jobs"
    },
    {
        label: "Ways to Watch",
        to: "/watch"
    },
    {
        label: "Terms of Use",
        to: "/terms"
    },
    {
        label: "Privacy",
        to: "/privacy"
    },
    {
        label: "Cookie Preferences",
        to: "/cookies"
    },
    {
        label: "Corporate Information",
        to: "/corporate"
    },
    {
        label: "Contact Us",
        to: "/contact"
    },
    {
        label: "Speed Test",
        to: "/speed"
    },
    {
        label: "Legal Notices",
        to: "/legal"
    },
    {
        label: "Only on FilmRitz",
        to: "/exclusive"
    },
]
</script>

<style scoped></style>