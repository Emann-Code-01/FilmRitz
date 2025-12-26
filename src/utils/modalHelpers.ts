import { useModalStore } from "@/stores/modalStore";

export const openMediaModal = (media: any) => {
  const modalStore = useModalStore();
  const type = media.media_type ?? "movie";
  modalStore.open(type, { movieId: media.id, mediaType: media.media_type });
};

export const createModalHandler = (media: any) => () =>
  openMediaModal(media);
