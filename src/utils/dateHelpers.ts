/**
 * Centralized date formatting utilities
 */

/**
 * Format a date string to just the year
 * @param date - ISO date string (e.g., "2024-01-15")
 * @returns Year as string or "TBA" if invalid/missing
 */
export const formatYear = (date: string | null | undefined): string => {
  if (!date) return "TBA";
  const year = new Date(date).getFullYear();
  return isNaN(year) ? "TBA" : year.toString();
};

/**
 * Format a date string to a readable date
 * @param date - ISO date string
 * @param format - "year" | "full" | "short"
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | null | undefined,
  format: "year" | "full" | "short" = "year"
): string => {
  if (!date) return "TBA";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "TBA";

  switch (format) {
    case "year":
      return dateObj.getFullYear().toString();
    case "full":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "short":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    default:
      return dateObj.getFullYear().toString();
  }
};

/**
 * Get relative time from now (e.g., "2 days ago", "in 3 months")
 */
export const getRelativeTime = (date: string | null | undefined): string => {
  if (!date) return "Unknown";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Unknown";

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < -365) {
    const years = Math.floor(-diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (diffDays < -30) {
    const months = Math.floor(-diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (diffDays < 0) {
    return `${-diffDays} day${-diffDays > 1 ? "s" : ""} ago`;
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays < 30) {
    return `In ${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `In ${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `In ${years} year${years > 1 ? "s" : ""}`;
  }
};