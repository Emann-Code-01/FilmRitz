<template>
    <section class="relative py-12 overflow-hidden">

        <!-- Ambient Glow Background -->
        <div class="absolute inset-0 transition-all duration-1000 blur-3xl opacity-40"
            :style="{ backgroundColor: selectedMood?.color }"></div>

        <div class="relative z-10 max-w-6xl mx-auto px-4">

            <!-- Wheel Container -->
            <div class="grid lg:grid-cols-2 gap-12 items-center">

                <!-- LEFT: Mood Wheel -->
                <div class="relative">

                    <!-- Center Hub -->
                    <div class="relative w-80 h-80 mx-auto">

                        <!-- Spinning Outer Ring (decorative) -->
                        <div class="absolute inset-0 rounded-full border-4 border-white/10 animate-spin-slow"></div>

                        <!-- Mood Segments -->
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <g v-for="(mood, index) in moods" :key="mood.id" @click="selectMood(mood)"
                                @mouseenter="handleHoverMood(mood)" class="cursor-pointer transition-all duration-300"
                                :class="selectedMood?.id === mood.id && 'scale-110'">
                                <!-- Segment Path -->
                                <path :d="getSegmentPath(index, moods.length)" :fill="mood.color"
                                    :opacity="selectedMood?.id === mood.id ? '1' : '0.7'"
                                    class="hover:opacity-100 transition-opacity"
                                    :style="{ filter: selectedMood?.id === mood.id ? `drop-shadow(0 0 10px ${mood.color})` : 'none' }" />
                            </g>
                        </svg>

                        <!-- Center Button -->
                        <div
                            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-black border-4 border-white/20 flex flex-col items-center justify-center shadow-2xl">
                            <span class="text-5xl mb-2">{{ selectedMood?.icon || '🎬' }}</span>
                            <span class="text-white font-[Gilroy-Bold] text-sm">Mood</span>
                        </div>

                        <!-- Mood Labels (around wheel) -->
                        <div v-for="(mood, index) in moods" :key="`label-${mood.id}`"
                            class="absolute font-[Gilroy-SemiBold] text-sm transition-all duration-300 cursor-pointer"
                            :style="getLabelPosition(index, moods.length)" @click="selectMood(mood)"
                            :class="selectedMood?.id === mood.id ? 'text-white scale-110' : 'text-gray-400'">
                            {{ mood.name }}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useModalStore } from '@/stores/modalStore';

const emit = defineEmits<{
    'update-ambient': [color: string]
}>();

const modalStore = useModalStore();

interface Mood {
    id: number;
    name: string;
    icon: string;
    color: string;
    description: string;
    genreIds: number[];
}

const moods = ref<Mood[]>([
    { id: 1, name: 'Happy', icon: '😊', color: '#FBBF24', description: 'Feel-good movies to brighten your day', genreIds: [35, 10751] },
    { id: 2, name: 'Scary', icon: '😱', color: '#DC2626', description: 'Spine-chilling horror and thrillers', genreIds: [27, 53] },
    { id: 3, name: 'Excited', icon: '🤩', color: '#F59E0B', description: 'Action-packed adventures', genreIds: [28, 12] },
    { id: 4, name: 'Romantic', icon: '💕', color: '#EC4899', description: 'Love stories that warm the heart', genreIds: [10749] },
    { id: 5, name: 'Thoughtful', icon: '🤔', color: '#8B5CF6', description: 'Mind-bending dramas and mysteries', genreIds: [18, 9648] },
    { id: 6, name: 'Adventurous', icon: '🗺️', color: '#10B981', description: 'Epic journeys and explorations', genreIds: [12, 14] },
    { id: 7, name: 'Curious', icon: '🔬', color: '#3B82F6', description: 'Sci-fi wonders and documentaries', genreIds: [878, 99] },
    { id: 8, name: 'Nostalgic', icon: '📼', color: '#6B7280', description: 'Classic films from the past', genreIds: [36, 10752] },
]);

const selectedMood = ref<Mood | null>(null);
const moodItems = ref<any[]>([]);
const loading = ref(false);

const getImageUrl = (path: string | null): string => {
    return path
        ? `https://image.tmdb.org/t/p/w342${path}`
        : 'https://placehold.co/342x513/0f0f0f/FF0000?text=NO+IMAGE';
};

// Calculate SVG path for each segment
const getSegmentPath = (index: number, total: number): string => {
    const angle = (360 / total);
    const startAngle = index * angle;
    const endAngle = startAngle + angle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const innerRadius = 30;
    const outerRadius = 48;

    const x1 = 50 + outerRadius * Math.cos(startRad);
    const y1 = 50 + outerRadius * Math.sin(startRad);
    const x2 = 50 + outerRadius * Math.cos(endRad);
    const y2 = 50 + outerRadius * Math.sin(endRad);
    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
};

// Calculate label position around wheel
const getLabelPosition = (index: number, total: number) => {
    const angle = (360 / total) * index - 90;
    const radius = 180;
    const rad = angle * Math.PI / 180;
    const x = 160 + radius * Math.cos(rad);
    const y = 160 + radius * Math.sin(rad);

    return {
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
    };
};

const selectMood = async (mood: Mood) => {
    selectedMood.value = mood;
    emit('update-ambient', mood.color);
    await loadMoodItems(mood);
};

const handleHoverMood = (mood: Mood) => {
    emit('update-ambient', mood.color);
};

const loadMoodItems = async (mood: Mood) => {
    loading.value = true;
    try {
        const genreQuery = mood.genreIds.join(',');
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreQuery}&sort_by=popularity.desc`
        );
        const data = await response.json();
        moodItems.value = data.results.slice(0, 12);
    } catch (error) {
        console.error('Failed to load mood items:', error);
    } finally {
        loading.value = false;
    }
};

const openModal = (item: any) => {
    modalStore.open('movie', { movieId: item.id, mediaType: 'movie' });
};

onMounted(() => {
    // Auto-select first mood
    selectMood(moods.value[0]);
});
</script>
<style scoped>
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 20s linear infinite;
}
</style>