const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";
const PLACEHOLDER = "https://placehold.co/500x750/0f0f0f/FF0000?text=NO+IMAGE";
const PLACEHOLDER_BACKDROP =
  "https://placehold.co/780x439/0f0f0f/FF0000?text=FILMRITZ%0ANO+IMAGE&font=montserrat";

export const getPosterUrl = (path: string | null | undefined): string => {
  return path ? `${POSTER_BASE_URL}${path}` : PLACEHOLDER;
};

export const getBackdropUrl = (path: string | null | undefined): string => {
  return path ? `${BACKDROP_BASE_URL}${path}` : PLACEHOLDER_BACKDROP;
};

export const getImageUrl = (
  path: string | null | undefined,
  type: "poster" | "backdrop" = "poster",
): string => {
  if (!path) return PLACEHOLDER;
  return type === "backdrop" ? getBackdropUrl(path) : getPosterUrl(path);
};

export const getTmdbImageUrl = (
  path: string | null | undefined,
  width: number = 500,
): string => {
  return path ? `https://image.tmdb.org/t/p/w${width}${path}` : PLACEHOLDER;
};
