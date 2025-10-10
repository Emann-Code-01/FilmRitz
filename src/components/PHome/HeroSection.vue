<template>
    <div class="relative w-full overflow-hidden h-screen bg-fixed bg-center bg-cover bg-no-repeat transition-all mb-9"
        :style="{ backgroundImage: `url('${bgUrl}')` }">
        <div v-if="!loaded" class="absolute inset-0 bg-black/80"></div>
        <div class="absolute inset-0 bg-[linear-gradient(to_bottom,_#000000CC_10%,_#00000099_50%,_#000000_100%)]"></div>
        <div
            class="relative z-20 flex flex-col xl:pt-10 text-center items-center justify-center h-full text-white gap-7 transition-all duration-900 animate-fade-up">
            <div class="items-center flex flex-col gap-3">
                <h1 class="font-[Gilroy-Bold] xl:text-6xl text-4xl max-w-2xl text-center xl:leading-14 ">Unlimited
                    movies, TV shows, and
                    more</h1>
                <p class="font-[Gilroy-Bold] text-xl">Watch anywhere. Cancel anytime.</p>
                <h3 class="font-[Gilroy-Medium] max-w-96 md:max-w-full">Ready to watch? Enter your email
                    to create or restart your
                    membership.
                </h3>
            </div>
            <div class="grid">
                <div class="grid md:flex gap-3 place-items-center">
                    <div class="relative md:w-96">
                        <input v-model="email" id="emailInput" type="email" autocomplete="email" placeholder=" " :class="[
                            'peer w-50 md:w-full border border-[#808080] bg-black/50 text-white rounded-sm caret-white px-3 pt-5 pb-2 min-w-80 md:min-w-96 font-[Gilroy-Medium]',
                            'focus:outline-none focus:ring-2 text-base transition-all',
                            ringColor
                        ]" />
                        <label for="emailInput" :class="[
                            'absolute left-3 font-[Gilroy-Medium] transition-all slide-fade-enter-active',
                            email ? 'top-2 text-xs text-[#BDBCBB] pl-0.5'
                                : 'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400',
                            'peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#BDBCBB] peer-focus:pl-0.5'
                        ]">
                            Email address
                        </label>
                        <div class="md:hidden">
                            <p v-if="showError"
                                class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max">
                                <i class="pi pi-times-circle flex items-center text-xs"></i>
                                {{ errorMessage }}
                            </p>
                        </div>
                    </div>
                    <button ref="initialFocus" @click="handleGetStarted"
                        class="gap-3 bg-[#b20710] text-white font-[Gilroy-Bold] md:text-2xl px-8 py-4 md:py-3 rounded-sm hover:bg-[#e32125] group transition-all duration-500 cursor-pointer">
                        Get Started
                        <i class="pi pi-chevron-right text-xl group-hover:animate-pulse"></i>
                    </button>
                </div>
                <div class="hidden md:flex">
                    <p v-if="showError"
                        class="relative text-red-500 text-sm mt-1 flex items-center text-center gap-1 w-max">
                        <i class="pi pi-times-circle flex items-center text-xs"></i>
                        {{ errorMessage }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HeroImg from '../../assets/Hero Image.png'
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const email = ref("")
const loaded = ref(false)
const touched = ref(false)

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
const bgUrl = HeroImg

const ringColor = computed(() => {
    if (email.value === "") return "focus:ring-[#BDBCBB]"
    return isValidEmail(email.value) ? "focus:ring-green-500" : "focus:ring-red-500"
})

// Only show error if input was touched (button pressed) OR invalid on typing
const showError = computed(() => {
    if (!touched.value && email.value === "") return false
    return !isValidEmail(email.value)
})

const errorMessage = computed(() => {
    if (email.value === "") return "Email is required."
    return "Please enter a valid email address."
})

function onImageLoaded() {
    loaded.value = true
}

function handleGetStarted() {
    touched.value = true
    if (isValidEmail(email.value)) {
        router.push({ path: "/login" })
    }
}

onMounted(() => {
    const img = new Image()
    img.src = bgUrl
    img.onload = () => {
        loaded.value = true
    }
})

</script>

<style scoped></style>