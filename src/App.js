import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RouteChangeTracker from './RouteChangeTracker';
import { Analytics } from '@vercel/analytics/react';
import useStore from './store/useStore';
import HomePage from './pages/homePage/HomePage';
import SearchEventPage from './pages/searchPage/SearchEventPage';
import LoginPage from './pages/loginPage/LoginPage';
import MyPage from './pages/myPage/MyPage';
import LikedEventPage from './pages/likedPage/LikedEventPage';
import SubscribePage from './pages/subscribePage/SubscribePage';
import KeywordSubscribePage from './pages/subscribePage/KeywordSubscribePage';
import LoginSuccess from './pages/loginPage/LoginSuccess';
import GuidePage from './pages/GuidePage';
import ProfileModificationPage from './pages/myPage/ProfileModificationPage';
import DeleteAccountPage from './pages/myPage/DeleteAccountPage';
import SignUpSelectPage from './pages/signupPage/SignUpSelectPage';
import RegisterMemberInfoPage from './pages/signupPage/RegisterMebmerInfoPage';
import PrivacyAgreementPage from './pages/signupPage/PrivacyAgreementPage';
import NotificationPage from './pages/notificationPage/NotificationPage';
import EventDetailPage from "./pages/eventPage/EventDetailPage";

const ROUTER = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/notification',
    element: <NotificationPage />,
  },
  {
    path: '/event',
    element: <SearchEventPage />,
  },
  {
    path: '/event/:id',
    element: <EventDetailPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/privacy-agreement',
    element: <PrivacyAgreementPage />,
  },
  {
    path: '/mypage',
    element: <MyPage />,
  },
  {
    path: '/liked',
    element: <LikedEventPage />,
  },
  {
    path: '/subscribe',
    element: <SubscribePage />,
  },
  {
    path: '/subscribe/keywordSubscribe',
    element: <KeywordSubscribePage />,
  },
  {
    path: '/loginSuccess',
    element: <LoginSuccess />,
  },
  {
    path: '/guide',
    element: <GuidePage />,
  },
  {
    path: '/profile-modification',
    element: <ProfileModificationPage />,
  },
  {
    path: '/delete-account',
    element: <DeleteAccountPage />,
  },
  {
    path: '/register-info',
    element: <RegisterMemberInfoPage />,
  },
  {
    path: '/signUp/select',
    element: <SignUpSelectPage />,
  },
]);

function App() {
  const { unreadNotificationCount, setUnreadNotificationCount } = useStore();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", async (event) => {
        if (event.data.type === "updateBadge") {
          console.log("🔔 Updating badge count from SW:", event.data.count);

          setUnreadNotificationCount(event.data.count); // 상태 업데이트

          setTimeout(() => {
            if ("setAppBadge" in navigator) {
              console.log("🔔 Setting app badge:", event.data.count);
              navigator.setAppBadge(event.data.count).catch(console.error);
            }
          }, 100);
        }
      });
    }
  }, [setUnreadNotificationCount]);

  // 백그라운드 -> 포그라운드 시 배지 업데이트 개선
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔔 Foreground setting app badge:", unreadNotificationCount);
        if ("setAppBadge" in navigator) {
          navigator.setAppBadge(unreadNotificationCount).catch(console.error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [unreadNotificationCount]);

  return (
    <div className="App">
      <RouterProvider router={ROUTER}>
        <RouteChangeTracker />
      </RouterProvider>
      <Analytics />
    </div>
  );
}

export default App;
