import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Z_INDEX, COLORS } from '../constant/appConstants';

const Container = styled.div`
  z-index: ${Z_INDEX.PAGE};
  display: flex;
  padding-top: 3%;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 80%;
  background-color: transparent;
  font-family: "Pretendard Variable";
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

const Form = styled.form`
  width: 100%;
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

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    cursor: pointer;
  }
`;

const EmailInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; // 이메일 입력과 버튼 사이의 간격
`;

const Separator = styled.div`
  display: block;
  margin: 10px auto 10px;
  text-align: center;
  height: 10px;
  position: relative;
  background: transparent;
  color: rgba(255, 255, 255);
  width: 95%;
  max-width: 680px;

  &::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 0;
    background: ${COLORS.OVERLAY_GARY};
    height: 1px;
    width: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    top: 8px;
    right: 0;
    background: ${COLORS.OVERLAY_GARY};
    height: 1px;
    width: 50%;
  }
`;

const Error = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  color: red;
  padding-left: 10px;
  font-size: 0.8em;
  min-height: 20px; /* 최소 높이를 설정하여 화면 내려가는 현상을 줄임 */
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
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

const VerificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-family: "Pretendard Variable";
`;

const SignUpButton = styled.button`
  background: rgb(0, 102, 179);
  color: white;
  display: block;
  width: 100%;
  max-width: 680px;
  height: 3rem;
  border-radius: 10px;
  margin: 6px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  font-family: "Pretendard Variable";
  padding: 0 4px;
  opacity: ${(props) =>
    props.disabled ? 0.5 : 1}; /* 비활성화 시 투명도 조정 */
  pointer-events: ${(props) =>
    props.disabled ? "none" : "auto"}; /* 비활성화 시 클릭 금지 */

  &:hover {
    box-shadow: 0 0 0 rgba(233, 30, 99, 0);
  }
`;

// 새로운 스타일 컴포넌트 (드롭다운 스타일)
const Dropdown = styled.select`
  width: 100%;
  height: 2.5rem;
  border-radius: 10px;
  border: solid 1px ${COLORS.BORDER_GARY};
  font-size: 14px;
  padding-left: 10px;
  background-color: white;
  font-family: "Pretendard Variable";
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

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%+\^&()\+=\-~`*]).{8,24}$/;

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 확인 에러 메시지
  const [passwordValidityError, setPasswordValidityError] = useState(""); // 비밀번호 유효성 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 형식 에러 메시지
  const navigate = useNavigate();

  const [isFormValid, setIsFormValid] = useState(false);
  const [number, setNumber] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const [isMajorValid, setIsMajorValid] = useState(false);
  const [password, setPassword] = useState(""); // 비밀번호 상태 저장
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태 저장
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailRequestLoading, setEmailRequestLoading] = useState(false);
  const [email, setEmail] = useState("");
  const emailPattern = /^[^\s@]+@ajou\.ac\.kr$/;

  useEffect(() => {
    if (
      isNameValid &&
      isMajorValid &&
      password &&
      password === confirmPassword &&
      !passwordValidityError &&
      emailCheck
    ) {
      setIsFormValid(true); // 모든 조건이 만족될 때만 버튼을 활성화
    } else {
      setIsFormValid(false); // 그렇지 않으면 비활성화
    }
  }, [
    isNameValid,
    isMajorValid,
    password,
    confirmPassword,
    passwordValidityError,
    emailCheck,
  ]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setIsNameValid(value.length > 0);
  };

  const handleMajorChange = (e) => {
    const value = e.target.value;
    setIsMajorValid(value.length > 0);
  };

  const validateForm = (name, major, email, password, confirmPassword) => {
    const errors = {};
    if (!name) errors.name = "* 이름을 입력해주세요.";
    if (!major) errors.major = "* 학과를 입력해주세요.";
    if (!email) {
      errors.email = "* @ajou.ac.kr 이메일을 입력해주세요.";
    } else if (!emailPattern.test(email)) {
      errors.email = "* @ajou.ac.kr 이메일 형식에 맞지 않습니다.";
    }
    if (!password) {
      errors.password = "* 비밀번호를 입력해주세요.";
    } else if (!passwordRegEx.test(password)) {
      setPasswordValidityError(
        "* 비밀번호는 영문, 숫자, 특수문자를 혼합하여 8~24자로 입력해야 합니다."
      ); // 회원가입 폼에서 가입하기 버튼 클릭시
    } else {
      setPasswordValidityError(""); // 유효성 검사가 통과되면 에러 메시지를 지웁니다.
    }

    if (password !== confirmPassword) {
      setPasswordError("* 비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError(""); // 실시간 업데이트로 일치하는 경우 에러 메시지 제거
    }

    // if (!phone) errors.phone = "* 전화번호를 입력해주세요.";
    return errors;
  };

  // 이메일 입력값 실시간 유효성 검사 핸들러
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // 이메일 형식 검사
    if (!emailPattern.test(inputEmail)) {
      setEmailError("* @ajou.ac.kr 이메일을 입력해주세요."); // 오류 메시지를 수정
    } else {
      setEmailError("");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  // 비밀번호 및 확인 입력 시 실시간으로 일치 여부 체크
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordRegEx.test(e.target.value)) {
      setPasswordValidityError(
        "* 비밀번호는 영문, 숫자, 특수문자를 혼합하여 8~24자로 입력해야 합니다."
      ); // 사용자가 비밀번호를 입력할 때마다 실시간으로
    } else {
      setPasswordValidityError("");
    }

    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("* 비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError(""); // 일치하면 에러 메시지 제거
    }
  };

  // 비밀번호 확인 입력 시 실시간으로 비밀번호 일치 여부 체크
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setPasswordError("* 비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError(""); // 일치하면 에러 메시지 제거
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const name = e.target.elements.name.value;
    const major = e.target.elements.major.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const confirmPassword = e.target.elements.confirmPassword.value;
    // const phone = e.target.elements.phone.value;

    const errors = validateForm(name, major, email, password, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BE_URL}/api/users/register`, {
        name,
        major,
        email,
        password,
        // phone,
      });

      Swal.fire({
        icon: "success",
        title: "회원가입 성공",
        text: "회원가입이 완료되었습니다.",
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("응답 에러:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "응답 에러",
        });
      } else if (error.request) {
        console.error("응답 없음:", error.request);
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "응답 없음",
        });
      } else {
        console.error("요청 설정 에러:", error.message);
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "요청 설정 에러",
        });
      }
    }
  };

  const emailRequest = async (email) => {
    try {
      setEmailRequestLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BE_URL}/api/users/duplicateEmail?email=${email}`
      );
      const duplicateCheck = response.data;

      if (!duplicateCheck) {
        Swal.fire({
          icon: "error",
          title: "이메일 중복",
          text: "이미 존재하는 이메일입니다.",
        });
        setEmailRequestLoading(false);
      } else {
        setEmailRequested(true);

        try {
          await axios.post(
            `${process.env.REACT_APP_BE_URL}/api/users/emailCheckRequest?email=${email}`
          );

          Swal.fire({
            icon: "success",
            title: "인증번호 전송",
            text: "인증번호 전송이 완료되었습니다.",
          });
        } catch (error) {
          console.error("Error fetching events:", error);
          Swal.fire({
            icon: "error",
            title: "인증번호 전송",
            text: "인증번호 전송 실패",
          });

          setEmailRequestLoading(false);
        } finally {
          setEmailRequestLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire({
        icon: "error",
        title: "이메일 중복 확인 실패",
        text: "요청 설정 에러",
      });
    }
  };

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
    console.log(
      "emailRequested:" + emailRequested + "number.length" + number.length
    );
  };

  const handleEmailCheck = async (email, e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BE_URL}/api/users/emailCheck?email=${email}&code=${number}`
      );

      Swal.fire({
        icon: "success",
        title: "이메일 인증 완료",
        text: "이메일 인증이 완료되었습니다.",
      });
      setEmailCheck(true);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "이메일 인증 실패",
        text: "이메일 인증 실패",
      });
    }
  };

  const arrowBackClicked = () => {
    navigate("/signUp/select");
  };

  return (
    <>
      <Container>
        <TapWrapper>
        <TapIcon
          onClick={arrowBackClicked}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
        />
        <TapTitle>회원가입</TapTitle>
        </TapWrapper>
        <HeadingWapper>
          <Heading>가입하기</Heading>
        </HeadingWapper>
        <Separator />
        <Form onSubmit={handleSignUp}>
          <InputWrapper>
            <LabelWrapper>
              <InputLabel>이름</InputLabel>
              {formErrors.name && <Error>{formErrors.name}</Error>}
            </LabelWrapper>
            <InputField>
              <input
                type="text"
                placeholder="이름"
                className="input"
                id="name"
                name="name"
                onChange={handleNameChange}
              />
            </InputField>
          </InputWrapper>

          <InputWrapper>
            <LabelWrapper>
              <InputLabel>학과</InputLabel>
              {formErrors.major && <Error>{formErrors.major}</Error>}
            </LabelWrapper>
            <InputField>
              <input
                type="text"
                placeholder="학과"
                className="input"
                id="major"
                name="major"
                onChange={handleMajorChange}
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
                <Button
                  type="button"
                  onClick={() => emailRequest(email)}
                  disabled={!emailPattern.test(email) || emailCheck}
                >
                  {emailRequested ? "재요청" : "인증\n요청"}
                </Button>
              )}
            </EmailInputWrapper>
          </InputWrapper>

          {emailRequested && (
            <InputWrapper>
              <LabelWrapper>
                <InputLabel>인증번호</InputLabel>
                {formErrors.email && <Error>{formErrors.email}</Error>}
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
                  <div>
                    인증 <br /> 완료
                  </div>
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

          <InputWrapper>
            <LabelWrapper>
              <InputLabel>비밀번호</InputLabel>
              {!password && formErrors.password ? (
                <Error>{formErrors.password}</Error>
              ) : (
                passwordValidityError && <Error>{passwordValidityError}</Error>
              )}
            </LabelWrapper>
            <InputField>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="영어, 숫자, 특수문자를 포함 8~24자"
                id="password"
                autoComplete="off"
                onChange={handlePasswordChange}
              />
              <span onClick={togglePasswordVisibility}>
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                  style={{
                    opacity: "0.5",
                  }}
                />
              </span>
            </InputField>
          </InputWrapper>

          <InputWrapper>
            <LabelWrapper>
              <InputLabel>비밀번호 확인</InputLabel>
              {passwordError && <PasswordError>{passwordError}</PasswordError>}
            </LabelWrapper>
            <InputField>
              <input
                type={isPasswordVisible ? "text" : "password"}
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
                    opacity: "0.5",
                  }}
                />
              </span>
            </InputField>
          </InputWrapper>
          <SignUpButton type="submit" disabled={!isFormValid}>
            가입하기
          </SignUpButton>
        </Form>
      </Container>
    </>
  );
};

export default SignUp;
