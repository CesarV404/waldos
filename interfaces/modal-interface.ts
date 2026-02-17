export type ModalType = "info" | "success" | "error" | "warning";

export interface ModalState {
  isModalOpen: boolean;
  title: string;
  msg: string;
  type: ModalType;
}

export interface ModalActions {
  setModalContent: (title: string, msg: string, type?: ModalType) => void;
  open: () => void;
  close: () => void;
}

export type ModalStoreState = ModalState & ModalActions;
