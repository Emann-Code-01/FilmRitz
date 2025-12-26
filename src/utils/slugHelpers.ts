export const slugify = (str: string | undefined): string => {
  if (!str) return "untitled";
  return encodeURIComponent(
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
};

export const slugToId = (
  param: string | string[] | undefined
): number | null => {
  if (!param) return null;

  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw) return null;

  const match = String(raw).match(/-(\d+)$/);
  return match ? Number(match[1]) : /^\d+$/.test(String(raw)) ? Number(raw) : null;
};

export const createMediaRoute = (
  media: {
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
  },
  basePath = "/ng"
): string => {
  const type = media.media_type === "tv" ? "tv" : "movie";
  const slug = slugify(media.title || media.name);
  return `${basePath}/${type}/${slug}-${media.id}`;
};
