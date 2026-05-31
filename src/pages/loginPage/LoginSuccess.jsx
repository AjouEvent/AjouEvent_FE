import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LIMITS, STORAGE_KEYS } from '../../constants/appConstants';
import { oauthLogin } from '../../services/api/user';

const Toast = Swal.mixin({
  toast: true,
  position: 'center-center',
  showConfirmButton: false,
  timer: LIMITS.TOAST_TIMER.LONG,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(location.search);
      const authorizationCode = params.get('code');

      if (authorizationCode) {
        const fcmToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
        const redirectUri = window.location.origin + '/loginSuccess';

        const loginData = {
          authorizationCode: authorizationCode,
          fcmToken: fcmToken,
          redirectUri: redirectUri,
        };

        try {
          const response = await oauthLogin(loginData);

          if (response.status === 200) {
            const { id, accessToken, email, name, major, isNewMember } = response.data;

            localStorage.setItem(STORAGE_KEYS.USER_ID, id);
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.EMAIL, email);
            localStorage.setItem(STORAGE_KEYS.NAME, name);
            localStorage.setItem(STORAGE_KEYS.MAJOR, major);

            Toast.fire({ icon: 'success', title: '로그인 성공' });

            if (isNewMember) {
              navigate('/privacy-agreement');
            } else {
              navigate('/');
            }
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 400) {
              console.error('잘못된 인가 코드:', error.response.data);
              Toast.fire({ icon: 'error', title: '로그인 실패', text: error.response.data?.message });
            } else {
              console.error('응답 에러:', error.response.data);
              Toast.fire({ icon: 'warning', title: error.response.data?.message ?? '로그인 중 오류가 발생했습니다.' });
            }
            navigate('/login');
          } else if (error.request) {
            console.error('응답 없음:', error.request);
            Toast.fire({ icon: 'warning', title: '서버 응답이 없습니다.' });
            navigate('/login');
          } else {
            console.error('요청 설정 에러:', error.message);
            Toast.fire({ icon: 'warning', title: '요청 설정 에러: ' + error.message });
            navigate('/login');
          }
        }
      } else {
        console.error('Missing URL parameters');
        Toast.fire({ icon: 'warning', title: 'Missing URL parameters' });
        navigate('/login');
      }
    };

    handleLogin();
  }, [location, navigate]);

  return (
    <div className="w-full h-screen flex justify-center items-center text-black text-[26px] font-bold">
      로그인 중
      <div className="w-[20%] h-auto flex justify-center items-center">
        <img src="Spinner.gif" alt="loading" className="w-1/2 h-1/2" />
      </div>
    </div>
  );
};

export default LoginSuccess;
