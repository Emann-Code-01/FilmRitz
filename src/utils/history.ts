export const addToHistory = (item: any) => {
  try {
    const history = JSON.parse(localStorage.getItem("watchHistory") || "[]");

    // Check if valid item
    if (!item || !item.id) return;

    // Filter out existing entry to move it to the top
    const filtered = history.filter((h: any) => h.id !== item.id);

    const newEntry = {
      id: item.id,
      title: item.title || item.name || "Untitled",
      name: item.name || item.title || "Untitled",
      poster_path: item.poster_path,
      overview: item.overview,
      media_type: item.media_type,
      vote_average: item.vote_average,
      release_date: item.release_date || item.first_air_date,
      watchedAt: Date.now(),
    };

    // Add new entry at the beginning, limit to 50 items
    const updated = [newEntry, ...filtered].slice(0, 50);

    localStorage.setItem("watchHistory", JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save history:", err);
  }
};
