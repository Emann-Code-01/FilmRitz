// src/types/Movie.ts
export interface Movie {
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
