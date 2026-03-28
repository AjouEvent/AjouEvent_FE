import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Z_INDEX, STORAGE_KEYS, COLORS } from '../constants/appConstants';

const ModalWrapper = styled.div`
  position: fixed;
  z-index: ${Z_INDEX.MODAL};
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.OVERLAY_BLACK};
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 20px;
  font-family: "Pretendard Variable";
`;

const CloseButton = styled.button`
  width: 100px;
  background: none;
  border: none;
  font-size: 20px;
  padding: 4px 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  cursor: pointer;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  gap: 20px;
`;

const ModalFooter = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EllipticalLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${COLORS.BLUE_SECONDARY};
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: ${COLORS.BLUE_DARK};
  }
`;

const DailyModal = ({ show, onClose }) => {
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  const handleDoNotShowTodayChange = (e) => {
    setDoNotShowToday(e.target.checked);
  };

  const handleClose = () => {
    if (doNotShowToday) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      localStorage.setItem(STORAGE_KEYS.MODAL_DISMISSED_UNTIL, tomorrow.toISOString());
    }
    onClose();
  };

  return (
    <ModalWrapper>
      <ModalContent>
        <ModalBody>
          <img
            src={`${process.env.PUBLIC_URL}/logo196.png`}
            alt="Modal"
            style={{ width: "50%" }}
          />
          <p>
            홈화면에 앱 추가하고 <br />
            공지사항, 이벤트 알림을 받아보세요.
          </p>
        </ModalBody>
        <EllipticalLink to="/guide">설치없이 앱으로 열기</EllipticalLink>
        <ModalFooter>
          <label>
            <input
              type="checkbox"
              checked={doNotShowToday}
              onChange={handleDoNotShowTodayChange}
              style={{ marginRight: "4px" }}
            />
            오늘은 보지 않기
          </label>
          <CloseButton onClick={handleClose}>닫기</CloseButton>
        </ModalFooter>
      </ModalContent>
    </ModalWrapper>
  );
};

export default DailyModal;