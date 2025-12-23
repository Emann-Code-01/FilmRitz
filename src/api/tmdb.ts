import apiV3 from "./tmdbV3";
import { genreMap, Person } from "@/types/media";
import { Media, TVShow, Season, Episode } from "@/types/media";
import { COLLECTIONS, getCollectionByName } from "@/types/media";
import type { Collection } from "@/types/media";
export function normalize(item: any, mediaType?: "movie" | "tv"): Media {
  const mt = mediaType ?? item.media_type ?? (item.title ? "movie" : "tv");

  const genres =
    item.genres && item.genres.length
      ? item.genres
      : item.genre_ids?.map((id: number) => ({
          id,
          name: genreMap[id] || "Unknown",
        })) || [];

  const base: Media = {
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
  if (mt === "tv") {
    base.status = item.status || "Unknown"; // TMDB status: "Ended", "Returning Series", "Canceled", etc.
  }

  return base;
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
  return (res.data.results || []).map((r: any) =>
    normalize(r, "tv")
  ) as TVShow[];
};

export const fetchPopularTV = async (page = 1): Promise<TVShow[]> => {
  const res = await apiV3.get("/tv/popular", { params: { page } });
  return (res.data.results || []).map((r: any) =>
    normalize(r, "tv")
  ) as TVShow[];
};

export const fetchTopRatedTV = async (page = 1): Promise<TVShow[]> => {
  const res = await apiV3.get("/tv/top_rated", { params: { page } });
  return (res.data.results || []).map((r: any) =>
    normalize(r, "tv")
  ) as TVShow[];
};

// TMDB doesn’t have /tv/upcoming; use /tv/on_the_air or /tv/airing_today instead.
export const fetchOnTheAir = async (page = 1): Promise<TVShow[]> => {
  try {
    const res = await apiV3.get("/tv/on_the_air", { params: { page } });
    return (res.data.results || []).map((r: any) =>
      normalize(r, "tv")
    ) as TVShow[];
  } catch {
    const res = await apiV3.get("/tv/airing_today", { params: { page } });
    return (res.data.results || []).map((r: any) =>
      normalize(r, "tv")
    ) as TVShow[];
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

// --------------------------- TV CREDITS (CAST + CREW) ---------------------------

export const getTVEpisodeCredits = async (
  tvId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const res = await apiV3.get(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/credits`
  );
  return res.data.cast || [];
};

// --------------------------- TV SEASONS & EPISODES ---------------------------

export const getTVSeasonDetails = async (
  tvId: number,
  seasonNumber: number
): Promise<Season & { episodes: Episode[] }> => {
  const res = await apiV3.get(`/tv/${tvId}/season/${seasonNumber}`);
  return res.data;
};

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

export const getTVEpisodeExtras = async (
  tvId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const res = await apiV3.get(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/credits`
  );
  return res.data;
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
  return values.sort(
    (a: any, b: any) => (b.popularity || 0) - (a.popularity || 0)
  );
};

export const fetchTopRatedMedia = async (page = 1): Promise<Media[]> => {
  const results = await Promise.allSettled([
    fetchTopRatedMovies(page),
    fetchTopRatedTV(page),
  ]);

  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled"
  );

  const values = fulfilled.map((r) => r.value).flat();

  // Sort by vote average descending
  return values.sort(
    (a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0)
  );
};

export const getMediaDetails = async (
  id: number,
  mediaType: "movie" | "tv"
): Promise<Media | TVShow | null> => {
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

// --------------------------- ACTORS / PEOPLE ---------------------------

/**
 * Get full actor/person details by ID
 */
export const getActorDetails = async (personId: number) => {
  const res = await apiV3.get(`/person/${personId}`);
  return res.data;
};

/**
 * Get all credits (cast + crew) for an actor/person
 */
export const getActorCredits = async (personId: number) => {
  const res = await apiV3.get(`/person/${personId}/combined_credits`);
  // Combine cast + crew for full filmography
  const credits = [...res.data.cast, ...res.data.crew];
  return credits.sort((a: any, b: any) => {
    const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
    const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
    return dateB - dateA;
  });
};

// --------------------------- SEARCH (MULTI) ---------------------------

export const searchMulti = async (query: string, page = 1): Promise<any[]> => {
  const res = await apiV3.get("/search/multi", {
    params: { query, page, include_adult: false },
  });

  // ✅ Return ALL results (including people) without filtering
  return res.data.results || [];
};

// ✅ NEW: Dedicated person search
export const searchPeople = async (query: string): Promise<Person[]> => {
  const res = await apiV3.get("/search/person", {
    params: { query, include_adult: false },
  });
  return res.data.results || [];
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
      parseInt(
        item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)
      ) || 0;
    const rating = item.vote_average || 0;

    const matchesMediaType =
      !filters.mediaType || filters.mediaType === "all"
        ? true
        : item.media_type === filters.mediaType;

    const matchesYearFrom = filters.yearFrom
      ? year >= Number(filters.yearFrom)
      : true;
    const matchesYearTo = filters.yearTo
      ? year <= Number(filters.yearTo)
      : true;
    const matchesRating = filters.rating
      ? rating >= Number(filters.rating)
      : true;

    return (
      matchesMediaType && matchesYearFrom && matchesYearTo && matchesRating
    );
  });
};

// --------------------------- ✔ NEW: POPULAR MEDIA ---------------------------

export const fetchPopularMedia = async (page = 1): Promise<Media[]> => {
  const results = await Promise.allSettled([
    fetchPopularMovies(page),
    fetchPopularTV(page),
  ]);

  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled"
  );

  const values = fulfilled.map((r) => r.value).flat();

  return values.sort(
    (a: any, b: any) => (b.popularity || 0) - (a.popularity || 0)
  );
};

// --------------------------- ✔ NEW: UPCOMING MEDIA (movie + tv-on-air) ---------------------------

export const fetchUpcomingMedia = async (page = 1): Promise<Media[]> => {
  const results = await Promise.allSettled([
    fetchUpcomingMovies(page),
    fetchOnTheAir(page), // tv version of “upcoming”
  ]);

  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled"
  );

  const values = fulfilled.map((r) => r.value).flat();

  return values.sort(
    (a: any, b: any) =>
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  );
};

// --------------------------- ✔ NEW: DISCOVER ---------------------------

export const discoverMedia = async ({
  mediaType = "movie",
  page = 1,
  sortBy = "popularity.desc",
  genre,
  year,
  minRating,
}: {
  mediaType?: "movie" | "tv";
  page?: number;
  sortBy?: string;
  genre?: string | number;
  year?: number;
  minRating?: number;
}): Promise<Media[]> => {
  const res = await apiV3.get(`/discover/${mediaType}`, {
    params: {
      page,
      sort_by: sortBy,
      with_genres: genre,
      primary_release_year: mediaType === "movie" ? year : undefined,
      first_air_date_year: mediaType === "tv" ? year : undefined,
      "vote_average.gte": minRating,
    },
  });

  return (res.data.results || []).map((r: any) => normalize(r, mediaType));
};

export function getPoster(path: string | null, size: string = "w-1280") {
  if (!path) return "/no-poster.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// --------------------------- TRAILERS ---------------------------

export interface TrailerData {
  id: string;
  title: string;
  type: string;
  backdrop_path: string;
  duration: number;
  mediaId: number;
  mediaType: "movie" | "tv";
  key: string;
  site: string;
  publishedAt?: string;
}

export const fetchAllTrailers = async (): Promise<TrailerData[]> => {
  const allTrailers: TrailerData[] = [];

  const [popularMovies, popularTV, trendingMovies, trendingTV] =
    await Promise.all([
      fetchPopularMovies(1),
      fetchPopularTV(1),
      fetchTrendingMovies("week"),
      fetchTrendingTV("week"),
    ]);

  // Combine and deduplicate
  const movies = [...popularMovies, ...trendingMovies]
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    )
    .slice(0, 10);

  const tvShows = [...popularTV, ...trendingTV]
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    )
    .slice(0, 10);

  // Fetch videos for each media item
  const movieTrailerPromises = movies.map(async (movie) => {
    try {
      const videos = await getMovieVideos(movie.id);
      const trailer = videos.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        return {
          id: `movie-${movie.id}-${trailer.key}`,
          title: movie.title || "",
          type: "Movie Trailer",
          backdrop_path: movie.backdrop_path || movie.poster_path || "",
          duration: 150, // Default duration
          mediaId: movie.id,
          mediaType: "movie" as const,
          key: trailer.key,
          site: trailer.site,
          publishedAt: trailer.published_at,
        };
      }
    } catch (error) {
      console.error(`Error fetching trailer for movie ${movie.id}:`, error);
    }
    return null;
  });

  const tvTrailerPromises = tvShows.map(async (show) => {
    try {
      const videos = await getTVVideos(show.id);
      const trailer = videos.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        return {
          id: `tv-${show.id}-${trailer.key}`,
          title: show.title || "",
          type: "TV Trailer",
          backdrop_path: show.backdrop_path || show.poster_path || "",
          duration: 150, // Default duration
          mediaId: show.id,
          mediaType: "tv" as const,
          key: trailer.key,
          site: trailer.site,
          publishedAt: trailer.published_at,
        };
      }
    } catch (error) {
      console.error(`Error fetching trailer for TV show ${show.id}:`, error);
    }
    return null;
  });

  const results = await Promise.allSettled([
    ...movieTrailerPromises,
    ...tvTrailerPromises,
  ]);

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      allTrailers.push(result.value);
    }
  });

  return allTrailers;
};
/**
 * Fetch all collections with a preview of items (for grid view)
 */
export const fetchAllCollections = async (
  itemsPerCollection = 8
): Promise<Collection[]> => {
  const collectionPromises = COLLECTIONS.map(async (col) => {
    try {
      const res = await apiV3.get("/discover/movie", {
        params: {
          with_genres: col.genreIds.join(","),
          sort_by: "vote_average.desc",
          "vote_count.gte": 1000,
          page: 1,
        },
      });

      const items = (res.data.results || [])
        .slice(0, itemsPerCollection)
        .map((r: any) => normalize(r, "movie"));

      return {
        ...col,
        items,
        totalItems: res.data.total_results || 0,
      };
    } catch (error) {
      console.error(`Failed to fetch collection ${col.name}:`, error);
      return {
        ...col,
        items: [],
        totalItems: 0,
      };
    }
  });

  return Promise.all(collectionPromises);
};

/**
 * Fetch a single collection by name with pagination
 */
export const fetchCollectionByName = async (
  collectionName: string,
  page = 1,
  itemsPerPage = 20
): Promise<Collection | null> => {
  const collectionDef = getCollectionByName(collectionName);

  if (!collectionDef) {
    console.error(`Collection "${collectionName}" not found`);
    return null;
  }

  try {
    const res = await apiV3.get("/discover/movie", {
      params: {
        with_genres: collectionDef.genreIds.join(","),
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
        page,
      },
    });

    const items = (res.data.results || [])
      .slice(0, itemsPerPage)
      .map((r: any) => normalize(r, "movie"));

    return {
      ...collectionDef,
      items,
      totalItems: res.data.total_results || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error(`Failed to fetch collection "${collectionName}":`, error);
    return {
      ...collectionDef,
      items: [],
      totalItems: 0,
      currentPage: page,
    };
  }
};
