<template>
    <section class="relative">

        <!-- Loading State -->
        <div v-if="loading" class="flex gap-4 overflow-x-auto px-4 py-6">
            <div v-for="n in 8" :key="n" class="min-w-[200px] h-80 bg-gray-800/50 rounded-xl animate-pulse"></div>
        </div>

        <!-- Timeline Container -->
        <div v-else class="relative">

            <!-- Timeline Bar -->
            <div class="absolute top-8 left-0 right-0 h-1 bg-white/10 z-0">
                <div class="absolute inset-0 bg-linear-to-r from-[#b20710] via-[#e32125] to-[#b20710] opacity-50">
                </div>
            </div>

            <!-- Swiper Carousel -->
            <Swiper :modules="[Navigation, FreeMode]" :slidesPerView="'auto'" :spaceBetween="16"
                :freeMode="{ enabled: true }" :navigation="{
                    nextEl: '.timeline-next',
                    prevEl: '.timeline-prev',
                }" class="timeline-swiper px-4 md:px-8 py-6">
                <SwiperSlide v-for="(item, index) in timelineItems" :key="item.id" class="w-[200px]!">
                    <div class="relative group cursor-pointer" @mouseenter="handleHover(item)" @click="openModal(item)">

                        <!-- Date Marker (on timeline) -->
                        <div class="relative z-10 mb-4">
                            <div
                                class="w-4 h-4 rounded-full bg-[#b20710] mx-auto border-4 border-black shadow-lg group-hover:scale-150 transition-transform duration-300">
                            </div>
                            <div class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <p
                                    class="text-xs font-[Gilroy-SemiBold] text-gray-400 group-hover:text-white transition-colors">
                                    {{ formatDate(item.release_date || item.first_air_date) }}
                                </p>
                            </div>
                        </div>

                        <!-- Card -->
                        <div
                            class="relative overflow-hidden rounded-xl shadow-xl mt-8 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-[#b20710]/30">

                            <!-- Poster -->
                            <img :src="getImageUrl(item.poster_path)" :alt="item.title || item.name"
                                class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" />

                            <!-- Mini Trailer Preview (circular, on hover) -->
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div
                                    class="w-16 h-16 rounded-full bg-[#b20710] flex items-center justify-center animate-pulse">
                                    <i class="pi pi-info-circle text-5xl text-white hover:text-[#ffffffec]"></i>
                                </div>
                            </div>

                            <!-- Info Overlay -->
                            <div
                                class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/90 to-transparent p-4">
                                <h4 class="text-white font-[Gilroy-Bold] text-sm line-clamp-2 mb-2">
                                    {{ item.title || item.name }}
                                </h4>
                                <div class="flex items-center gap-2 text-xs">
                                    <span class="text-yellow-400">⭐ {{ item.vote_average?.toFixed(1) }}</span>
                                    <span class="px-2 py-0.5 bg-[#b20710] rounded text-white font-[Gilroy-SemiBold]">
                                        {{ item.media_type?.toUpperCase() }}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <!-- Navigation Buttons -->
            <button
                class="timeline-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all">
                <i class="pi pi-chevron-left"></i>
            </button>
            <button
                class="timeline-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#b20710] transition-all">
                <i class="pi pi-chevron-right"></i>
            </button>

        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, FreeMode } from 'swiper/modules';
import { useModalStore } from '../../stores/modalStore';

interface Props {
    period: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update-ambient': [color: string]
}>();

const modalStore = useModalStore();
const timelineItems = ref<any[]>([]);
const loading = ref(true);

const getImageUrl = (path: string | null): string => {
    return path
        ? `https://image.tmdb.org/t/p/w342${path}`
        : 'https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE';
};

const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'TBA';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const handleHover = (item: any) => {
    emit('update-ambient', '#FF4500');
};

const openModal = (item: any) => {
    modalStore.open(item.media_type, { movieId: item.id, mediaType: item.media_type });
};

const loadItems = async () => {
    loading.value = true;
    try {
        // Calculate date range based on period
        const now = new Date();
        let startDate = new Date();

        if (props.period === 'This Week') {
            startDate.setDate(now.getDate() - 7);
        } else if (props.period === 'Last Week') {
            startDate.setDate(now.getDate() - 14);
        } else if (props.period === 'This Month') {
            startDate.setMonth(now.getMonth() - 1);
        }

        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&primary_release_date.gte=${startDate.toISOString().split('T')[0]}&primary_release_date.lte=${now.toISOString().split('T')[0]}&sort_by=primary_release_date.desc`
        );
        const data = await response.json();
        timelineItems.value = data.results.slice(0, 15).map((item: any) => ({
            ...item,
            media_type: 'movie'
        }));
    } catch (error) {
        console.error('Failed to load timeline items:', error);
    } finally {
        loading.value = false;
    }
};

watch(() => props.period, () => {
    loadItems();
});

onMounted(() => {
    loadItems();
});
</script>

<style scoped>
.timeline-swiper {
    overflow: visible;
}
</style>