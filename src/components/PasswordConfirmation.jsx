import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { STORAGE_KEYS, COLORS } from '../constant/appConstants';

const PasswordConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const TapWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 0px 16px 0px;
  gap: 8px;
`;

const TapIcon = styled.img`
  aspect-ratio: 1;
  width: 20px;
  object-fit: contain;
  object-position: center;
  cursor: pointer;
`;

const TapTitle = styled.div`
  color: ${COLORS.BLACK};
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
`;

const Title = styled.h2`
  font-family: "Pretendard Variable";
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 120%;
`;

const InputLabel = styled.p`
  margin: 2px 0 2px 0;
  font-size: 14px;
  font-weight: 600;
  flex-grow: 1; 
  white-space : nowrap
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${COLORS.BORDER_GARY};
  border-radius: 4px;
  font-size: 1rem;
  flex-grow: 1;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 5px 0 5px 0;
`;

const PasswordWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TogglePasswordVisibility = styled.span`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: rgb(0, 102, 179);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: ${COLORS.DARK_GRAY_TEXT};
  }
`;

// 추가된 비밀번호 확인 기능용 에러 표시
const PasswordError = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  color: red;
  padding-left: 20px;
  font-size: 0.8em;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  width: 100%;
`;

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%+\^&()\+=\-~`*]).{8,24}$/;

const PasswordConfirmation = ({ onConfirm }) => {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 유효성 에러 메시지
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  useEffect(() => {
    // 비밀번호가 입력될 때마다 유효성 검사
    if (password.length > 0 && !passwordRegEx.test(password)) {
      setPasswordError('* 비밀번호 형식을 확인해주세요.');
    } else {
      setPasswordError(''); // 유효한 비밀번호일 때는 에러 메시지 제거
    }
  }, [password]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const fcmToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
    if (!fcmToken) {
      Swal.fire({
        icon: "error",
        title: "알림허용안됨",
        text: "홈화면의 알림아이콘을 터치해주세요",
      });
      return;
    }

    const userData = {
      email: email,
      password: password,
      fcmToken: fcmToken,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BE_URL}/api/users/login`,
        userData
      );

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

      // 응답 로그
      localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.id);
      localStorage.setItem(STORAGE_KEYS.NAME, response.data.name);
      localStorage.setItem(STORAGE_KEYS.MAJOR, response.data.major);

      navigate("/profile-modification", {
        state: { user: response.data } // 사용자 정보 전달
      });
    } catch (error) {
      // 에러를 처리
      if (error.response) {
        console.error("응답 에러:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "비밀번호를 다시 확인해주세요",
        });
      } else if (error.request) {
        console.error("응답 없음:", error.request);
        Swal.fire({
          icon: "warning",
          title: "응답없음",
          text: error.request,
        });
        navigate("/login");
      } else {
        console.error("요청 설정 에러:", error.message);
        Swal.fire({
          icon: "warning",
          title: "요청 설정 에러",
          text: error.message,
        });
        navigate("/login");
      }
    }
  };

  // 뒤로가기 클릭 시 구독 페이지로 이동
  const arrowBackClicked = () => {
    navigate("/mypage");
  };

  return (
    <PasswordConfirmContainer>
      <TapWrapper>
        <TapIcon
          onClick={arrowBackClicked}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
        />
        <TapTitle>마이페이지</TapTitle>
      </TapWrapper>
      <Title>비밀번호 재확인</Title>
      <InputWrapper>
        <InputLabel>이메일</InputLabel>
        <Input type="text" placeholder="example@ajou.ac.kr" value={email} readOnly />
      </InputWrapper>
      <InputWrapper>
        <LabelWrapper>
          <InputLabel>비밀번호</InputLabel>
          {passwordError && <PasswordError>{passwordError}</PasswordError>}
        </LabelWrapper>
        <PasswordWrapper>
          <Input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TogglePasswordVisibility onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {isPasswordVisible ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </TogglePasswordVisibility>
        </PasswordWrapper>
      </InputWrapper>

      <Button onClick={handleSignIn}>다음</Button>
    </PasswordConfirmContainer>
  );
};

export default PasswordConfirmation;
