/**
 * Centralized color utilities
 */

/**
 * Temperature color palette (hot to cool) based on ranking
 * Used for trending, popular, top-rated grids
 */
const TEMPERATURE_COLORS = [
  "#FF0000", // #1 - Red hot
  "#FF4500", // #2 - Orange red
  "#FF6347", // #3 - Tomato
  "#FF8C00", // #4 - Dark orange
  "#FFA500", // #5 - Orange
  "#FFD700", // #6 - Gold
  "#FFFF00", // #7 - Yellow
] as const;

/**
 * Get a temperature color based on index/ranking
 * @param index - Position in list (0-based)
 * @returns Hex color code
 */
export const getTemperatureColor = (index: number): string => {
  return TEMPERATURE_COLORS[index] || "#FFA500";
};

/**
 * Ambient color palette for various UI states
 */
export const AMBIENT_COLORS = {
  default: "#111111",
  primary: "#FF0000",
  secondary: "#FF4500",
  accent: "#FFD700",
  hover: "#FFA500",
} as const;

/**
 * Get rating color based on score
 * @param rating - Rating value (0-10)
 * @returns Hex color code
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return "#22c55e"; // Green - Excellent
  if (rating >= 7) return "#84cc16"; // Lime - Good
  if (rating >= 6) return "#facc15"; // Yellow - Decent
  if (rating >= 5) return "#fb923c"; // Orange - Mediocre
  return "#ef4444"; // Red - Poor
};

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Get contrasting text color (black or white) based on background
 */
export const getContrastColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return "#ffffff";

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};