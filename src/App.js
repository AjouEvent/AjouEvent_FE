import React, { useEffect, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RouteChangeTracker from './RouteChangeTracker';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from './components/ui/sonner';
import ConfirmDialog from './components/ConfirmDialog';

import useNotificationStore from "./store/useNotificationStore";
import useSubscriptionStore from "./store/useSubscriptionStore";

const HomePage = lazy(() => import('./pages/homePage/HomePage'));
const SearchEventPage = lazy(() => import('./pages/searchPage/SearchEventPage'));
const LoginPage = lazy(() => import('./pages/loginPage/LoginPage'));
const MyPage = lazy(() => import('./pages/myPage/MyPage'));
const LikedEventPage = lazy(() => import('./pages/likedPage/LikedEventPage'));
const SubscribePage = lazy(() => import('./pages/subscribePage/SubscribePage'));
const KeywordSubscribePage = lazy(() => import('./pages/subscribePage/KeywordSubscribePage'));
const LoginSuccess = lazy(() => import('./pages/loginPage/LoginSuccess'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const ProfileModificationPage = lazy(() => import('./pages/myPage/ProfileModificationPage'));
const DeleteAccountPage = lazy(() => import('./pages/myPage/DeleteAccountPage'));
const RegisterMemberInfoPage = lazy(() => import('./pages/signupPage/RegisterMemberInfoPage'));
const PrivacyAgreementPage = lazy(() => import('./pages/signupPage/PrivacyAgreementPage'));
const NotificationPage = lazy(() => import('./pages/notificationPage/NotificationPage'));
const EventDetailPage = lazy(() => import("./pages/eventPage/EventDetailPage"));
const VersionPage = lazy(() => import("./pages/myPage/VersionPage"));
const FAQPage = lazy(() => import("./pages/myPage/FAQPage"));

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
    path: '/version',
    element: <VersionPage />,
  },
  {
    path: '/faq',
    element: <FAQPage />,
  }
]);

function App() {
  const { fetchMemberStatus } = useSubscriptionStore();
  const { unreadNotificationCount, setUnreadNotificationCount } = useNotificationStore();

  useEffect(() => {
    fetchMemberStatus();
  }, [fetchMemberStatus]);

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
      <Suspense fallback={null}>
        <RouterProvider router={ROUTER}>
          <RouteChangeTracker />
        </RouterProvider>
      </Suspense>
      <Analytics />
      <Toaster position="top-center" richColors />
      <ConfirmDialog />
    </div>
  );
}

export default App;
