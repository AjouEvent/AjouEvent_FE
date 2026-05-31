import { create } from 'zustand';

const useConfirmStore = create((set) => ({
  open: false,
  title: '',
  text: '',
  resolve: null,

  show(title, text) {
    return new Promise((resolve) => {
      set({ open: true, title, text, resolve });
    });
  },

  confirm() {
    set((state) => {
      state.resolve?.(true);
      return { open: false, resolve: null };
    });
  },

  cancel() {
    set((state) => {
      state.resolve?.(false);
      return { open: false, resolve: null };
    });
  },
}));

export default useConfirmStore;
