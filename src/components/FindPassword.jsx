import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUIStore from '../store/useUIStore';
import { checkAccountExists, requestEmailVerification, verifyEmailCode } from '../services/api/user';

const inputClass = 'w-full h-10 pl-2.5 text-sm border border-[#cdcdcd] rounded-[5px] outline-none';
const btnClass = (disabled) =>
  `w-1/4 bg-[#0066b3] rounded-[10px] text-white font-semibold border-none h-10 text-[0.8em] cursor-pointer whitespace-nowrap transition-opacity ${
    disabled ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'
  }`;

const FindPassword = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [number, setNumber] = useState('');
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailRequestLoading, setEmailRequestLoading] = useState(false);
  const { setIsAuthorized } = useUIStore((state) => ({ setIsAuthorized: state.setIsAuthorized }));
  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@ajou\.ac\.kr$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!emailPattern.test(e.target.value) ? '* @ajou.ac.kr 이메일 형식에 맞지 않습니다.' : '');
  };

  const emailRequest = async (email) => {
    try {
      setEmailRequestLoading(true);
      if (!emailPattern.test(email)) { setEmailError('* @ajou.ac.kr 이메일 형식을 확인해주세요.'); return; }
      const response = await checkAccountExists(email, name);
      if (!response.data) {
        Swal.fire({ icon: 'error', title: '회원 정보가 \n일치하지 않습니다.', text: '입력하신 정보를 다시 확인해주세요.' });
        setEmailRequestLoading(false);
      } else {
        setEmailRequested(true);
        try {
          await requestEmailVerification(email);
          Swal.fire({ icon: 'success', title: '인증코드 전송 완료', text: '이메일로 인증코드가 전송되었습니다.' });
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
      setIsAuthorized();
    } catch (e) {
      Swal.fire({ icon: 'error', title: '이메일 인증 실패', text: '이메일 인증 실패' });
    }
  };

  return (
    <div className="z-10 flex pt-[3%] flex-col items-center h-screen w-[80%] font-[Pretendard_Variable]">
      <div className="w-full max-w-[680px]">
        <h1 className="text-[36px] font-[100] tracking-[-3px] text-left m-0 text-black">비밀번호 찾기</h1>
      </div>

      <div className="flex flex-col relative gap-1.5 w-full my-1.5">
        <div className="flex items-center justify-between w-full">
          <p className="m-0 text-sm font-semibold whitespace-nowrap">이름</p>
        </div>
        <div className="flex items-center gap-1.5 relative">
          <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col relative gap-1.5 w-full my-1.5">
        <div className="flex items-center justify-between w-full">
          <p className="m-0 text-sm font-semibold whitespace-nowrap">이메일</p>
          {emailError && <div className="text-red-500 pl-2.5 text-[0.8em]">{emailError}</div>}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 flex-1">
            <input type="email" placeholder="example@ajou.ac.kr" onChange={handleEmailChange} className={inputClass} />
          </div>
          {emailRequestLoading ? (
            <div className="w-[20%] flex justify-center items-center">
              <img src="Spinner.gif" alt="loading" className="w-1/2 h-1/2" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => emailRequest(email)}
              disabled={!emailPattern.test(email) || emailCheck}
              className={btnClass(!emailPattern.test(email) || emailCheck)}
            >
              {emailRequested ? '재요청' : '인증 요청'}
            </button>
          )}
        </div>
      </div>

      {emailRequested && (
        <div className="flex flex-col relative gap-1.5 w-full my-1.5">
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-sm font-semibold whitespace-nowrap">인증번호</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 flex-1">
              <input type="text" placeholder="인증번호" onChange={(e) => setNumber(e.target.value)} className={inputClass} />
            </div>
            {emailCheck ? (
              <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-2xl" />
            ) : (
              <button
                type="button"
                disabled={!emailRequested || number.length !== 6}
                onClick={(e) => handleEmailCheck(email, e)}
                className={btnClass(!emailRequested || number.length !== 6)}
              >
                인증 확인
              </button>
            )}
          </div>
        </div>
      )}

      {emailCheck && (
        <div className="flex flex-col relative gap-1.5 w-full my-1.5">
          <button
            onClick={() => navigate('/change-password', { state: { email } })}
            className="w-full max-w-[400px] bg-[#0066b3] rounded-[10px] text-white font-semibold border-none h-10 text-[0.8em] cursor-pointer mx-auto my-5 block hover:opacity-80 transition-opacity"
          >
            비밀번호 재설정
          </button>
        </div>
      )}
    </div>
  );
};

export default FindPassword;
