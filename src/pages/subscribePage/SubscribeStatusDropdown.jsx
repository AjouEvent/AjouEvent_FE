import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import Swal from 'sweetalert2';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  padding: 6px 12px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
`;

// 떨림 애니메이션 추가
const ring = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
  100% { transform: rotate(0); }
`;

const BellIcon = styled.img`
  width: 25px;  
  height: 25px; 
  filter: ${({ isActive }) =>
    isActive
      ? 'invert(29%) sepia(97%) saturate(937%) hue-rotate(187deg) brightness(91%) contrast(90%)'
      : 'none'};
  animation: ${({ ringing }) => (ringing ? ring : 'none')} 1s ease-in-out;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  list-style: none;
  padding: 6px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 130px;
  z-index: 100;
`;

const MenuItem = styled.li`
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  color: ${(props) => (props.disabled ? '#bbb' : '#000')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  &:hover {
    background-color: ${(props) => (props.disabled ? 'transparent' : '#f0f0f0')};
  }
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;

const Check = styled.span`
  color: #0072ce;
  font-weight: bold;
`;

export default function SubscribeStatusDropdown({ topic, fetchMenuItems, ringing }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = async (option) => {
    if (option === 'unsubscribe') {
      await handleUnsubscribe();
    } else {
      const receiveNotification = option === 'all';
      await updateNotificationPreference(receiveNotification);
    }
    setIsOpen(false);
  };

  const updateNotificationPreference = async (receiveNotification) => {
    try {
      await requestWithAccessToken(
        'post',
        `${process.env.REACT_APP_BE_URL}/api/topic/subscriptions/notification`,
        {
          topic: topic.englishTopic,
          receiveNotification,
        }
      );
      fetchMenuItems();
      Swal.fire('알림 설정 변경 완료', '', 'success');
    } catch (error) {
      Swal.fire('오류', '알림 설정 변경 실패', 'error');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await requestWithAccessToken('post', `${process.env.REACT_APP_BE_URL}/api/topic/unsubscribe`, {
        topic: topic.englishTopic,
      });
      fetchMenuItems();
      Swal.fire('구독 취소 완료', `${topic.koreanTopic} 구독을 취소했습니다.`, 'success');
    } catch (error) {
      Swal.fire('오류', '구독 취소 실패', 'error');
    }
  };

  return (
    <Wrapper>
      <DropdownButton onClick={toggleDropdown}>
        <BellIcon
          src={
            topic.receiveNotification
              ? `${process.env.PUBLIC_URL}/icons/bell_ring.svg`
              : `${process.env.PUBLIC_URL}/icons/bell_off.svg`
          }
          alt="알림 상태 아이콘"
          isActive={topic.receiveNotification}
          ringing={ringing}
        />
        구독중
        <img src={`${process.env.PUBLIC_URL}/icons/arrow_down.svg`} alt="arrow" />
      </DropdownButton>

      {isOpen && (
        <DropdownMenu>
          <MenuItem
            onClick={() => handleOptionChange('all')}
            disabled={topic.receiveNotification === true}
          >
            <MenuItemContent>
              <Icon src={`${process.env.PUBLIC_URL}/icons/bell_ring.svg`} alt="알림 받기" />
              알림 받기
            </MenuItemContent>
            {topic.receiveNotification === true && <Check>✔</Check>}
          </MenuItem>

          <MenuItem
            onClick={() => handleOptionChange('none')}
            disabled={topic.receiveNotification === false}
          >
            <MenuItemContent>
              <Icon src={`${process.env.PUBLIC_URL}/icons/bell_off.svg`} alt="알림 없음" />
              알림 없음
            </MenuItemContent>
            {topic.receiveNotification === false && <Check>✔</Check>}
          </MenuItem>

          <MenuItem onClick={() => handleOptionChange('unsubscribe')}>
            <MenuItemContent>
              <Icon src={`${process.env.PUBLIC_URL}/icons/bell_minus.svg`} alt="구독 취소" />
              구독 취소
            </MenuItemContent>
          </MenuItem>
        </DropdownMenu>
      )}
    </Wrapper>
  );
}