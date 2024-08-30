import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  margin: 60% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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
  background-color: #2366af;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #1a4f8b;
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
      localStorage.setItem("modalDismissedUntil", tomorrow.toISOString());
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