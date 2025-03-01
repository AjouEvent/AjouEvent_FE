import GetFCMToken from './GetFCMToken';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'center-center',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const GetUserPermission = async (setIsLoading) => {
  try {
    //서비스워커 추가
    // await navigator.serviceWorker.register("firebase-messaging-sw.js");

    // const registrations = await navigator.serviceWorker.getRegistrations();
    // if (registrations.length === 0) {
    //   setIsLoading(true);
    //   await registerServiceWorker();
    //   setIsLoading(false);
    // }

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
        Toast.fire({
          icon: 'success',
          title: `알림 토큰 저장 성공`,
        });
        let isFCMToken = localStorage.getItem('fcmToken');
        if (!isFCMToken) {
          setIsLoading(true);
          await GetFCMToken();
          setIsLoading(false);
          Toast.fire({
            icon: 'success',
            title: `알림 토큰 저장 성공`,
          });
        } else {
          console.log('token already saved');
        }
      } catch {
        Toast.fire({
          icon: 'error',
          title: `알림 토큰 요청 실패`,
        });
      }
    } else if (permission === 'denied') {
      // alert("알림권한이 허용되어 있지않습니다. 권한을 허용해 주십시오.");
      console.log(
        'Notification permission not granted. Requesting permission...',
      );
    } else {
      // Toast.fire({
      //   icon: "warning",
      //   title: `알림 설정 안함`,
      //   text: "알림 설정 요청을 원하시면 종아이콘을 클릭해주세요.",
      // });
    }
  } catch (error) {
    Toast.fire({
      icon: 'error',
      title: `알림 설정 요청 실패`,
    });
    console.error('Failed to check or request notification permission:', error);
    setIsLoading(false);
  }
};

export default GetUserPermission;
