import api from '../api';

export const readAllNotifications = () =>
  api.post('/api/notification/readAll');

export const clickNotification = (pushNotificationId) =>
  api.post('/api/notification/click', { pushNotificationId });

export const getUnreadNotificationCount = () =>
  api.get('/api/notification/unread-count');
