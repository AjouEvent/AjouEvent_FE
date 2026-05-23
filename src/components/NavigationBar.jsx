import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PWAPrompt from 'react-ios-pwa-prompt';
import useSubscriptionStore from '../store/useSubscriptionStore';

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

  const { isSubscribedTabRead, fetchMemberStatus } = useSubscriptionStore();

  const [isIOS, setIsIOS] = useState(false);
  const [shouldShowPWAPrompt, setShouldShowPWAPrompt] = useState(false);

  useEffect(() => {
    const isDeviceIOS =
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
    setIsIOS(isDeviceIOS);
    if (isDeviceIOS) setShouldShowPWAPrompt(true);
  }, []);

  const handleNavItemClick = (link) => {
    navigate(link);
    fetchMemberStatus();
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-[5] w-full bg-white border-t border-black/[0.08] flex justify-center flex-col text-xs font-bold text-center text-[#b8bfc6] pb-5 pt-3">
        <ul className="flex gap-2 list-none p-0 m-0">
          {items.map((item, index) => {
            const isActive = currentPath === item.link;
            return (
              <li
                key={index}
                className={`flex flex-col flex-1 px-3.5 items-center cursor-pointer relative ${
                  isActive ? 'text-[#2366AF]' : 'text-[#b8bfc6]'
                }`}
                onClick={() => handleNavItemClick(item.link)}
              >
                <img
                  src={isActive ? item.srcFilled : item.srcEmpty}
                  alt={item.alt}
                  className={`w-6 aspect-square object-cover ${isActive ? '' : 'grayscale'}`}
                />
                <span className="mt-1">{item.label}</span>
                {item.label === '구독' && isSubscribedTabRead === false && (
                  <div className="absolute top-0 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>

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
