import { ref } from "vue"
import { getMovieDetails } from "../api/tmdb"

export function useMovie(movieId: number) {
  const movie = ref<any>(null)

  async function fetchMovie() {
    movie.value = await getMovieDetails(movieId)
  }

  return { movie, fetchMovie }
}
