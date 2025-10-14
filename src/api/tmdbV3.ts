import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY; // ✅ Must be set in .env

const apiV3 = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey, // ✅ sends ?api_key=YOUR_KEY automatically

    language: "en-US",
  },
});

export default apiV3;
