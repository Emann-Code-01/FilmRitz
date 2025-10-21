/**
 * TMDB Genre Mapping
 * Maps genre IDs to human-readable names for both movies and TV shows.
 */

export const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

/**
 * Optional helper: reverse lookup by name → id
 * Useful if you want to create dynamic routes like /genre/:name
 */
export const genreNameToId: Record<string, number> = Object.fromEntries(
    Object.entries(genreMap).map(([id, name]) => [name.toLowerCase(), Number(id)])
);
