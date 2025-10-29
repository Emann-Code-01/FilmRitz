// tmdb.ts

// Unified TMDB helpers for Movie + TV + combined use (v3 axios instance: apiV3)
import apiV3 from "./tmdbV3";
import { genreMap } from "../types/genres";
import { Media, TVShow, Season, Episode } from "../types/media"; // ✅ use your defined interfaces

/**
 * Normalize an item to a consistent media shape:
 * - media_type: 'movie' | 'tv'
 * - title: string
 * - release_date: string
 * - genres: { id: number; name: string }[]
 */
export function normalize(item: any, mediaType?: "movie" | "tv"): Media {
  const mt = mediaType ?? item.media_type ?? (item.title ? "movie" : "tv");

  const genres =
    item.genres && item.genres.length
      ? item.genres
      : item.genre_ids?.map((id: number) => ({
        id,
        name: genreMap[id] || "Unknown",
      })) || [];

  return {
    ...item,
    media_type: mt,
    title:
      mt === "movie"
        ? item.title ?? item.name ?? ""
        : item.name ?? item.title ?? "",
    release_date:
      mt === "movie"
        ? item.release_date ?? item.first_air_date ?? ""
        : item.first_air_date ?? item.release_date ?? "",
    genres,
  };
}

// --------------------------- MOVIES ---------------------------

export const fetchTrendingMovies = async (
  timeWindow: "day" | "week" = "week"
): Promise<Media[]> => {
  const res = await apiV3.get(`/trending/movie/${timeWindow}`);
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const fetchPopularMovies = async (page = 1): Promise<Media[]> => {
  const res = await apiV3.get("/movie/popular", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const fetchTopRatedMovies = async (page = 1): Promise<Media[]> => {
  const res = await apiV3.get("/movie/top_rated", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const fetchUpcomingMovies = async (page = 1): Promise<Media[]> => {
  const res = await apiV3.get("/movie/upcoming", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const getMovieDetails = async (id: number): Promise<Media> => {
  const res = await apiV3.get(`/movie/${id}`);
  return normalize(res.data, "movie");
};

export const getMovieVideos = async (id: number) => {
  const res = await apiV3.get(`/movie/${id}/videos`);
  return res.data.results || [];
};

// --------------------------- TV (SERIES) ---------------------------

export const fetchTrendingTV = async (
  timeWindow: "day" | "week" = "week"
): Promise<TVShow[]> => {
  const res = await apiV3.get(`/trending/tv/${timeWindow}`);
  return (res.data.results || []).map((r: any) => normalize(r, "tv")) as TVShow[];
};

export const fetchPopularTV = async (page = 1): Promise<TVShow[]> => {
  const res = await apiV3.get("/tv/popular", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "tv")) as TVShow[];
};

export const fetchTopRatedTV = async (page = 1): Promise<TVShow[]> => {
  const res = await apiV3.get("/tv/top_rated", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "tv")) as TVShow[];
};

// TMDB doesn’t have /tv/upcoming; use /tv/on_the_air or /tv/airing_today instead.
export const fetchOnTheAir = async (page = 1): Promise<TVShow[]> => {
  try {
    const res = await apiV3.get("/tv/on_the_air", { params: { page } });
    return (res.data.results || []).map((r: any) => normalize(r, "tv")) as TVShow[];
  } catch {
    const res = await apiV3.get("/tv/airing_today", { params: { page } });
    return (res.data.results || []).map((r: any) => normalize(r, "tv")) as TVShow[];
  }
};

export const getTVDetails = async (id: number): Promise<TVShow> => {
  const res = await apiV3.get(`/tv/${id}`);
  return normalize(res.data, "tv") as TVShow;
};

export const getTVVideos = async (id: number) => {
  const res = await apiV3.get(`/tv/${id}/videos`);
  return res.data.results || [];
};

// --------------------------- TV SEASONS & EPISODES ---------------------------

/**
 * Get specific season details for a TV show.
 * Returns the full season payload from TMDB which includes episodes[].
 */
export const getTVSeasonDetails = async (
  tvId: number,
  seasonNumber: number
): Promise<Season & { episodes: Episode[] }> => {
  const res = await apiV3.get(`/tv/${tvId}/season/${seasonNumber}`);
  return res.data;
};

/**
 * Get specific episode details for a TV show.
 */
export const getTVEpisodeDetails = async (
  tvId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<Episode> => {
  const res = await apiV3.get(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`
  );
  return res.data;
};

/**
 * Get videos for a specific episode (clips, trailers if any).
 */
export const getTVEpisodeVideos = async (
  tvId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<any[]> => {
  const res = await apiV3.get(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`
  );
  return res.data.results || [];
};

// --------------------------- GENERIC MEDIA HELPERS ---------------------------

export const fetchTrendingMedia = async (
  timeWindow: "day" | "week" = "week"
): Promise<Media[]> => {
  const results = await Promise.allSettled([
    fetchTrendingMovies(timeWindow),
    fetchTrendingTV(timeWindow),
  ]);

  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled"
  );

  const values = fulfilled.map((r) => r.value).flat();
  return values.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
};

export const getMediaDetails = async (
  id: number,
  mediaType: "movie" | "tv"
): Promise<Media | TVShow | null> => {
  if (mediaType) {
    return mediaType === "movie" ? getMovieDetails(id) : getTVDetails(id);
  }

  const results = await Promise.allSettled([getMovieDetails(id), getTVDetails(id)]);
  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled"
  );
  return fulfilled.length ? fulfilled[0].value : null;
};

export const getMediaVideos = async (id: number, mediaType: "movie" | "tv") => {
  return mediaType === "movie" ? getMovieVideos(id) : getTVVideos(id);
};

export const getMediaSeasonDetails = async (
  id: number,
  mediaType: "movie" | "tv",
  seasonNumber: number
): Promise<(Season & { episodes: Episode[] }) | null> => {
  if (mediaType !== "tv") return null;
  return getTVSeasonDetails(id, seasonNumber);
};

export const getMediaEpisodeDetails = async (
  id: number,
  mediaType: "movie" | "tv",
  seasonNumber: number,
  episodeNumber: number
): Promise<Episode | null> => {
  if (mediaType !== "tv") return null;
  return getTVEpisodeDetails(id, seasonNumber, episodeNumber);
};

export const getMediaEpisodeVideos = async (
  id: number,
  mediaType: "movie" | "tv",
  seasonNumber: number,
  episodeNumber: number
): Promise<any[]> => {
  if (mediaType !== "tv") return [];
  return getTVEpisodeVideos(id, seasonNumber, episodeNumber);
};

// --------------------------- SEARCH (MULTI) ---------------------------

export const searchMulti = async (query: string, page = 1): Promise<Media[]> => {
  const res = await apiV3.get("/search/multi", {
    params: { query, page, include_adult: false },
  });

  const raw = res.data.results || [];
  return raw
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: any) => normalize(r));
};

// --------------------------- FILTERED SEARCH HELPER ---------------------------

export const searchMoviesAndShows = async (
  query: string,
  filters: {
    mediaType?: string;
    yearFrom?: string;
    yearTo?: string;
    rating?: number;
  } = {}
): Promise<Media[]> => {
  if (!query.trim()) return [];

  const results = await searchMulti(query);

  return results.filter((item: any) => {
    const year =
      parseInt(item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)) || 0;
    const rating = item.vote_average || 0;

    const matchesMediaType =
      !filters.mediaType || filters.mediaType === "all"
        ? true
        : item.media_type === filters.mediaType;

    const matchesYearFrom = filters.yearFrom ? year >= Number(filters.yearFrom) : true;
    const matchesYearTo = filters.yearTo ? year <= Number(filters.yearTo) : true;
    const matchesRating = filters.rating ? rating >= Number(filters.rating) : true;

    return matchesMediaType && matchesYearFrom && matchesYearTo && matchesRating;
  });
};

export function getPoster(path: string | null, size: string = "w500") {
  if (!path) return "/no-poster.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
