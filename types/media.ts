// types/media.ts

export interface Media {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv' | 'person';
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
  original_title?: string;
  original_name?: string;
  adult?: boolean;
  video?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TVShow extends Media {
  media_type: 'tv';
  name: string;
  first_air_date: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface Movie extends Media {
  media_type: 'movie';
  title: string;
  release_date: string;
  runtime?: number;
}
