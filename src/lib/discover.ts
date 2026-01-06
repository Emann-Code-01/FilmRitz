import apiV3 from "../api/tmdbV3";
import { normalize } from "../api/tmdb";

/**
 * Fetch movies by genre with multiple pages to get more results
 */
export const getMoviesByGenre = async (genreId: number, maxPages = 4) => {
  try {
    const pagePromises = Array.from({ length: maxPages }, (_, i) =>
      apiV3.get("/discover/movie", {
        params: { 
          with_genres: genreId, 
          page: i + 1,
          sort_by: "popularity.desc"
        },
      })
    );

    const responses = await Promise.all(pagePromises);
    const allResults = responses.flatMap(res => res.data.results || []);
    
    return allResults.map((r: any) => normalize(r, "movie"));
  } catch (error) {
    console.error(`Failed to fetch movies for genre ${genreId}:`, error);
    return [];
  }
};

/**
 * Fetch TV shows by genre with multiple pages to get more results
 */
export const getShowsByGenre = async (genreId: number, maxPages = 4) => {
  try {
    const pagePromises = Array.from({ length: maxPages }, (_, i) =>
      apiV3.get("/discover/tv", {
        params: { 
          with_genres: genreId, 
          page: i + 1,
          sort_by: "popularity.desc"
        },
      })
    );

    const responses = await Promise.all(pagePromises);
    const allResults = responses.flatMap(res => res.data.results || []);
    
    return allResults.map((r: any) => normalize(r, "tv"));
  } catch (error) {
    console.error(`Failed to fetch TV shows for genre ${genreId}:`, error);
    return [];
  }
};