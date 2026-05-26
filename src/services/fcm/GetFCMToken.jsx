import { firebaseApp } from './firebase';
import { getMessaging, getToken } from 'firebase/messaging';
import { STORAGE_KEYS } from '../../constants/appConstants';
import { registerFcmToken } from '../api/fcm';

const GetFCMToken = async () => {
  try {
    const messagingPromise = new Promise((resolve, reject) => {
      const messaging = getMessaging(firebaseApp);
      if (messaging) {
        resolve(messaging);
      } else {
        reject(new Error('Messaging object is not available'));
      }
    });

    const messaging = await messagingPromise;
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });

    if (currentToken) {
      localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, currentToken);
      try {
        await registerFcmToken(currentToken);
      } catch {
        // 서버 등록 실패해도 로컬 토큰은 유지
      }
    } else {
      console.log(
        'No registration token available. Request permission to generate one.',
      );
    }
  } catch (error) {
    console.error(
      'An error occurred while sending the token to the server:',
      error,
    );
    throw error;
  }
};

export default GetFCMToken;
