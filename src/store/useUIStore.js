import { create } from 'zustand';

const useUIStore = create((set) => ({
  savedKeywordSearch: '',
  savedKeywordLiked: '',
  savedKeywordSubscribe: '',
  savedOption1: '아주대 공지사항',
  savedOption2: '아주대학교-일반',
  isAuthorized: false,

  setSavedKeywordSearch: (savedKeywordSearch) => set({ savedKeywordSearch }),
  setSavedKeywordLiked: (savedKeywordLiked) => set({ savedKeywordLiked }),
  setSavedKeywordSubscribe: (savedKeywordSubscribe) => set({ savedKeywordSubscribe }),
  setSavedOption1: (savedOption1) => {
    set({ savedOption1 });
  },
  setSavedOption2: (savedOption2) => {
    set({ savedOption2 });
  },
  setIsAuthorized: () => {
    set({ isAuthorized: true });
  },
}));

export default useUIStore;