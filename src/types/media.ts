// src/types/Media.ts
export interface Media {
  id: number;
  title: string; // For movies and normalized title for tv
  name?: string; // Original tv name (optional)
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string; // release_date or first_air_date normalized into this
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  original_language?: string;
  type?: "movie" | "tv series";
  trailerUrl?: string;
  addedToWatchlist?: boolean;
  rating?: number;
  media_type: "movie" | "tv";
  status?: "ongoing" | "finished";
}

export interface Credit {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  character?: string;
  job?: string;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  air_date?: string;
  poster_path?: string;
  episode_count: number;
  vote_average?: number;
  vote_count?: number;
}

export interface Episode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path?: string;
  air_date?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
  crew?: string[];
  guest_stars?: string[];
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type: "movie" | "tv";
  trailer_url?: string;
  trailer_key?: string;
}
export interface TVShow extends Media {
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
}

export interface Genre {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const genreNameToId: Record<string, number> = Object.fromEntries(
  Object.entries(genreMap).map(([id, name]) => [name.toLowerCase(), Number(id)])
);
export interface WatchItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_path?: string;
  first_air_date?: string;
  vote_count?: number;
  popularity?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  original_language?: string;
  type?: "movie" | "tv";
  trailerUrl?: string;
  addedToWatchlist?: boolean;
  rating?: number;
  media_type: "movie" | "tv";
}

export interface ColorPalette {
  dominant: string;
  accent: string;
  vibrant: string;
  muted: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  birthday: string | null;
  place_of_birth: string | null;
  biography: string;
}

export interface HeroSlide extends Media {
  tagline?: string;
  videoUrl: string;
  duration: number;
}

export interface CarouselConfig {
  slidesPerView: number;
  spaceBetween: number;
  slidesPerGroup: number;
  autoplay?: {
    delay: number;
    disableOnInteraction: boolean;
  };
}

export interface SwiperBreakpoints {
  [width: number]: CarouselConfig;
}

// ═══════════════════════════════════════════════════════════════
// ADD THIS TO THE END OF src/types/media.ts
// ═══════════════════════════════════════════════════════════════

export interface CollectionDefinition {
  id: number;
  name: string; // URL-friendly name like "epic-sci-fi"
  title: string; // Display title like "Epic Sci-Fi"
  icon: string;
  color: string;
  description: string;
  longDescription: string;
  genreIds: number[]; // Support multiple genres
  tags?: string[];
}

export interface Collection extends CollectionDefinition {
  items: Media[];
  totalItems?: number;
  currentPage?: number;
}

export const COLLECTIONS: CollectionDefinition[] = [
  {
    id: 1,
    name: "epic-sci-fi",
    title: "Epic Sci-Fi",
    icon: "🚀",
  color: "#3B82F6",
    description: "Mind-bending journeys through space and time",
    longDescription:
      "Explore the infinite possibilities of science fiction with these mind-bending films that push the boundaries of imagination and reality.",
    genreIds: [878], // Science Fiction
    tags: ["Space", "Future", "Technology", "Aliens"],
  },
  {
    id: 2,
    name: "tear-jerkers",
    title: "Tear-Jerkers",
    icon: "😢",
    color: "#EC4899",
    description: "Emotional stories that will move you",
    longDescription:
      "Prepare to feel deeply with these powerful dramas that explore the human condition and pull at your heartstrings.",
    genreIds: [18], // Drama
    tags: ["Emotional", "Family", "Love", "Loss"],
  },
  {
    id: 3,
    name: "mind-benders",
    title: "Mind-Benders",
    icon: "🧠",
    color: "#8B5CF6",
    description: "Psychological thrillers that keep you guessing",
    longDescription:
      "Enter the labyrinth of the human mind with these psychological masterpieces that will leave you questioning everything.",
    genreIds: [9648, 53], // Mystery, Thriller
    tags: ["Twists", "Psychology", "Suspense", "Mystery"],
  },
  {
    id: 4,
    name: "laugh-riots",
    title: "Laugh Riots",
    icon: "😂",
    color: "#F59E0B",
    description: "Comedy gold for your viewing pleasure",
    longDescription:
      "Get ready to laugh out loud with these comedy gems that will brighten your day and lift your spirits.",
    genreIds: [35], // Comedy
    tags: ["Funny", "Lighthearted", "Feel-Good", "Humor"],
  },
  {
    id: 5,
    name: "action-packed",
    title: "Action Packed",
    icon: "💥",
    color: "#EF4444",
    description: "Non-stop thrills and explosive action",
    longDescription:
      "Buckle up for adrenaline-pumping adventures filled with spectacular stunts, intense battles, and heart-racing sequences.",
    genreIds: [28], // Action
    tags: ["Explosions", "Heroes", "Adventure", "Stunts"],
  },
  {
    id: 6,
    name: "love-stories",
    title: "Love Stories",
    icon: "💕",
    color: "#F472B6",
    description: "Romantic tales that warm the heart",
    longDescription:
      "Fall in love with these enchanting romantic stories that celebrate the beauty and complexity of human connection.",
    genreIds: [10749], // Romance
    tags: ["Romance", "Love", "Relationships", "Heartwarming"],
  },
  {
    id: 7,
    name: "horror-nights",
    title: "Horror Nights",
    icon: "👻",
    color: "#9333EA",
    description: "Spine-chilling tales that haunt your dreams",
    longDescription:
      "Dare to venture into the darkness with these terrifying films that will keep you up at night and test your courage.",
    genreIds: [27], // Horror
    tags: ["Scary", "Supernatural", "Gore", "Suspense"],
  },
  {
    id: 8,
    name: "animated-wonders",
    title: "Animated Wonders",
    icon: "✨",
    color: "#10B981",
    description: "Magical animated adventures for all ages",
    longDescription:
      "Discover the magic of animation with these visually stunning and heartwarming tales that appeal to the child in all of us.",
    genreIds: [16], // Animation
    tags: ["Family", "Adventure", "Magic", "Colorful"],
  },
  {
    id: 9,
    name: "crime-chronicles",
    title: "Crime Chronicles",
    icon: "🔫",
    color: "#DC2626",
    description: "Gripping tales of crime and justice",
    longDescription:
      "Dive into the criminal underworld with these intense crime dramas featuring heists, investigations, and moral dilemmas.",
    genreIds: [80, 53], // Crime, Thriller
    tags: ["Heist", "Investigation", "Detective", "Underworld"],
  },
  {
    id: 10,
    name: "fantasy-realms",
    title: "Fantasy Realms",
    icon: "🐉",
    color: "#A855F7",
    description: "Epic adventures in magical worlds",
    longDescription:
      "Journey to fantastical realms filled with magic, mythical creatures, and epic quests that transcend imagination.",
    genreIds: [14], // Fantasy
    tags: ["Magic", "Dragons", "Quest", "Epic"],
  },
  {
    id: 11,
    name: "documentary-deep-dives",
    title: "Documentary Deep Dives",
    icon: "📽️",
    color: "#059669",
    description: "Real stories that educate and inspire",
    longDescription:
      "Explore real-world topics through compelling documentaries that educate, inspire, and reveal truths about our world.",
    genreIds: [99], // Documentary
    tags: ["Real", "Educational", "Inspiring", "Truth"],
  },
  {
    id: 12,
    name: "historical-epics",
    title: "Historical Epics",
    icon: "⚔️",
    color: "#B45309",
    description: "Grand tales from history's greatest moments",
    longDescription:
      "Witness history come alive with these epic films that recreate pivotal moments and legendary figures from the past.",
    genreIds: [36, 10752], // History, War
    tags: ["History", "Epic", "War", "Biography"],
  },
];

// Helper functions
export const getCollectionByName = (
  name: string
): CollectionDefinition | undefined => {
  return COLLECTIONS.find((c) => c.name.toLowerCase() === name.toLowerCase());
};

export const getCollectionById = (
  id: number
): CollectionDefinition | undefined => {
  return COLLECTIONS.find((c) => c.id === id);
};
