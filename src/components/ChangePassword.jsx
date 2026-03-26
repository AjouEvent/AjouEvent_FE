import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import useUIStore from '../store/useUIStore';
import { Z_INDEX, COLORS } from '../constant/appConstants';

const Title = styled.h2`
  padding-top: 5%;
  font-size: 1.5em;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;

  span {
    color: #1a73e8;
    font-weight: bold;
  }
`;

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

const Form = styled.form`
  width: 105%;
  margin: 10px auto 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  p {
    font-size: 14px;
    margin: 0.3rem 0 0.1rem 0.5rem;
    font-weight: 600;
  }
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

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    cursor: pointer;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 680px;
  background: rgb(0, 102, 179);
  border-radius: 10px;
  color: white;
  font-weight: 700;
  border: none;
  height: 3rem;
  font-size: 16px;
  outline: none;
  text-align: center;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 0.5rem;
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
  min-height: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  position: relative;
  gap: 5px;
  width: 100%;
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
  flex-grow: 1;
  white-space: nowrap;
`;

const PasswordError = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  color: red;
  padding-left: 20px;
  font-size: 0.8em;
`;

const ChangePasswordPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidityError, setPasswordValidityError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { isAuthorized } = useUIStore((state) => ({
    isAuthorized: state.isAuthorized,
  }));

  useEffect(() => {
    if (!isAuthorized) {
      Swal.fire({
        icon: 'warning',
        title: '이메일 인증을 먼저 진행해 주세요',
        text: '이메일 인증 창으로 이동합니다.',
      });
      navigate('/findPassword');
    }
  }, [isAuthorized, navigate]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const email = state?.email;

  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%+\^&()\+=\-~`*]).{8,24}$/;

  const validateForm = (password, confirmPassword) => {
    const errors = {};
    if (!password) {
      errors.password = '* 비밀번호를 입력해주세요.';
    } else if (!passwordRegEx.test(password)) {
      setPasswordValidityError(
        '* 비밀번호는 영문, 숫자, 특수문자를 혼합하여 8~24자로 입력해야 합니다.',
      );
    } else {
      setPasswordValidityError('');
    }

    if (password !== confirmPassword) {
      setPasswordError('* 비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError('');
    }

    if (
      password &&
      confirmPassword &&
      password === confirmPassword &&
      passwordRegEx.test(password)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }

    return errors;
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    validateForm(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validateForm(newPassword, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorized) {
      Swal.fire({
        icon: 'warning',
        title: '이메일 인증을 먼저 진행해 주세요',
        text: '이메일 인증 창으로 이동합니다.',
      });
      navigate('/findPassword');
      return;
    }
    const errors = validateForm(newPassword, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_BE_URL}/api/users/reset-password`,
        {
          email,
          newPassword,
        },
      );
      Swal.fire({
        icon: 'success',
        title: '비밀번호 재설정 성공',
        text: '비밀번호가 성공적으로 변경되었습니다.',
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '비밀번호 재설정 실패',
        text: '비밀번호 재설정에 실패했습니다.',
      });
    }
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>
      <Subtitle>
        아이디 <span>{email}</span>의 <br />새 비밀번호를 등록해주세요
      </Subtitle>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <LabelWrapper>
            <InputLabel>새 비밀번호</InputLabel>
            {!newPassword && formErrors.password ? (
              <Error>{formErrors.password}</Error>
            ) : (
              passwordValidityError && <Error>{passwordValidityError}</Error>
            )}
          </LabelWrapper>
          <InputField>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="newPassword"
              placeholder="8~24자 / 영문, 숫자, 특수문자 혼합"
              id="newPassword"
              autoComplete="off"
              onChange={handlePasswordChange}
            />
            <span onClick={togglePasswordVisibility}>
              <FontAwesomeIcon
                icon={isPasswordVisible ? faEye : faEyeSlash}
                style={{
                  opacity: '0.5',
                }}
              />
            </span>
          </InputField>
        </InputWrapper>

        <InputWrapper>
          <LabelWrapper>
            <InputLabel>새 비밀번호 확인</InputLabel>
            {passwordError && <PasswordError>{passwordError}</PasswordError>}
          </LabelWrapper>
          <InputField>
            <input
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              className="input"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <span onClick={toggleConfirmPasswordVisibility}>
              <FontAwesomeIcon
                icon={isConfirmPasswordVisible ? faEye : faEyeSlash}
                style={{
                  opacity: '0.5',
                }}
              />
            </span>
          </InputField>
        </InputWrapper>
        <Button type="submit" disabled={!isFormValid}>
          비밀번호 재설정
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePasswordPage;