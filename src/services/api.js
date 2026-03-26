import axios from 'axios';
import Swal from 'sweetalert2';
import { clearAuth } from '../utils/auth';
import { STORAGE_KEYS } from '../constant/appConstants';

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_BE_URL}/api/users/reissue-token`,
          { refreshToken },
        );
        const newAccessToken = response.data.accessToken;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

        // 원래 요청 헤더 갱신 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        clearAuth();
        Swal.fire({
          icon: 'warning',
          title: '타임오버',
          text: '로그인 시간이 만료되어 로그아웃 되었습니다.',
        });
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;