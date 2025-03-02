import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import PWAPrompt from 'react-ios-pwa-prompt';
import useStore from '../store/useStore';

const NavWrapper = styled.nav`
  z-index: 5;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  flex-direction: column;
  font-size: 12px;
  font-family: 'Pretendard Variable';
  color: #b8bfc6;
  font-weight: 700;
  text-align: center;
  line-height: 150%;
  padding: 12px 0px 20px;
`;

const NavItems = styled.ul`
  display: flex;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 14px;
  align-items: center;
  color: ${(props) => (props.active ? '#2366af' : '#b8bfc6')};
  cursor: pointer;
  position: relative;
`;

const NavIcon = styled.img`
  width: 24px;
  aspect-ratio: 1;
  object-fit: cover;
  filter: ${(props) => (props.active ? 'none' : 'grayscale(100%)')};
`;

const NavLabel = styled.span`
  margin-top: 4px;
  color: inherit;
`;

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
`;

const items = [
  {
    srcFilled: `${process.env.PUBLIC_URL}/icons/home.svg`,
    srcEmpty: `${process.env.PUBLIC_URL}/icons/home_border.svg`,
    label: '홈',
    alt: 'Home',
    link: '/',
  },
  {
    srcFilled: `${process.env.PUBLIC_URL}/icons/search.svg`,
    srcEmpty: `${process.env.PUBLIC_URL}/icons/search_border.svg`,
    label: '검색',
    alt: 'Search',
    link: '/event',
  },
  {
    srcFilled: `${process.env.PUBLIC_URL}/icons/favorite.svg`,
    srcEmpty: `${process.env.PUBLIC_URL}/icons/favorite_border.svg`,
    label: '찜',
    alt: 'Favorites',
    link: '/liked',
  },
  {
    srcFilled: `${process.env.PUBLIC_URL}/icons/subscriptions.svg`,
    srcEmpty: `${process.env.PUBLIC_URL}/icons/subscriptions_border.svg`,
    label: '구독',
    alt: 'Subscription',
    link: '/subscribe',
  },
  {
    srcFilled: `${process.env.PUBLIC_URL}/icons/identity.svg`,
    srcEmpty: `${process.env.PUBLIC_URL}/icons/identity_border.svg`,
    label: '프로필',
    alt: 'Profile',
    link: '/mypage',
  },
];

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // 전역 상태에서 읽음 상태 관리 (서버 변수명 그대로 사용)
  const { isSubscribedTabRead, fetchMemberStatus } = useStore();

  const [isIOS, setIsIOS] = useState(false);
  const [shouldShowPWAPrompt, setShouldShowPWAPrompt] = useState(false);

  useEffect(() => {
    // fetchMemberStatus(); // 페이지 로드 시 사용자 구독 상태 가져오기
    // iOS 장치인지 확인
    const isDeviceIOS =
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
    setIsIOS(isDeviceIOS);

    if (isDeviceIOS) {
      setShouldShowPWAPrompt(true); // iOS 장치일 때 프롬프트 표시
    }
  }, []);

  const handleNavItemClick = (link) => {
    navigate(link);
    fetchMemberStatus();
  };

  return (
    <>
      <NavWrapper>
        <NavItems>
          {items.map((item, index) => {
            const isActive = currentPath === item.link;
            return (
              <NavItem
                key={index}
                active={isActive}
                onClick={() => handleNavItemClick(item.link)}
              >
                <NavIcon
                  src={isActive ? item.srcFilled : item.srcEmpty}
                  alt={item.alt}
                  active={isActive}
                />
                <NavLabel>{item.label}</NavLabel>
                {/* 구독 탭에 뱃지 표시 */}
                {item.label === '구독' && isSubscribedTabRead === false && <Badge />}
              </NavItem>
            );
          })}
        </NavItems>
      </NavWrapper>

      {isIOS && (
        <PWAPrompt
          promptOnVisit={1}
          timesToShow={1}
          copyTitle="AjouEvent 앱 설치하기 - 아이폰"
          copySubtitle="홈 화면에 앱을 추가하고 각종 공지사항, 키워드 알림을 받아보세요."
          copyDescription="AjouEvent는 앱설치 없이 홈화면에 추가를 통해 사용할 수 있습니다."
          copyShareStep="하단 메뉴에서 '공유' 아이콘을 눌러주세요."
          copyAddToHomeScreenStep="아래의 '홈 화면에 추가' 버튼을 눌러주세요."
          appIconPath="https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-symbol.png"
          isShown={shouldShowPWAPrompt}
        />
      )}
    </>
  );
}

export default NavigationBar;
