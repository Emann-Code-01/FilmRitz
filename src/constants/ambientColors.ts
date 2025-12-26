export const AMBIENT_COLORS = [
  "#b20710", // FilmRitz Red
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Green
  "#EF4444", // Red
  "#06B6D4", // Cyan
];

export const getRandomAmbientColor = () => {
  return AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)];
};
