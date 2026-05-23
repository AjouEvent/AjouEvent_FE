import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import GetUserPermission from '../../services/fcm/GetUserPermission';
import LocationBar from '../../components/LocationBar';
import HomeBanner from './HomeBanner';
import HomeHotEvent from './HomeHotEvent';
import DailyModal from '../../components/DailyModal';
import HelpBox from '../../components/HelpBox';
import { STORAGE_KEYS } from '../../constants/appConstants';
import { getBannerImages } from '../../services/api/event';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [, setIsLoading] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [showPushNotificationPrompt, setShowPushNotificationPrompt] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    GetUserPermission(setIsLoading);
  }, []);

  const isKakaoTalkBrowser = () => /KAKAOTALK/i.test(navigator.userAgent);

  const openExternalBrowser = (url = window.location.href) => {
    const kakaoUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    window.location.href = kakaoUrl;
  };

  useEffect(() => {
    if (isKakaoTalkBrowser()) openExternalBrowser();
  }, []);

  useEffect(() => {
    const fetchBannerImages = async () => {
      setIsLoading(true);
      try {
        const response = await getBannerImages();
        const data = response.data;
        setBannerImages(Array.isArray(data) ? data : []);
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
      const isFirstTimeOpen = localStorage.getItem(STORAGE_KEYS.IS_FIRST_TIME);
      if (!isFirstTimeOpen) {
        setShowPushNotificationPrompt(true);
        localStorage.setItem(STORAGE_KEYS.IS_FIRST_TIME, 'false');
      }
      return;
    }

    const dismissedUntil = localStorage.getItem(STORAGE_KEYS.MODAL_DISMISSED_UNTIL);
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      if (!isPWAInstalled) {
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [isPWAInstalled]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') console.log('User accepted the install prompt');
        else console.log('User dismissed the install prompt');
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowInstallPrompt(false);
  };

  const handleAllowNotifications = () => {
    GetUserPermission(setIsLoading);
    setShowPushNotificationPrompt(false);
    navigate('/privacy-agreement');
  };

  return (
    <div className="flex items-center flex-col bg-white">
      {showInstallPrompt && (
        <div className="fixed z-[1000] left-0 top-0 w-full h-full flex justify-center items-center bg-black/50">
          <div className="flex flex-col items-center bg-white p-5 border border-[#888] w-4/5 max-w-[500px] rounded-[20px]">
            <div className="flex flex-col items-center text-center mt-2.5 gap-5">
              <img
                src={`${process.env.PUBLIC_URL}/logo196.png`}
                alt="Modal"
                className="w-[45%]"
              />
              <h2 className="text-[22px] font-bold mb-[-5px] text-center">
                AjouEvent를 설치하고 <br /> 공지사항 알림을 받아보세요!
              </h2>
              <p className="text-sm text-[#6c757d] mb-5 text-center">
                앱에서 공지사항, 키워드 구독을 통해 <br />
                푸시 알림을 받을 수 있어요.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-4/5 max-w-[300px] block px-5 py-2.5 bg-[#2366AF] text-white no-underline rounded-[50px] font-bold text-center text-xl border-none cursor-pointer hover:bg-[#1A4F8B]"
            >
              설치
            </button>
            <div
              onClick={handleCloseModal}
              className="mt-5 text-black/50 cursor-pointer text-xs block mx-auto text-center"
            >
              나중에 설치
            </div>
          </div>
        </div>
      )}

      {showPushNotificationPrompt && (
        <div className="flex flex-col items-center justify-center h-screen w-screen fixed top-0 left-0 bg-white text-black z-[1000] p-5 text-center">
          <img
            alt="알람"
            src={`${process.env.PUBLIC_URL}/icons/notiOn.svg`}
            className="w-[100px] h-[100px] mb-5"
          />
          <h1 className="text-2xl font-bold">푸시 알림 받기</h1>
          <p className="text-base">푸시 알림을 설정하고 각종 공지사항, 키워드 알림을 받아보세요!</p>
          <button
            onClick={handleAllowNotifications}
            className="bg-[#0A5CA8] text-white py-4 px-12 text-lg border-none rounded-[25px] cursor-pointer mt-5 w-4/5 max-w-[300px]"
          >
            알림 받기
          </button>
          <div
            onClick={() => setShowPushNotificationPrompt(false)}
            className="mt-5 text-black/50 cursor-pointer text-xs block mx-auto text-center"
          >
            나중에 받을게요
          </div>
        </div>
      )}

      <div className="flex w-full overflow-x-hidden items-center flex-col pb-20">
        <HelpBox setIsLoading={setIsLoading} />
        <HomeBanner images={bannerImages} />
        <LocationBar location="이번주 인기글" />
        <HomeHotEvent />
      </div>
      <NavigationBar />
      {showModal && <DailyModal onClose={handleCloseModal} />}
    </div>
  );
}
