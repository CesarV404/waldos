import { create } from "zustand";
import { ModalStoreState, ModalState } from "@/interfaces/modal-interface";

export const useModalStore = create<ModalStoreState>()((set) => ({
  isModalOpen: false,
  title: "",
  msg: "",
  type: "info",

  setModalContent: (title: string, msg: string, type = "info") => {
    set((state: ModalState) => {
      return {
        ...state,
        title,
        msg,
        type,
      };
    });
  },
  open: () => {
    set((state: ModalState) => {
      return {
        ...state,
        isModalOpen: true,
      };
    });
  },
  close: () =>
    set({
      isModalOpen: false,
      title: "",
      msg: "",
      type: "info",
    }),
}));
