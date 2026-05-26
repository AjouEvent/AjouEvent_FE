import api from '../api';

export const registerFcmToken = (fcmToken) =>
  api.post('/send/registration-token', { fcmToken });
