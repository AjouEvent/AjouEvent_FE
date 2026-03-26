import { create } from 'zustand';
import requestWithAccessToken from '../services/jwt/requestWithAccessToken';

const useNotificationStore = create((set) => ({
  unreadNotificationCount: 0,

  setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),

  fetchUnreadNotificationCount: async () => {
    try {
      const response = await requestWithAccessToken(
        'get',
        `${process.env.REACT_APP_BE_URL}/api/notification/unread-count`
      );
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
