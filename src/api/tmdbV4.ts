import axios from "axios";
const apiV4 = axios.create({
  baseURL: import.meta.env.VITE_TMDB_V4_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
export default apiV4;
