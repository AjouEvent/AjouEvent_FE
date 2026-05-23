import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { register, checkDuplicateEmail, requestEmailVerification, verifyEmailCode } from '../services/api/user';

const passwordRegEx = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%+\^&()\+=\-~`*]).{8,24}$/;

const inputClass = 'w-full h-10 pl-2.5 text-sm border border-[#cdcdcd] rounded-[5px] outline-none';
const btnClass = (disabled) =>
  `w-1/4 bg-[#0066b3] rounded-[10px] text-white font-semibold border-none h-10 text-[0.8em] whitespace-nowrap transition-opacity ${
    disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
  }`;

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidityError, setPasswordValidityError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const [isFormValid, setIsFormValid] = useState(false);
  const [number, setNumber] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isMajorValid, setIsMajorValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailRequestLoading, setEmailRequestLoading] = useState(false);
  const [email, setEmail] = useState('');
  const emailPattern = /^[^\s@]+@ajou\.ac\.kr$/;

  useEffect(() => {
    setIsFormValid(!!(isNameValid && isMajorValid && password && password === confirmPassword && !passwordValidityError && emailCheck));
  }, [isNameValid, isMajorValid, password, confirmPassword, passwordValidityError, emailCheck]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!emailPattern.test(e.target.value) ? '* @ajou.ac.kr 이메일을 입력해주세요.' : '');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordRegEx.test(e.target.value)) setPasswordValidityError('* 비밀번호는 영문, 숫자, 특수문자를 혼합하여 8~24자로 입력해야 합니다.');
    else setPasswordValidityError('');
    if (confirmPassword && e.target.value !== confirmPassword) setPasswordError('* 비밀번호가 일치하지 않습니다.');
    else setPasswordError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) setPasswordError('* 비밀번호가 일치하지 않습니다.');
    else setPasswordError('');
  };

  const validateForm = (name, major, email, password, confirmPassword) => {
    const errors = {};
    if (!name) errors.name = '* 이름을 입력해주세요.';
    if (!major) errors.major = '* 학과를 입력해주세요.';
    if (!email || !emailPattern.test(email)) errors.email = '* @ajou.ac.kr 이메일을 입력해주세요.';
    if (!password) errors.password = '* 비밀번호를 입력해주세요.';
    else if (!passwordRegEx.test(password)) setPasswordValidityError('* 비밀번호는 영문, 숫자, 특수문자를 혼합하여 8~24자로 입력해야 합니다.');
    else setPasswordValidityError('');
    if (password !== confirmPassword) setPasswordError('* 비밀번호가 일치하지 않습니다.');
    else setPasswordError('');
    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const major = e.target.elements.major.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const confirmPassword = e.target.elements.confirmPassword.value;
    const errors = validateForm(name, major, email, password, confirmPassword);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      await register({ name, major, email, password });
      Swal.fire({ icon: 'success', title: '회원가입 성공', text: '회원가입이 완료되었습니다.' });
      navigate('/login');
    } catch (error) {
      Swal.fire({ icon: 'error', title: '회원가입 실패', text: error.response ? '응답 에러' : error.request ? '응답 없음' : '요청 설정 에러' });
    }
  };

  const emailRequest = async (email) => {
    try {
      setEmailRequestLoading(true);
      const response = await checkDuplicateEmail(email);
      if (!response.data) {
        Swal.fire({ icon: 'error', title: '이메일 중복', text: '이미 존재하는 이메일입니다.' });
        setEmailRequestLoading(false);
      } else {
        setEmailRequested(true);
        try {
          await requestEmailVerification(email);
          Swal.fire({ icon: 'success', title: '인증번호 전송', text: '인증번호 전송이 완료되었습니다.' });
        } catch (error) {
          Swal.fire({ icon: 'error', title: '인증번호 전송', text: '인증번호 전송 실패' });
          setEmailRequestLoading(false);
        } finally { setEmailRequestLoading(false); }
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: '이메일 중복 확인 실패', text: '요청 설정 에러' });
    }
  };

  const handleEmailCheck = async (email, e) => {
    e.preventDefault();
    try {
      await verifyEmailCode(email, number);
      Swal.fire({ icon: 'success', title: '이메일 인증 완료', text: '이메일 인증이 완료되었습니다.' });
      setEmailCheck(true);
    } catch (e) {
      Swal.fire({ icon: 'error', title: '이메일 인증 실패', text: '이메일 인증 실패' });
    }
  };

  return (
    <div className="z-10 flex pt-[3%] flex-col items-center h-screen w-[80%]">
      <div className="w-full flex items-center py-4 gap-2">
        <img
          onClick={() => navigate('/signUp/select')}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
          alt="뒤로가기"
          className="w-5 aspect-square object-contain cursor-pointer"
        />
        <div className="text-black text-lg font-bold">회원가입</div>
      </div>
      <div className="w-full max-w-[680px]">
        <h1 className="text-[36px] font-[100] tracking-[-3px] text-left m-0 text-black">가입하기</h1>
      </div>
      <div className="block my-2.5 w-[95%] max-w-[680px] h-[10px] relative">
        <span className="absolute top-2 left-0 right-0 h-px bg-black/20" />
      </div>

      <form onSubmit={handleSignUp} className="w-full mx-2.5 flex flex-col justify-center items-center gap-2.5">
        {/* 이름 */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">이름</p>
            {formErrors.name && <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{formErrors.name}</div>}
          </div>
          <input type="text" placeholder="이름" id="name" name="name" onChange={(e) => setIsNameValid(e.target.value.length > 0)} className={inputClass} />
        </div>

        {/* 학과 */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">학과</p>
            {formErrors.major && <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{formErrors.major}</div>}
          </div>
          <input type="text" placeholder="학과" id="major" name="major" onChange={(e) => setIsMajorValid(e.target.value.length > 0)} className={inputClass} />
        </div>

        {/* 이메일 */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">이메일</p>
            {emailError && <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{emailError}</div>}
          </div>
          <div className="flex items-center gap-2.5">
            <input type="email" placeholder="example@ajou.ac.kr" id="email" name="email" onChange={handleEmailChange} className={inputClass + ' flex-1'} />
            {emailRequestLoading ? (
              <div className="w-[20%] flex justify-center items-center">
                <img src="Spinner.gif" alt="loading" className="w-1/2 h-1/2" />
              </div>
            ) : (
              <button type="button" onClick={() => emailRequest(email)} disabled={!emailPattern.test(email) || emailCheck} className={btnClass(!emailPattern.test(email) || emailCheck)}>
                {emailRequested ? '재요청' : '인증 요청'}
              </button>
            )}
          </div>
        </div>

        {/* 인증번호 */}
        {emailRequested && (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between w-full">
              <p className="m-0 text-sm font-semibold whitespace-nowrap">인증번호</p>
              {formErrors.email && <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{formErrors.email}</div>}
            </div>
            <div className="flex flex-row justify-between items-center gap-1 text-xs">
              <input type="text" placeholder="인증번호" id="number" name="number" onChange={(e) => setNumber(e.target.value)} className={inputClass + ' flex-1'} />
              {emailCheck ? (
                <div>인증 완료</div>
              ) : (
                <button type="button" disabled={!emailRequested || number.length !== 6} onClick={(e) => handleEmailCheck(email, e)} className={btnClass(!emailRequested || number.length !== 6)}>
                  인증 확인
                </button>
              )}
            </div>
          </div>
        )}

        {/* 비밀번호 */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">비밀번호</p>
            {(!password && formErrors.password)
              ? <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{formErrors.password}</div>
              : passwordValidityError && <div className="text-red-500 pl-2.5 text-[0.8em] min-h-5">{passwordValidityError}</div>
            }
          </div>
          <div className="flex items-center gap-1.5 relative">
            <input type={isPasswordVisible ? 'text' : 'password'} name="password" placeholder="영어, 숫자, 특수문자를 포함 8~24자" id="password" autoComplete="off" onChange={handlePasswordChange} className={inputClass} />
            <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="flex items-center justify-center min-w-5 cursor-pointer">
              <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} className="opacity-50" />
            </span>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">비밀번호 확인</p>
            {passwordError && <div className="text-red-500 pl-5 text-[0.8em]">{passwordError}</div>}
          </div>
          <div className="flex items-center gap-1.5 relative">
            <input type={isPasswordVisible ? 'text' : 'password'} placeholder="비밀번호 확인" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className={inputClass} />
            <span onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="flex items-center justify-center min-w-5 cursor-pointer">
              <FontAwesomeIcon icon={isConfirmPasswordVisible ? faEye : faEyeSlash} className="opacity-50" />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`bg-[#0066b3] text-white block w-full max-w-[680px] h-12 rounded-[10px] my-1.5 border-none font-bold text-sm px-1 transition-opacity ${
            !isFormValid ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:opacity-80'
          }`}
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignUp;
