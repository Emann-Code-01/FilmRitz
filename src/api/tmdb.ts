// Unified TMDB helpers for Movie + TV + combined use (v3 axios instance: apiV3)
import apiV3 from "./tmdbV3";
import { genreMap } from "../types/genres";

/**
 * Normalize an item to a consistent media shape:
 * - media_type: 'movie' | 'tv'
 * - title: string
 * - release_date: string
 * - genres: { id: number; name: string }[]
 */
export function normalize(item: any, mediaType?: "movie" | "tv") {
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

export const fetchTrendingMovies = async (timeWindow: "day" | "week" = "week") => {
  const res = await apiV3.get(`/trending/movie/${timeWindow}`);
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const fetchPopularMovies = async (page = 1) => {
  const res = await apiV3.get("/movie/popular", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const fetchTopRatedMovies = async (page = 1) => {
  const res = await apiV3.get("/movie/top_rated", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const fetchUpcomingMovies = async (page = 1) => {
  const res = await apiV3.get("/movie/upcoming", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const getMovieDetails = async (id: number) => {
  const res = await apiV3.get(`/movie/${id}`);
  return normalize(res.data, "movie");
};

export const getMovieVideos = async (id: number) => {
  const res = await apiV3.get(`/movie/${id}/videos`);
  return res.data.results || [];
};

// --------------------------- TV (SERIES) ---------------------------

export const fetchTrendingTV = async (timeWindow: "day" | "week" = "week") => {
  const res = await apiV3.get(`/trending/tv/${timeWindow}`);
  return (res.data.results || []).map((r: any) => normalize(r, "tv"));
};

export const fetchPopularTV = async (page = 1) => {
  const res = await apiV3.get("/tv/popular", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "tv"));
};

export const fetchTopRatedTV = async (page = 1) => {
  const res = await apiV3.get("/tv/top_rated", { params: { page } });
  return (res.data.results || []).map((r: any) => normalize(r, "tv"));
};

// TMDB doesn’t have /tv/upcoming; use /tv/on_the_air or /tv/airing_today instead.
export const fetchUpcomingTV = async (page = 1) => {
  try {
    const res = await apiV3.get("/tv/on_the_air", { params: { page } });
    return (res.data.results || []).map((r: any) => normalize(r, "tv"));
  } catch {
    const res = await apiV3.get("/tv/airing_today", { params: { page } });
    return (res.data.results || []).map((r: any) => normalize(r, "tv"));
  }
};

export const getTVDetails = async (id: number) => {
  const res = await apiV3.get(`/tv/${id}`);
  return normalize(res.data, "tv");
};

export const getTVVideos = async (id: number) => {
  const res = await apiV3.get(`/tv/${id}/videos`);
  return res.data.results || [];
};

// --------------------------- GENERIC MEDIA HELPERS ---------------------------

/**
 * Fetch both movies + tv trending and merge them into one array (normalized).
 * Sort by popularity desc so the list interleaves correctly.
 */
export const fetchTrendingMedia = async (timeWindow: "day" | "week" = "week") => {
  const results = await Promise.allSettled([
    fetchTrendingMovies(timeWindow),
    fetchTrendingTV(timeWindow),
  ]);

  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled"
  );

  const values = fulfilled.map(r => r.value).flat();

  return values.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
};

/**
 * Generic details getter for either movie or tv
 */
export const getMediaDetails = async (id: number, mediaType: "movie" | "tv") => {
  if (mediaType) {
    return mediaType === "movie" ? getMovieDetails(id) : getTVDetails(id);
  }

  const results = await Promise.allSettled([
    getMovieDetails(id),
    getTVDetails(id),
  ]);

  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled"
  );

  return fulfilled.length ? fulfilled[0].value : null;
};

export const getMediaVideos = async (id: number, mediaType: "movie" | "tv") => {
  return mediaType === "movie" ? getMovieVideos(id) : getTVVideos(id);
};

// --------------------------- SEARCH (MULTI) ---------------------------

export const searchMulti = async (query: string, page = 1) => {
  const res = await apiV3.get("/search/multi", {
    params: { query, page, include_adult: false },
  });

  const raw = res.data.results || [];

  return raw
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: any) => normalize(r));
};
