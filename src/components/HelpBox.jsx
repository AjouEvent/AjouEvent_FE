import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const StickyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 0;
  top: 0;
  gap: 6px;
  z-index: 100;
  padding: 10px;
`;

const TapIconContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TapIcon = styled.img`
  aspect-ratio: 1;
  width: 40px;
  object-fit: cover;
  object-position: center;
  opacity: 0.75;
  cursor: pointer;
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  font-size: 8px;
  font-weight: bold;
  padding: 4px 6px;
  border-radius: 99%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Pretendard Variable, sans-serif';
`;

const TapText = styled.span`
  display: flex;
  cursor: pointer;
  font-family: 'Pretendard Variable', serif;
  background-color: #4784be;
  color: white;
  font-weight: 600;
  height: 40px;
  align-items: center;
  text-align: center;
  padding: 0 16px;
  border-radius: 99px;
`;

const HelpBox = () => {
  const navigate = useNavigate();
  const { unreadNotificationCount, fetchUnreadNotificationCount } = useStore();

  useEffect(() => {
    fetchUnreadNotificationCount(); // 처음 마운트될 때 최신 알림 개수 가져오기
  }, []);

  const handleBellClick = () => {
    navigate('/notification');
  };

  const handleInstallClicked = () => {
    window.location.href = 'https://frill-cactus-d3c.notion.site/?pvs=74';
  };

  const handleTeamInfoClicked = () => {
    window.location.href =
      'https://frill-cactus-d3c.notion.site/ajouevent-com-1078a120218e80f78847e9b9b8cd330a?pvs=74';
  };

  return (
    <StickyContainer>
      <TapIconContainer onClick={handleBellClick}>
        <TapIcon
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/notiOn.svg`}
          alt="bellIcon"
        />
        {unreadNotificationCount > 0 &&
          (unreadNotificationCount < 100 ? (
            <Badge>{unreadNotificationCount}</Badge>
          ) : (
            <Badge>99+</Badge>
          ))}
      </TapIconContainer>

      <TapIcon
        onClick={handleInstallClicked}
        loading="lazy"
        src={`${process.env.PUBLIC_URL}/icons/InstallAppOn.svg`}
        alt="installIcon"
      />

      <TapText onClick={handleTeamInfoClicked}>팀소개</TapText>
    </StickyContainer>
  );
};

export default HelpBox;
