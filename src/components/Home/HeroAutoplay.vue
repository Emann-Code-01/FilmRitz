<template>
    <div class="relative w-full h-screen overflow-hidden">
        <!-- Ambient Lighting Background -->
        <div v-if="canHandleAdvancedEffects" class="absolute inset-0 transition-all duration-1000 blur-3xl opacity-60"
            :style="{ background: ambientColor }" />

        <!-- Video Player -->
        <video ref="videoRef" :src="currentSlide.videoUrl" :muted="isMuted" class="w-full h-full object-cover" autoplay
            @ended="handleVideoEnded" @timeupdate="handleTimeUpdate" />

        <!-- Letterbox Overlay -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="h-20 bg-linear-to-b from-black/80 to-transparent" />
            <div class="absolute bottom-0 w-full h-40 bg-linear-to-t from-black/80 to-transparent" />
        </div>

        <!-- Info Panel -->
        <div class="absolute bottom-20 left-12 max-w-2xl z-10">
            <h1 class="text-6xl font-[Gilroy-Bold] text-white mb-4 drop-shadow-2xl">
                {{ currentSlide.title || currentSlide.name }}
            </h1>

            <div class="flex gap-3 mb-4">
                <span v-for="genreId in currentSlide.genre_ids?.slice(0, 3) || []" :key="genreId"
                    class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                    {{ genreId }}
                </span>
            </div>

            <p class="text-lg text-gray-200 mb-6 line-clamp-3">
                {{ currentSlide.overview }}
            </p>

            <div class="flex gap-4">
                <button @click="handlePlayTrailer" class="px-6 py-3 bg-white text-black rounded-lg font-[Gilroy-SemiBold] 
                 hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <span>▶</span> Watch Trailer
                </button>

                <button class="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg 
                 font-[Gilroy-SemiBold] hover:bg-white/30 transition-all">
                    ℹ More Info
                </button>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div class="h-full bg-[#b20710] transition-all duration-200" :style="{ width: `${progress}%` }" />
        </div>

        <!-- Navigation Dots -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button v-for="(slide, index) in slides" :key="slide.id" @click="currentSlideIndex = index"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="index === currentSlideIndex ? 'bg-white w-8' : 'bg-white/40'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useColorExtraction } from '../../composables/useColorExtraction';
import { useAmbientLighting } from '../../composables/useAmbientLighting';
import { useTrailerAutoplay } from '../../composables/useTrailerAutoplay';
import { usePerformanceOptimization } from '../../composables/usePerformanceOptimization';
import type { HeroSlide } from '../../types/media';

interface Props {
    slides: HeroSlide[];
}

const props = defineProps<Props>();

const currentSlideIndex = ref<number>(0);
const videoRef = ref<HTMLVideoElement | null>(null);
const isTransitioning = ref<boolean>(false);

const { extractColors } = useColorExtraction();
const { ambientColor, updateAmbientLight, activate } = useAmbientLighting(videoRef);
const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    toggleMute,
    updateProgress
} = useTrailerAutoplay();
const { canHandleAdvancedEffects } = usePerformanceOptimization();

const currentSlide = computed<HeroSlide>(() => props.slides[currentSlideIndex.value]);

const progress = computed<number>(() => {
    if (!duration.value) return 0;
    return (currentTime.value / duration.value) * 100;
});

const goToNextSlide = () => {
    if (isTransitioning.value) return;

    isTransitioning.value = true;
    currentSlideIndex.value = (currentSlideIndex.value + 1) % props.slides.length;

    setTimeout(() => {
        isTransitioning.value = false;
    }, 800);
};

const handleVideoEnded = () => {
    goToNextSlide();
};

const handleTimeUpdate = () => {
    if (videoRef.value) {
        updateProgress(videoRef.value);
    }
};

const updateColors = async () => {
    if (!canHandleAdvancedEffects.value) return;

    try {
        const imageUrl = `https://image.tmdb.org/t/p/original${currentSlide.value.backdrop_path}`;
        const palette = await extractColors(imageUrl);
        updateAmbientLight(palette);
    } catch (error) {
        console.error('Failed to extract colors:', error);
    }
};

const handlePlayTrailer = () => {
    if (videoRef.value) {
        toggleMute(videoRef.value);
        videoRef.value.play();
    }
};

watch(currentSlide, () => {
    updateColors();
});

onMounted(() => {
    if (canHandleAdvancedEffects.value) {
        activate();
        updateColors();
    }
});
</script>