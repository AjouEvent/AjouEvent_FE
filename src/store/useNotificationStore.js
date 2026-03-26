import { create } from 'zustand';
import api from '../services/api';

const useNotificationStore = create((set) => ({
  unreadNotificationCount: 0,

  setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),

  fetchUnreadNotificationCount: async () => {
    try {
      const response = await api.get('/api/notification/unread-count');
      set({ unreadNotificationCount: response.data.unreadNotificationCount });

      if (navigator.setAppBadge) {
        navigator.setAppBadge(response.data.unreadNotificationCount).catch(console.error);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  },
}));

export default useNotificationStore;    