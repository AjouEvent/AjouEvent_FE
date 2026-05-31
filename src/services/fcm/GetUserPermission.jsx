import GetFCMToken from './GetFCMToken';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../constants/appConstants';

const GetUserPermission = async (setIsLoading) => {
  try {
    if (!('Notification' in window)) {
      alert(
        '알림 서비스를 원활하게 사용하시려면 홈화면에 추가 후, 알림 허용을 해주세요.',
      );
      return;
    }

    console.log('Checking notification permission...');

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        console.log('Notification permission granted. Ready to send token...');
        setIsLoading(true);
        await GetFCMToken();
        setIsLoading(false);
        let isFCMToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
        if (!isFCMToken) {
          setIsLoading(true);
          await GetFCMToken();
          setIsLoading(false);
          toast.success('알림 토큰 저장 성공');
        } else {
          console.log('token already saved');
        }
      } catch {
        setIsLoading(false);
        toast.error('알림 토큰 요청 실패');
      }
    } else if (permission === 'denied') {
      console.log(
        'Notification permission not granted. Requesting permission...',
      );
    }
  } catch (error) {
    toast.error('알림 설정 요청 실패');
    console.error('Failed to check or request notification permission:', error);
    setIsLoading(false);
  }
};

export default GetUserPermission;
