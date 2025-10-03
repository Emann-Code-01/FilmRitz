import { ref } from "vue"
import { defineStore } from "pinia"

export const useModalStore = defineStore("modal", () => {
  const movieId = ref<number | null>(null)
  const isMovieModal = ref(false)

  function openMovieModal(id: number) {
    movieId.value = id
    isMovieModal.value = true
  }

  function closeMovie() {
    isMovieModal.value = false
    movieId.value = null
  }

  // ✅ generic open
  function open(type: "movie" | "trailer", payload?: { movieId?: number }) {
    if (type === "movie" && payload?.movieId) {
      openMovieModal(payload.movieId)
    }
  }

  return {
    movieId,
    isMovieModal,
    openMovieModal,
    closeMovie,
    open, // 👈 don't forget this
  }
})
