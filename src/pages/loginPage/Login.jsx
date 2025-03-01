import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import GetUserPermission from '../../services/fcm/GetUserPermission';
import Swal from 'sweetalert2';

const Container = styled.div`
  z-index: 1;
  display: block;
  padding-top: 8rem;
  width: 90%;
  height: 100vh;
  background-color: transparent;
  margin: 0;
  font-family: 'Pretendard Variable';
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  width: 100px;
  height: 100px;
  background: url('../image/AjouUniversity-logo.png') no-repeat center center;
  background-size: contain;
`;

const Heading = styled.h1`
  color: #000000;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-align: left;
  font-family: 'Pretendard Variable';
`;

const HeadingWrapper = styled.div`
  display: flex;
  width: 90%;
  max-width: 680px;
  align-items: start;
  justify-content: baseline;
  padding-left: 1rem;
`;

// 새로 추가된 스타일
const StyledParagraph = styled.p`
  color: #000;
  font-size: 15px;
  font-family: 'Pretendard Variable';
  margin-top: 10px; /* 상단 여백 추가 */
  margin-bottom: 10px; /* 하단 여백 추가 */
`;

const HighlightedText = styled.span`
  color: red;
  font-weight: bold;
`;

const Form = styled.form`
  width: 100%;
  margin: 10px auto 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Separator = styled.div`
  display: block;
  margin: 10px auto 10px;
  max-width: 680px;
  text-align: center;
  height: 10px;
  position: relative;
  background: transparent;
  color: rgba(255, 255, 255);
  width: 90%;
  max-width: 680px;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0;
    background: rgba(120, 120, 120, 0.5);
    height: 1px;
    width: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 0;
    background: rgba(120, 120, 120, 0.5);
    height: 1px;
    width: 50%;
  }
`;

const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 680px;
  height: 50px;
  margin: 16px auto 0;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1); // 테두리 색상 설정
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding-left: 8px; // 왼쪽 여백 8dp
  padding-right: 8px; // 오른쪽 여백 8dp

  &:hover {
    background-color: #f0f0f0;
  }

  .icon {
    width: 18px; // 로고 크기
    height: 18px;
    margin-right: 24px; // 로고와 텍스트 사이 간격 24dp
  }

  span {
    text-align: center;
    color: #000000;
    color: rgba(0, 0, 0, 0.54); // 폰트 컬러 54% 투명도
    font-size: 14px;
    font-family: 'Roboto', system-ui;
    font-weight: 500;
    font-style: normal;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto;
  margin-top: 20px;
  font-size: 14px;
  color: #6f6f6f;
  width: 90%;
  max-width: 680px;

  span {
    color: #000;
  }

  a {
    color: #0072ce;
    text-decoration: none;
    font-weight: 700;
  }
`;

const Description = styled.p`
  color: #999999;
  margin: 40px 0 20px 0;
  font-size: 14px;
  width: 100%;
  text-align: center;
  line-height: 1.8;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  z-index: 1000;
`;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetUserPermission(setIsLoading);
  }, []);

  const handleGoogleButtonClicked = () => {
    const fcmToken = localStorage.getItem('fcmToken');
    if (!fcmToken) {
      Swal.fire({
        icon: 'error',
        title: '알림토큰 미등록',
        text: '홈화면에 추가’를 통해 설치 / 알림 설정(허용)을 확인해주세요 ',
      });
      return;
    }
    const redirect_uri_origin = window.location.origin;
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${redirect_uri_origin}/loginSuccess&response_type=code&prompt=consent&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar&hd=ajou.ac.kr`;
  };

  return (
    <Container>
      {isLoading && <LoadingOverlay>알림 서비스 등록 중 ...</LoadingOverlay>}

      <Form>
        <HeadingWrapper>
          <Heading>로그인</Heading>
        </HeadingWrapper>
        <HeadingWrapper>
          <StyledParagraph>
            기본 로그인이 <HighlightedText>구글 로그인</HighlightedText>으로
            통합되었습니다.
          </StyledParagraph>
        </HeadingWrapper>
      </Form>
      <GoogleLoginButton onClick={handleGoogleButtonClicked}>
        <FcGoogle className="icon" />
        <span>Google 계정으로 로그인</span>
      </GoogleLoginButton>
      <Separator></Separator>
      <BottomLinks>
        <span>아직 회원이 아니신가요?</span>
        <Link to="/privacy-agreement">회원가입</Link>
      </BottomLinks>
      <Description>
        * AjouEvent는 2024-1학기 아주대학교 파란학기제에서
        <br />
        진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다. <br />
        * AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다. <br />
        서비스 문의: jysim0326@ajou.ac.kr
      </Description>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
    </Container>
  );
};

export default Login;
