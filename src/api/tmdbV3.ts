// src/api/tmdbV3.ts
import axios from "axios";

const apiV3 = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL, // e.g. https://api.themoviedb.org/3
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY, // short API key
    language: "en-US",
  },
});

export default apiV3;
