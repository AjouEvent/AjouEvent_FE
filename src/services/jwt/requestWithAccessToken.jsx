import axios from 'axios';
import Swal from 'sweetalert2';
import { clearAuth } from '../../utils/auth';
import { STORAGE_KEYS } from '../../constant/appConstants';

export default async function requestWithAccessToken(method, url, data = null) {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  try {
    let response;
    const config = accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {};

    if (method === 'get') {
      response = await axios.get(url, config);
    } else if (method === 'post') {
      response = await axios.post(url, data, config);
    } else if (method === 'patch') {
      response = await axios.patch(url, data, config);
    } else if (method === 'delete') {
      response = await axios.delete(url, config);
    }
    return response;
  } catch (error) {
    // accessToken이 만료되었을 때
    if (error.response && error.response.status === 401) {
      console.log('Access Token 401Error');
      // 새로운 accessToken 얻기 시도
      const newAccessToken = await refreshAccessToken();

      const newConfig = newAccessToken
        ? {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        : {};

      // 새로운 accessToken으로 다시 요청
      let response;
      console.log('New Access Token request');
      if (method === 'get') {
        response = await axios.get(url, newConfig);
      } else if (method === 'post') {
        response = await axios.post(url, data, newConfig);
      } else if (method === 'patch') {
        response = await axios.patch(url, data, newConfig);
      } else if (method === 'delete') {
        response = await axios.delete(url, newConfig);
      }
      console.error(
        `Response making ${method} request with access token:`,
        response,
      );
      return response;
    } else {
      console.error(`Error making ${method} request with access token:`, error);
      throw error;
    }
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  try {
    if (!refreshToken) {
      clearAuth();
      window.location.href = '/login';
    }

    const response = await axios.patch(
      `${process.env.REACT_APP_BE_URL}/api/users/reissue-token`,
      { refreshToken },
    );
    const newAccessToken = response.data.accessToken;
    console.log('refresh token respon' + newAccessToken);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
    return newAccessToken;
  } catch (error) {
    // refreshToken이 만료되었을 경우
    if (error.response && error.response.status === 401) {
      console.log('refresh token 401 error');
      // localStorage 초기화 및 리다이렉션 수행
      clearAuth();
      Swal.fire({
        icon: 'warning',
        title: '타임오버',
        text: '로그인 시간이 만료되어 로그아웃 되었습니다.',
      });
      window.location.href = '/login';
    } else {
      clearAuth();
      Swal.fire({
        icon: 'warning',
        title: '타임오버',
        text: '로그인 시간이 만료되어 로그아웃 되었습니다.',
      });
      console.error('Error refreshing access token:', error);
      window.location.href = '/login';
      throw error;
    }
  }
}
