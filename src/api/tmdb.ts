// src/api/tmdb.ts
import apiV3 from "./tmdbV3"

// ✅ Trending Movies
export const fetchTrendingMovies = async (timeWindow: "day" | "week" = "week") => {
  const res = await apiV3.get(`/trending/movie/${timeWindow}`)
  return res.data.results
}

// ✅ Popular Movies
export const fetchPopularMovies = async (page = 1) => {
  const res = await apiV3.get("/movie/popular", { params: { page } })
  return res.data.results
}

// ✅ Top Rated Movies
export const fetchTopRatedMovies = async (page = 1) => {
  const res = await apiV3.get("/movie/top_rated", { params: { page } })
  return res.data.results
}

// ✅ Upcoming Movies
export const fetchUpcomingMovies = async (page = 1) => {
  const res = await apiV3.get("/movie/upcoming", { params: { page } })
  return res.data.results
}

// ✅ Movie Details
export const getMovieDetails = async (id: number) => {
  const res = await apiV3.get(`/movie/${id}`)
  return res.data
}

// ✅ Movie Videos (trailers, teasers)
export const getMovieVideos = async (id: number) => {
  const res = await apiV3.get(`/movie/${id}/videos`)
  return res.data.results
}

// ✅ Search Movies
export const searchMovies = async (query: string, page = 1) => {
  const res = await apiV3.get("/search/movie", { params: { query, page, include_adult: false } })
  return res.data.results
}
