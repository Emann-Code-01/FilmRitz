import axios from "axios";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string; // e.g. https://api.themoviedb.org/4
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string; // Bearer token from TMDB v4

// 🔹 Create Axios instance for TMDB v4
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 🔥 Fetch Trending Movies
export const fetchTrendingMovies = async (
  timeWindow: "day" | "week" = "day"
) => {
  const res = await api.get(`/trending/movie/${timeWindow}`);
  return res.data.results;
};

// 🔥 Fetch Popular Movies
export const fetchPopularMovies = async (page = 1) => {
  const res = await api.get(`/movie/popular`, {
    params: { page, language: "en-US" },
  });
  return res.data.results;
};

// 🔥 Get Movie Details
export const getMovieDetails = async (id: number) => {
  const res = await api.get(`/movie/${id}`);
  return res.data;
};

// 🔥 Get Movie Videos (trailers, teasers, etc.)
export const getMovieVideos = async (movieId: number) => {
  const res = await api.get(`/movie/${movieId}/videos`);
  return res.data.results;
};

// 🔥 Search Movies
export const searchMovies = async (query: string, page = 1) => {
  const res = await api.get(`/search/movie`, {
    params: { query, page, language: "en-US", include_adult: false },
  });
  return res.data.results;
};
