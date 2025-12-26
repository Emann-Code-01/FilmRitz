import { genreMap, genreNameToId } from "@/types/media";

export const getGenreNames = (genreIds?: number[]): string[] => {
  if (!genreIds?.length) return ["Unknown"];
  return genreIds
    .map((id) => genreMap[id])
    .filter((name): name is string => !!name);
};

export const getGenreIdFromName = (name: string): number | undefined => {
  return genreNameToId[name.toLowerCase()];
};

export const getGenreIdsFromMedia = (media: any): number[] => {
  if (!media) return [];
  if (Array.isArray(media.genre_ids)) return media.genre_ids;
  if (Array.isArray(media.genres))
    return media.genres.map((g: { id: number }) => g.id);
  return [];
};
