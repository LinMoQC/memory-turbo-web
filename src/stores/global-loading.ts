import { create } from 'zustand';

interface LoadingStore {
  loadingCount: number;
  setLoading: (loading: boolean) => void;
  isLoading: () => boolean;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  loadingCount: 0,

  setLoading: (loading) => {
    set((state) => ({
      loadingCount: loading ? state.loadingCount + 1 : Math.max(state.loadingCount - 1, 0),
    }));
  },
  isLoading: () => get().loadingCount > 0,
}));
