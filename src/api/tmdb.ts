import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;

// axios instance with defaults
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
});

// 🔥 Fetch Popular Movies
export const fetchPopularMovies = async (page = 1) => {
  const res = await api.get<{ results: any[] }>("/movie/popular", {
    params: { page },
  });
  return res.data.results;
};

// 🔥 Fetch Trending Movies (day/week)
export const fetchTrendingMovies = async (
  timeWindow: "day" | "week" = "day"
) => {
  const res = await api.get<{ results: any[] }>(
    `/trending/movie/${timeWindow}`
  );
  return res.data.results;
};

// 🔥 Get Movie Details
export const getMovieDetails = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.data;
};

// 🔥 Get Movie Videos (trailers, teasers, clips, etc.)
export const getMovieVideos = async (movieId: number) => {
  const res = await api.get<{ results: any[] }>(`/movie/${movieId}/videos`);
  return res.data.results;
};
