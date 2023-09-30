// this is a globale state that allow open close the modal from different components
import { create } from "zustand"
interface ModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void
}

export const useModalStore = create<ModalState>((set, get) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false })
}))
