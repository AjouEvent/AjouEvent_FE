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

  const terms = [
    { id: 'age-agreement', checked: isChecked14, setter: setIsChecked14, label: '(필수) 만 14세 이상입니다.', filePath: null },
    { id: 'terms-agreement', checked: isCheckedTerms, setter: setIsCheckedTerms, label: '(필수) 서비스 이용약관에 동의', filePath: '/terms_of_service.html' },
    { id: 'privacy-agreement', checked: isCheckedPrivacy, setter: setIsCheckedPrivacy, label: '(필수) 개인정보 수집이용에 동의', filePath: '/privacy_consent_form.html' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white px-5 pt-10 pb-10">
      <h1 className="text-[#191F28] text-2xl font-bold tracking-tight mb-2">
        AjouEvent 서비스 이용 약관에<br />동의해주세요
      </h1>
      <p className="text-[#B0B8C1] text-xs mb-8 leading-relaxed">
        AjouEvent는 2024-1학기 아주대학교 파란학기제로 진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다.<br />
        AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다.
      </p>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3 py-3 border-b border-[#E5E8EB]">
          <input
            type="checkbox"
            id="select-all"
            checked={isSelectAll}
            onChange={handleSelectAll}
            className="w-5 h-5 accent-[#3182F6] cursor-pointer"
          />
          <label htmlFor="select-all" className="text-[#191F28] text-sm font-bold cursor-pointer">
            약관 전체 동의하기
          </label>
        </div>

        {terms.map(({ id, checked, setter, label, filePath }) => (
          <div key={id} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id={id}
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
              className="w-5 h-5 accent-[#3182F6] cursor-pointer flex-shrink-0"
            />
            <label htmlFor={id} className="flex items-center flex-1 text-sm text-[#333D4B] cursor-pointer">
              {label}
              {filePath && (
                <span
                  onClick={(e) => openModal(e, filePath, setter)}
                  className="ml-auto text-[#3182F6] text-xs cursor-pointer font-medium"
                >
                  보기
                </span>
              )}
            </label>
          </div>
        ))}

        <div className="mt-auto pt-6">
          <button
            type="submit"
            disabled={!isAllChecked}
            className={`w-full rounded-xl text-white font-bold border-none h-14 text-base transition-all ${
              !isAllChecked
                ? 'bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed'
                : 'bg-[#3182F6] hover:bg-[#1B6EE8] cursor-pointer'
            }`}
          >
            다음
          </button>
        </div>
      </form>

      {isModalOpen && (
        <>
          <div onClick={closeModal} className="fixed top-0 left-0 w-full h-full bg-black/50 z-[999]" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-2xl shadow-lg z-[1000] max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto">
            <h2 aria-hidden="true">{' '}</h2>
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            <button
              onClick={handleModalConfirm}
              className="w-full bg-[#3182F6] hover:bg-[#1B6EE8] rounded-xl text-white font-bold border-none h-12 text-base cursor-pointer mt-4 transition-colors"
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
