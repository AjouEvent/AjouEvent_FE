import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-family: 'Pretendard Variable';
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
`;

const LoadingWrapper = styled.div`
  width: 20%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingImage = styled.img`
  width: 50%;
  height: 50%;
`;

const Toast = Swal.mixin({
  toast: true,
  position: 'center-center',
  showConfirmButton: false,
  timer: 3000,
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
        const fcmToken = localStorage.getItem('fcmToken');
        const redirectUri = window.location.origin + '/loginSuccess';

        const loginData = {
          authorizationCode: authorizationCode,
          fcmToken: fcmToken,
          redirectUri: redirectUri,
        };

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BE_URL}/api/users/oauth`,
            loginData,
            { withCredentials: true },
          );

          if (response.status === 200) {
            console.log('[LoginSuccess] response.data:', response.data);
            const {
              id,
              accessToken,
              refreshToken,
              email,
              name,
              major,
              isNewMember,
            } = response.data;
            console.log('[LoginSuccess] isNewMember:', isNewMember);

            localStorage.setItem('id', id);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('email', email);
            localStorage.setItem('name', name);
            localStorage.setItem('major', major);
            Swal.fire({
              icon: 'success',
              title: '로그인 성공',
              text: '로그인이 완료되었습니다!',
            });

            if (isNewMember) {
              navigate('/register-info', { state: { email, name } });
            } else {
              navigate('/');
            }
          }
        } catch (error) {
          if (error.response) {
            if (error.response.status === 404) {
              Swal.fire({
                icon: 'error',
                title: '회원가입되지 않은 사용자',
                text: '회원가입 페이지로 이동합니다.',
              });
              navigate('/signUp');
            } else {
              console.error('응답 에러:', error.response.data);
              Toast.fire({
                icon: 'warning',
                title: '응답 에러:' + error.response.data,
              });
              navigate('/login');
            }
          } else if (error.request) {
            console.error('응답 없음:', error.request);
            Toast.fire({
              icon: 'warning',
              title: '응답 없음:' + error.request,
            });
            navigate('/login');
          } else {
            console.error('요청 설정 에러:', error.message);
            Toast.fire({
              icon: 'warning',
              title: '요청 설정 에러:' + error.message,
            });
            navigate('/login');
          }
        }
      } else {
        console.error('Missing URL parameters');
        Toast.fire({
          icon: 'warning',
          title: 'Missing URL parameters',
        });
        navigate('/login');
      }
    };

    handleLogin();
  }, [location, navigate]);

  return (
    <Container>
      로그인 중
      <LoadingWrapper>
        <LoadingImage src="Spinner.gif" alt="loading" />
      </LoadingWrapper>
    </Container>
  );
};

export default LoginSuccess;
