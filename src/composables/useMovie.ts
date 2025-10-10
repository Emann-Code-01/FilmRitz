// src/composables/useMovies.ts
import { ref } from "vue"
import axios from "axios"

const API_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export function useMovies() {
  const trending = ref<any[]>([])
  const topRated = ref<any[]>([])
  const upcoming = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getTrending = async () => {
    try {
      loading.value = true
      const res = await axios.get(`${API_URL}/trending/movie/week?api_key=${API_KEY}`)
      trending.value = res.data.results
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getTopRated = async () => {
    try {
      loading.value = true
      const res = await axios.get(`${API_URL}/movie/top_rated?api_key=${API_KEY}`)
      topRated.value = res.data.results
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getUpcoming = async () => {
    try {
      loading.value = true
      const res = await axios.get(`${API_URL}/movie/upcoming?api_key=${API_KEY}`)
      upcoming.value = res.data.results
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    trending,
    topRated,
    upcoming,
    loading,
    error,
    getTrending,
    getTopRated,
    getUpcoming
  }
}
