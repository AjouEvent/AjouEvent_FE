import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUIStore from '../store/useUIStore';
import { Z_INDEX, COLORS } from '../constants/appConstants';
import { checkAccountExists, requestEmailVerification, verifyEmailCode } from '../services/api/user';

const Container = styled.div`
  z-index: ${Z_INDEX.PAGE};
  display: flex;
  padding-top: 3%;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 80%;
  background-color: transparent;
  font-family: 'Pretendard Variable';
`;

const Heading = styled.h1`
  color: ${COLORS.BLACK};
  font-size: 36px;
  font-weight: 100;
  letter-spacing: -3px;
  text-align: left;
  margin: 0;
`;

const HeadingWapper = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 0 auto 0;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 5px;
  width: 100%;
  margin: 5px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const InputLabel = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;

  input {
    width: 100%;
    height: 2.5rem;
    padding-left: 10px;
    font-size: 14px;
    border: 1px solid ${COLORS.BORDER_GARY};
    border-radius: 5px;
  }
`;

const EmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; // 이메일 입력과 버튼 사이의 간격
`;

const Button = styled.button`
  width: 25%;
  background: rgb(0, 102, 179);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  border: none;
  height: 2.5rem;
  letter-spacing: 0.05em;
  outline: none;
  white-space: nowrap;
  font-size: 0.8em;
  text-align: center;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

const RequestButton = styled.button`
  align-items: center;
  width: 25%;
  background: rgb(0, 102, 179);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  border: none;
  height: 2.5rem;
  letter-spacing: 0.05em;
  outline: none;
  white-space: nowrap;
  font-size: 0.8em;
  text-align: center;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

const PasswordResetButton = styled.button`
  width: 100%; // 버튼이 중앙에 위치하도록 너비를 100%로 설정
  max-width: 400px; // 최대 너비 설정
  background: rgb(0, 102, 179);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  border: none;
  height: 2.5rem;
  letter-spacing: 0.05em;
  outline: none;
  white-space: nowrap;
  font-size: 0.8em;
  text-align: center;
  cursor: pointer;
  margin: 20px auto; // 중앙 배치
  display: block; // 중앙 배치를 위한 속성
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

const Error = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  color: red;
  padding-left: 10px;
  font-size: 0.8em;
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

const VerificationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

// 인증 번호 체크 완료 시 사용하는 아이콘 스타일 추가
const CheckIcon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1.5rem;
`;

const FindPassword = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [number, setNumber] = useState('');
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailRequestLoading, setEmailRequestLoading] = useState(false);
  const { setIsAuthorized } = useUIStore((state) => ({
    setIsAuthorized: state.setIsAuthorized,
  }));
  const navigate = useNavigate();

  const emailPattern = /^[^\s@]+@ajou\.ac\.kr$/;

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailPattern.test(e.target.value)) {
      setEmailError('* @ajou.ac.kr 이메일 형식에 맞지 않습니다.');
    } else {
      setEmailError('');
    }
  };

  const emailRequest = async (email) => {
    try {
      setEmailRequestLoading(true);
      if (!emailPattern.test(email)) {
        setEmailError('* @ajou.ac.kr 이메일 형식을 확인해주세요.');
        return;
      }

      const response = await checkAccountExists(email, name);

      const isEmailExists = response.data;

      if (!isEmailExists) {
        Swal.fire({
          icon: 'error',
          title: '회원 정보가 \n일치하지 않습니다.',
          text: '입력하신 정보를 다시 확인해주세요.',
        });
        setEmailRequestLoading(false);
      } else {
        setEmailRequested(true);

        try {
          await requestEmailVerification(email);

          Swal.fire({
            icon: 'success',
            title: '인증코드 전송 완료',
            text: '이메일로 인증코드가 전송되었습니다.',
          });
        } catch (error) {
          console.error('Error fetching events:', error);
          Swal.fire({
            icon: 'error',
            title: '인증번호 전송',
            text: '인증번호 전송 실패',
          });

          setEmailRequestLoading(false);
        } finally {
          setEmailRequestLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Swal.fire({
        icon: 'error',
        title: '이메일 중복 확인 실패',
        text: '요청 설정 에러',
      });
    }
  };

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
    console.log(
      'emailRequested:' + emailRequested + 'number.length' + number.length,
    );
  };

  const handleEmailCheck = async (email, e) => {
    e.preventDefault();
    try {
      await verifyEmailCode(email, number);

      Swal.fire({
        icon: 'success',
        title: '이메일 인증 완료',
        text: '이메일 인증이 완료되었습니다.',
      });
      setEmailCheck(true);
      setIsAuthorized();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: '이메일 인증 실패',
        text: '이메일 인증 실패',
      });
    }
  };

  const handleResetPasswordPage = () => {
    navigate('/change-password', {
      state: {
        email,
      },
    });
  };

  return (
    <Container>
      <HeadingWapper>
        <Heading>비밀번호 찾기</Heading>
      </HeadingWapper>
      <InputWrapper>
        <LabelWrapper>
          <InputLabel>이름</InputLabel>
        </LabelWrapper>
        <InputField>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={handleNameChange}
          />
        </InputField>
      </InputWrapper>

      <InputWrapper>
        <LabelWrapper>
          <InputLabel>이메일</InputLabel>
          {emailError && <Error>{emailError}</Error>}
        </LabelWrapper>
        <EmailInputWrapper>
          <InputField style={{ flex: 1 }}>
            <input
              type="email"
              placeholder="example@ajou.ac.kr"
              className="input"
              id="email"
              name="email"
              onChange={handleEmailChange}
            />
          </InputField>
          {emailRequestLoading ? (
            <LoadingWrapper>
              <LoadingImage src="Spinner.gif" alt="loading" />
            </LoadingWrapper>
          ) : (
            <RequestButton
              type="button"
              onClick={() => emailRequest(email)}
              disabled={!emailPattern.test(email) || emailCheck}
            >
              {emailRequested ? '재요청' : '인증\n요청'}
            </RequestButton>
          )}
        </EmailInputWrapper>
      </InputWrapper>

      {emailRequested && (
        <InputWrapper>
          <LabelWrapper>
            <InputLabel>인증번호</InputLabel>
          </LabelWrapper>
          <VerificationWrapper>
            <InputField style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="인증번호"
                className="input"
                id="number"
                name="number"
                onChange={handleNumberChange}
              />
            </InputField>
            {emailCheck ? (
              <CheckIcon icon={faCheck} />
            ) : (
              <Button
                type="button"
                disabled={!emailRequested || number.length !== 6}
                onClick={(e) => handleEmailCheck(email, e)}
              >
                인증 확인
              </Button>
            )}
          </VerificationWrapper>
        </InputWrapper>
      )}
      {emailCheck && (
        <InputWrapper>
          <PasswordResetButton onClick={handleResetPasswordPage}>
            비밀번호 재설정
          </PasswordResetButton>
        </InputWrapper>
      )}
    </Container>
  );
};

export default FindPassword;