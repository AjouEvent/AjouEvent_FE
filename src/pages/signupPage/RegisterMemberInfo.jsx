import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerInfo } from '../../services/api/user';

const departmentList = [
  '간호학과','건설시스템공학과','건축학과','경영인텔리전스학과','경영학과','경제학과',
  '경제정치사회융합학부','교통시스템공학과','국방디지털융합학과','국어국문학과',
  '글로벌경영학과','금융공학과','기계공학과','디지털미디어학과','문화콘텐츠학과',
  '물리학과','미래모빌리티공학과','불어불문학과','사이버보안학과','사학과','사회학과',
  '산업공학과','생명과학과','소프트웨어학과','수학과','스포츠레저학과','심리학과',
  '약학과','영어영문학과','융합시스템공학과','응용화학과','응용화학생명공학과',
  '의학과','인공지능융합학과','자유전공학부','전자공학과','정치외교학과',
  '지능형반도체공학과','첨단신소재공학과','프런티어과학학부','행정학과','화학공학과',
  '화학과','환경안전공학과',
];

const RegisterMajor = () => {
  const location = useLocation();
  const { email, name } = location.state || {};
  const [major, setMajor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const handleMajorSubmit = async (e) => {
    e.preventDefault();
    if (!major) { setHasError(true); return; }
    try {
      await registerInfo({ major });
      Swal.fire({ icon: 'success', title: '학과 등록 성공', text: '구독 페이지로 이동합니다.' });
      navigate('/subscribe', { state: { showGuide: true } });
    } catch (error) {
      Swal.fire({ icon: 'error', title: '등록 실패', text: '학과 등록 중 문제가 발생했습니다.' });
      console.error(error);
    }
  };

  const handleDepartmentSelect = (selectedMajor) => {
    setMajor(selectedMajor);
    setHasError(false);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-5 pt-10 pb-10">
      <h1 className="text-[#191F28] text-2xl font-bold tracking-tight mb-8">학과 등록</h1>

      <form onSubmit={handleMajorSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#6B7684] text-xs font-semibold">이메일</label>
          <input
            type="email"
            value={email}
            readOnly
            placeholder="이메일"
            required
            className="w-full h-12 px-4 bg-[#F2F4F6] rounded-xl text-sm text-[#B0B8C1] outline-none border-0 cursor-default"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#6B7684] text-xs font-semibold">이름</label>
          <input
            type="text"
            value={name}
            readOnly
            placeholder="이름"
            required
            className="w-full h-12 px-4 bg-[#F2F4F6] rounded-xl text-sm text-[#B0B8C1] outline-none border-0 cursor-default"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[#6B7684] text-xs font-semibold">소속</label>
            {hasError && <span className="text-[#F04452] text-xs">학과를 선택해주세요.</span>}
          </div>
          <div className={`flex items-center gap-2 ${hasError ? 'ring-2 ring-[#F04452] rounded-xl' : ''}`}>
            <input
              type="text"
              value={major}
              placeholder="소속 학과를 선택해주세요"
              disabled
              className="flex-1 h-12 px-4 bg-[#F2F4F6] rounded-xl text-sm text-[#333D4B] outline-none border-0 cursor-default"
            />
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="h-12 px-4 bg-[#3182F6] hover:bg-[#1B6EE8] text-white rounded-xl text-sm font-semibold border-none cursor-pointer transition-colors whitespace-nowrap flex-shrink-0"
            >
              선택하기
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!major}
          className={`w-full h-14 rounded-xl font-bold text-base border-none cursor-pointer transition-all mt-4 ${
            major
              ? 'bg-[#3182F6] hover:bg-[#1B6EE8] text-white cursor-pointer'
              : 'bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed'
          }`}
        >
          등록
        </button>
      </form>

      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-2xl shadow-lg z-[1001] w-[90%] max-w-[600px] h-[80%] overflow-y-auto">
            <h2 className="text-[#191F28] text-lg font-bold m-0 mb-4 tracking-tight">학과 선택</h2>
            {departmentList.map((dept) => (
              <div
                key={dept}
                onClick={() => handleDepartmentSelect(dept)}
                className="flex justify-between items-center py-3 border-b border-[#F2F4F6] text-sm text-[#333D4B] font-medium cursor-pointer hover:bg-[#F9FAFB] transition-colors px-1"
              >
                {dept}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterMajor;
