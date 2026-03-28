import { create } from 'zustand';
import { getUnreadNotificationCount } from '../services/api/notification';

const useNotificationStore = create((set) => ({
  unreadNotificationCount: 0,

  setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),

  fetchUnreadNotificationCount: async () => {
    try {
      const response = await getUnreadNotificationCount();
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