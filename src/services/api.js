import axios from 'axios';
import Swal from 'sweetalert2';
import { clearAuth } from '../utils/auth';
import { STORAGE_KEYS } from '../constants/appConstants';

const api = axios.create({
  baseURL: process.env.REACT_APP_BE_URL,
});

// 요청 인터셉터: 모든 요청에 accessToken 자동 부착
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 시 refresh → 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const publicPaths = ['/login', '/loginSuccess', '/privacy-agreement', '/signUp'];
    const isPublicPath = publicPaths.some((path) =>
      window.location.pathname.startsWith(path),
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicPath) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_BE_URL}/api/users/reissue-token`, null, 
          { withCredentials: true },
        );
        const newAccessToken = response.data.accessToken;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

        // 원래 요청 헤더 갱신 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        clearAuth();
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        Swal.fire({
          icon: 'warning',
          title: '타임오버',
          text: '로그인 시간이 만료되어 로그아웃 되었습니다.',
        });
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;