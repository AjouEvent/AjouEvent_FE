import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Z_INDEX, COLORS } from '../constant/appConstants';

const Container = styled.div`
    z-index: ${Z_INDEX.PAGE};
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    height: 100vh;
    width: 100%;
    background-color: #f8f8f8;
    font-family: "Pretendard Variable";
    padding: 20px;
`;

const Heading = styled.h1`
    color: ${COLORS.BLACK};
    font-size: 24px;
    font-weight: 700;
    text-align: left;
    width: 100%;
    max-width: 680px;
    margin-bottom: 20px;
`;

const Description = styled.p`
    color: #999999;
    font-size: 14px;
    margin: 0 0 20px 0;
    max-width: 680px;
    width: 100%;
`;

const Form = styled.form`
    width: 100%;
    max-width: 680px; /* Optional: limit the width of the form */
    display: flex;
    flex-direction: column;
    align-items: center; /* Center align the form contents */
    gap: 10px;
`;

const Line = styled.hr`
    width: 100%;
    height: 1px;
    margin: 0;
`

const CheckboxBlock = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;

    input[type="checkbox"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border: 1px solid ${COLORS.BORDER_GARY};
        border-radius: 50%; /* Make it round */
        outline: none;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
        position: relative;
    }

    /* Style the checked state */
    input[type="checkbox"]:checked {
        background-color: rgb(1, 92, 200);
        border-color: rgb(1, 92, 200);
    }

    /* Add the checkmark */
    input[type="checkbox"]:checked::after {
        content: "";
        display: block;
        width: 6px;
        height: 13px;
        border: solid white;
        border-width: 0 2.5px 2.5px 0;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
    }

    label {
    display: flex;
    align-items: center; /* 수직 정렬 */
    width: 100%;
  }

  span {
    margin-left: auto; /* 오른쪽 정렬 */
    color: ${COLORS.BORDER_GARY}; /* 연한 회색 */
    cursor: pointer; /* 클릭 가능하게 */
  }
`;

const SelectAllBlock = styled.div`
    display: flex;
    align-items: center;
    width: 100%;

    input {
        width: 18px;
        height: 18px;
    }

    label {
        font-size: 16px;
        font-weight: 700;
        color: ${COLORS.DARK_GRAY_TEXT};
        margin-left: 10px;
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
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    margin-top: 0.5rem;
    &:hover {
        opacity: ${(props) => (props.disabled ? 1 : 0.8)};
    }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: ${Z_INDEX.MODAL};
  max-width: 500px;
  width: 90%;
  max-height: 80vh; /* 모달의 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 세로 스크롤 활성화 */
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX.OVERLAY_BACKDROP};
`;

const PrivacyAgreement = () => {
  const [isChecked14, setIsChecked14] = useState(false);
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedPrivacy, setIsCheckedPrivacy] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [currentSetter, setCurrentSetter] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (setter) => {
    return (e) => {
      setter(e.target.checked);
    };
  };

  useEffect(() => {
    if (isChecked14 && isCheckedTerms && isCheckedPrivacy) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
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
      navigate("/signUp/select");
    } else {
      Swal.fire({
        icon: "warning",
        title: "동의 필요",
        text: "모든 필수 항목에 동의해 주세요.",
      });
    }
  };

  // Fetch HTML file content and open the modal
  const openModal = async (e, filePath, setter) => {
    e.preventDefault();
    try {
      const response = await fetch(filePath);
      const content = await response.text();
      setModalContent(content);
      setCurrentSetter(() => setter);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading policy:", error);
      Swal.fire({
        icon: "error",
        title: "문서 로드 오류",
        text: "약관을 불러오는데 문제가 발생했습니다.",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    if (currentSetter) {
      currentSetter(true);
    }
    closeModal();
  };

  return (
    <Container>
      <Heading>AjouEvent 서비스 이용 약관에 <br></br>동의해주세요</Heading>
      <Description>
        * AjouEvent는 2024-1학기 아주대학교 파란학기제로 진행한 프로젝트로 아주대학교 공식 서비스가 아닙니다. <br />
        * AjouEvent 계정은 아주대학교 포탈 계정과 무관합니다.
      </Description>
      <Form onSubmit={handleFormSubmit}>
        <SelectAllBlock>
          <input
            type="checkbox"
            id="select-all"
            checked={isSelectAll}
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">약관 전체 동의하기</label>
        </SelectAllBlock>
        <Line />
        <CheckboxBlock>
          <input
            type="checkbox"
            id="age-agreement"
            checked={isChecked14}
            onChange={handleCheckboxChange(setIsChecked14)}
          />
          <label htmlFor="age-agreement">(필수) 만 14세 이상입니다.</label>
        </CheckboxBlock>
        <CheckboxBlock>
          <input
            type="checkbox"
            id="terms-agreement"
            checked={isCheckedTerms}
            onChange={handleCheckboxChange(setIsCheckedTerms)}
          />
          <label htmlFor="terms-agreement">
            (필수) 서비스 이용약관에 동의{" "}
            <span onClick={(e) => openModal(e, "/terms_of_service.html", setIsCheckedTerms)}>보기</span>
          </label>
        </CheckboxBlock>
        <CheckboxBlock>
          <input
            type="checkbox"
            id="privacy-agreement"
            checked={isCheckedPrivacy}
            onChange={handleCheckboxChange(setIsCheckedPrivacy)}
          />
          <label htmlFor="privacy-agreement">
            (필수) 개인정보 수집이용에 동의{" "}
            <span onClick={(e) => openModal(e, "/privacy_consent_form.html", setIsCheckedPrivacy)}>보기</span>
          </label>
        </CheckboxBlock>
        <Button type="submit" disabled={!isChecked14 || !isCheckedTerms || !isCheckedPrivacy}>
          다음
        </Button>
      </Form>
      {isModalOpen && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
            <h2></h2>
            {/* Render HTML content in the modal */}
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            <Button onClick={handleModalConfirm}>확인</Button>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default PrivacyAgreement;