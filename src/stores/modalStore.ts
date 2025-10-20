import { ref } from "vue"
import { defineStore } from "pinia"

export const useModalStore = defineStore("modal", () => {
  // ✅ State
  const itemId = ref<number | null>(null)
  const mediaType = ref<"movie" | "tv" | null>(null)
  const isModalOpen = ref(false)

  // ✅ Open modal (generic for both movie + tv)
  function openModal(id: number, type: "movie" | "tv") {
    itemId.value = id
    mediaType.value = type
    isModalOpen.value = true
  }

  // ✅ Close modal
  function closeModal() {
    isModalOpen.value = false
    itemId.value = null
    mediaType.value = null
  }

  // ✅ Flexible open method
  function open(
    type: "movie" | "tv" | "media" | "trailer",
    payload?: { id?: number; movieId?: number; mediaType?: "movie" | "tv" }
  ) {
    // Determine the ID
    const resolvedId = payload?.id ?? payload?.movieId
    // Determine the media type
    const resolvedType =
      payload?.mediaType ?? (type === "movie" || type === "tv" ? type : "movie")

    if (resolvedId && (resolvedType === "movie" || resolvedType === "tv")) {
      openModal(resolvedId, resolvedType)
    }
  }

  return {
    itemId,
    mediaType,
    isModalOpen,
    openModal,
    closeModal,
    open,
  }
})
