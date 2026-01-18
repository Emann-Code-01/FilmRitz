import { ref } from 'vue';

export interface Genre {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const genres = ref<Genre[]>([
  {
    id: 28,
    name: "Action",
    icon: "💥",
    color: "#FF4500",
    description: "High-octane thrills and explosive adventures",
  },
  {
    id: 35,
    name: "Comedy",
    icon: "😂",
    color: "#FFD700",
    description: "Laugh-out-loud moments and feel-good stories",
  },
  {
    id: 27,
    name: "Horror",
    icon: "👻",
    color: "#DC2626",
    description: "Spine-chilling scares and supernatural terror",
  },
  {
    id: 878,
    name: "Sci-Fi",
    icon: "🚀",
    color: "#3B82F6",
    description: "Futuristic worlds and mind-bending concepts",
  },
  {
    id: 10749,
    name: "Romance",
    icon: "💕",
    color: "#EC4899",
    description: "Heartwarming love stories and connections",
  },
  {
    id: 18,
    name: "Drama",
    icon: "🎭",
    color: "#8B5CF6",
    description: "Powerful performances and emotional depth",
  },
  {
    id: 12,
    name: "Adventure",
    icon: "🗺️",
    color: "#10B981",
    description: "Epic journeys and daring quests",
  },
  {
    id: 16,
    name: "Animation",
    icon: "🎨",
    color: "#F59E0B",
    description: "Animated wonders for all ages",
  },
]);