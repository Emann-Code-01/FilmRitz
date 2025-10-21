import apiV3 from "../api/tmdbV3";
import { normalize } from "../api/tmdb";

export const getMoviesByGenre = async (genreId: number, page = 1) => {
  const res = await apiV3.get("/discover/movie", {
    params: { with_genres: genreId, page },
  });
  return (res.data.results || []).map((r: any) => normalize(r, "movie"));
};

export const getShowsByGenre = async (genreId: number, page = 1) => {
  const res = await apiV3.get("/discover/tv", {
    params: { with_genres: genreId, page },
  });
  return (res.data.results || []).map((r: any) => normalize(r, "tv"));
};
