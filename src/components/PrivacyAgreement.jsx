import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivacyAgreement = () => {
  const [isChecked14, setIsChecked14] = useState(false);
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedPrivacy, setIsCheckedPrivacy] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [currentSetter, setCurrentSetter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSelectAll(!!(isChecked14 && isCheckedTerms && isCheckedPrivacy));
  }, [isChecked14, isCheckedTerms, isCheckedPrivacy]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setIsSelectAll(isChecked);
    setIsChecked14(isChecked);
    setIsCheckedTerms(isChecked);
    setIsCheckedPrivacy(isChecked);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isChecked14 && isCheckedTerms && isCheckedPrivacy) {
      navigate('/signUp/select');
    } else {
      Swal.fire({ icon: 'warning', title: '동의 필요', text: '모든 필수 항목에 동의해 주세요.' });
    }
  };

  const openModal = async (e, filePath, setter) => {
    e.preventDefault();
    try {
      const response = await fetch(filePath);
      const content = await response.text();
      setModalContent(content);
      setCurrentSetter(() => setter);
      setIsModalOpen(true);
    } catch (error) {
      Swal.fire({ icon: 'error', title: '문서 로드 오류', text: '약관을 불러오는데 문제가 발생했습니다.' });
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleModalConfirm = () => {
    if (currentSetter) currentSetter(true);
    closeModal();
  };

  const isAllChecked = isChecked14 && isCheckedTerms && isCheckedPrivacy;

  const checkboxClass = `
    appearance-none w-5 h-5 border border-[#cdcdcd] rounded-full outline-none cursor-pointer transition-colors
    checked:bg-[rgb(1,92,200)] checked:border-[rgb(1,92,200)]
    relative
  `;

  return (
    <div className="z-10 flex flex-col justify-center items-center h-screen w-full bg-[#f8f8f8] p-5">
      <h1 className="text-black text-2xl font-bold text-left w-full max-w-[680px] mb-5">
        AjouEvent 서비스 이용 약관에 <br />동의해주세요
      </h1>
      <p className="text-[#999] text-sm m-0 mb-5 max-w-[680px] w-full">
        * AjouEvent는 2024-1학기 아주대학교 파란학기제로 진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다. <br />
        * AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다.
      </p>
      <form onSubmit={handleFormSubmit} className="w-full max-w-[680px] flex flex-col items-center gap-2.5">
        <div className="flex items-center w-full gap-2.5">
          <input type="checkbox" id="select-all" checked={isSelectAll} onChange={handleSelectAll} className="w-[18px] h-[18px]" />
          <label htmlFor="select-all" className="text-base font-bold text-gray-700 ml-2.5">약관 전체 동의하기</label>
        </div>
        <hr className="w-full h-px m-0" />
        {[
          { id: 'age-agreement', checked: isChecked14, setter: setIsChecked14, label: '(필수) 만 14세 이상입니다.', filePath: null },
          { id: 'terms-agreement', checked: isCheckedTerms, setter: setIsCheckedTerms, label: '(필수) 서비스 이용약관에 동의', filePath: '/terms_of_service.html' },
          { id: 'privacy-agreement', checked: isCheckedPrivacy, setter: setIsCheckedPrivacy, label: '(필수) 개인정보 수집이용에 동의', filePath: '/privacy_consent_form.html' },
        ].map(({ id, checked, setter, label, filePath }) => (
          <div key={id} className="flex items-center gap-2.5 w-full">
            <input
              type="checkbox"
              id={id}
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
              className={checkboxClass}
            />
            <label htmlFor={id} className="flex items-center w-full">
              {label}
              {filePath && (
                <span
                  onClick={(e) => openModal(e, filePath, setter)}
                  className="ml-auto text-[#cdcdcd] cursor-pointer"
                >
                  보기
                </span>
              )}
            </label>
          </div>
        ))}
        <button
          type="submit"
          disabled={!isAllChecked}
          className={`w-full max-w-[680px] bg-[#0066b3] rounded-[10px] text-white font-bold border-none h-12 text-base outline-none text-center mt-2 transition-opacity ${
            !isAllChecked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
          }`}
        >
          다음
        </button>
      </form>

      {isModalOpen && (
        <>
          <div onClick={closeModal} className="fixed top-0 left-0 w-full h-full bg-black/50 z-[999]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] z-[1000] max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto">
            <h2 aria-hidden="true">{' '}</h2>
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            <button
              onClick={handleModalConfirm}
              className="w-full bg-[#0066b3] rounded-[10px] text-white font-bold border-none h-12 text-base cursor-pointer mt-2 hover:opacity-80 transition-opacity"
            >
              확인
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivacyAgreement;
