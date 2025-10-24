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
  type?: "movie" | "tv";
  trailerUrl?: string;
  addedToWatchlist?: boolean;
  rating?: number;
  media_type: "movie" | "tv";
}

export interface Season {
  id: number
  season_number: number
  name: string
  overview: string
  air_date?: string
  poster_path?: string
  episode_count: number
}

export interface Episode {
  id: number
  episode_number: number
  name: string
  overview: string
  still_path?: string
  air_date?: string
  vote_average?: number
}

export interface TVShow extends Media {
  number_of_seasons: number
  number_of_episodes: number
  seasons: Season[]
}