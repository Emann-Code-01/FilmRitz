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

export interface Season {
  id: number
  season_number: number
  name: string
  overview: string
  air_date?: string
  poster_path?: string
  episode_count: number
  vote_average?: number
  vote_count?: number
}

export interface Episode {
  id: number
  episode_number: number
  season_number: number
  name: string
  overview: string
  still_path?: string
  air_date?: string
  vote_average?: number
  vote_count?: number
  runtime?: number
  crew?: string[]
  guest_stars?: string[]
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type: 'movie' | 'tv';
  trailer_url?: string;
  trailer_key?: string;
}
export interface TVShow extends Media {
  number_of_seasons: number
  number_of_episodes: number
  seasons: Season[]
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
