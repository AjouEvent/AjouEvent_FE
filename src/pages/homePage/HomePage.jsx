import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from '../../components/NavigationBar';
import GetUserPermission from '../../services/fcm/GetUserPermission';
import LocationBar from '../../components/LocationBar';
import HomeBanner from './HomeBanner';
import HomeHotEvent from './HomeHotEvent';
import DailyModal from '../../components/DailyModal';
import HelpBox from '../../components/HelpBox';
import axios from 'axios';
import NotifyModal from '../notificationPage/NotificationPage';

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
`;

const MainContentContainer = styled.div`
  display: flex;
  width: 100vw;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 0 80px 0;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  z-index: 1000;
`;

const InstallPromptContainer = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
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
  font-family: 'Pretendard Variable';
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  gap: 20px;
`;

const InstallButton = styled.button`
  background-color: #0a5ca8;
  color: #fff;
  padding: 15px 50px;
  font-size: 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin: 0 auto;
  width: 80%;
  max-width: 300px;
  display: block;
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

// Style for the push notification prompt
const PushNotificationPromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 전체 화면 높이 */
  width: 100vw; /* 전체 화면 너비 */
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  background-color: #ffffff; /* 흰색 배경 */
  color: #000; /* 검은색 텍스트 (흰색 배경에 잘 보이도록) */
  z-index: 1000; /* 가장 위에 표시되도록 설정 */
  padding: 20px;
  text-align: center;
`;

const PushNotificationPromptButton = styled.button`
  background-color: #0a5ca8;
  color: #fff;
  padding: 15px 50px;
  font-size: 18px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
  width: 80%;
  max-width: 300px;
`;

const LaterOption = styled.div`
  margin-top: 20px;
  color: #808080;
  cursor: pointer;
  font-size: 12px;
  display: block;
  margin: 10px auto;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
`;

const BellIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 45%;
`;

const TitleText = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: -5px;
  text-align: center;
`;

const ParagraphText = styled.p`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 20px;
  text-align: center;
`;

const isKakaoTalkBrowser = () => /KAKAOTALK/i.test(navigator.userAgent);

const openExternalBrowser = (url = window.location.href) => {
    const kakaoUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    window.location.href = kakaoUrl;
};

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // PWA 설치 프롬프트 저장
  const [showInstallPrompt, setShowInstallPrompt] = useState(false); // 설치 프롬프트 표시 여부
  const [isLoading, setIsLoading] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [showPushNotificationPrompt, setShowPushNotificationPrompt] =
    useState(false);

  const navigate = useNavigate(); // useNavigate 훅 사용
  useEffect(() => {
    GetUserPermission(setIsLoading);
  }, []);

  useEffect(() => {
      if (isKakaoTalkBrowser()) {
          openExternalBrowser();
      }
  }, []);

  useEffect(() => {
    const fetchBannerImages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BE_URL}/api/event/banner`,
        );
        setBannerImages(response.data);
      } catch (error) {
        console.error('Error fetching banner images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerImages();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
      const isFirstTimeOpen = localStorage.getItem('isFirstTimeOpen');
      if (!isFirstTimeOpen) {
        setShowPushNotificationPrompt(true);
        localStorage.setItem('isFirstTimeOpen', 'false');
      }
      return;
    }

    const dismissedUntil = localStorage.getItem('modalDismissedUntil');
    if (dismissedUntil) {
      const now = new Date();
      if (new Date(dismissedUntil) > now) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log('PWA 설치여부', isPWAInstalled);
      if (!isPWAInstalled) {
        setDeferredPrompt(e); // 이벤트 저장
        setShowInstallPrompt(true); // 설치 프롬프트 표시
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, [isPWAInstalled]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // 설치 프롬프트 실행
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null); // 설치 후 초기화
        setShowInstallPrompt(false);
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowInstallPrompt(false); // showInstallPrompt 상태도 false로 설정
  };

  const handleAllowNotifications = () => {
    GetUserPermission(setIsLoading);
    setShowPushNotificationPrompt(false);
    navigate('/privacy-agreement'); // 푸시 알림 설정 후 페이지 이동
  };

  return (
    <AppContainer>
      {showInstallPrompt && (
        <InstallPromptContainer>
          <ModalContent>
            <ModalBody>
              <LogoImage
                src={`${process.env.PUBLIC_URL}/logo196.png`}
                alt="Modal"
              />
              <TitleText>
                AjouEvent를 설치하고 <br /> 공지사항 알림을 받아보세요!
              </TitleText>
              <ParagraphText>
                앱에서 공지사항, 키워드 구독을 통해 <br />
                푸시 알림을 받을 수 있어요.
              </ParagraphText>
            </ModalBody>
            <InstallButton onClick={handleInstallClick}>설치</InstallButton>
            <LaterOption onClick={handleCloseModal}>나중에 설치</LaterOption>
          </ModalContent>
        </InstallPromptContainer>
      )}

      {showPushNotificationPrompt && (
        <PushNotificationPromptContainer>
          <BellIcon
            alt="알람"
            src={`${process.env.PUBLIC_URL}/icons/notiOn.svg`}
          />
          <h1>푸시 알림 받기</h1>
          <p>푸시 알림을 설정하고 각종 공지사항, 키워드 알림을 받아보세요!</p>
          <PushNotificationPromptButton onClick={handleAllowNotifications}>
            알림 받기
          </PushNotificationPromptButton>
          <LaterOption onClick={() => setShowPushNotificationPrompt(false)}>
            나중에 받을게요
          </LaterOption>
        </PushNotificationPromptContainer>
      )}

      <MainContentContainer>
        <HelpBox setIsLoading={setIsLoading} />
        <HomeBanner images={bannerImages} />
        <LocationBar location="이번주 인기글" />
        <HomeHotEvent />
      </MainContentContainer>
      <NavigationBar />
      {showModal && <DailyModal onClose={handleCloseModal} />}
    </AppContainer>
  );
}
