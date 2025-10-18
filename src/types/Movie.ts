export interface Movie {
  id: number;
  title: string; // For movies
  name?: string; // For TV shows
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string; // Movie release date
  first_air_date?: string; // TV show release date
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  original_language?: string;
  type?: "movie" | "tv";
  trailerUrl?: string;
  addedToWatchlist?: boolean;
  rating?: number;
}
