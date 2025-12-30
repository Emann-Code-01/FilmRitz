import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

if (!apiKey) {
  throw new Error(
    "🚨 TMDB API Configuration Error\n\n" +
    "Missing required environment variable: VITE_TMDB_API_KEY\n\n" +
    "Please add it to your .env file:\n" +
    "VITE_TMDB_API_KEY=your-tmdb-api-key"
  );
}

const apiV3 = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey, // ✅ sends ?api_key=YOUR_KEY automatically

    language: "en-US",
  },
});

export default apiV3;
