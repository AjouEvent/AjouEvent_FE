import axios from 'axios';
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
  withCredentials: true,
});

export default async function requestWithAccessToken(method, url, data = null) {
  const accessToken = localStorage.getItem('accessToken');

  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};

  try {
    let response;
    if (method === 'get') {
      response = await axiosInstance.get(url, config);
    } else if (method === 'post') {
      response = await axiosInstance.post(url, data, config);
    } else if (method === 'patch') {
      response = await axiosInstance.patch(url, data, config);
    } else if (method === 'delete') {
      response = await axiosInstance.delete(url, config);
    }
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) return null;

      const newConfig = {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      };

      let response;
      if (method === 'get') {
        response = await axiosInstance.get(url, newConfig);
      } else if (method === 'post') {
        response = await axiosInstance.post(url, data, newConfig);
      } else if (method === 'patch') {
        response = await axiosInstance.patch(url, data, newConfig);
      } else if (method === 'delete') {
        response = await axiosInstance.delete(url, newConfig);
      }
      return response;
    } else {
      console.error(`Error making ${method} request:`, error);
      throw error;
    }
  }
}

async function refreshAccessToken() {
  // 인증이 필요 없는 페이지면 리다이렉트 방지
  const publicPaths = ['/login', '/loginSuccess', '/privacy-agreement', '/signUp'];
  if (publicPaths.some(path => window.location.pathname.startsWith(path))) {
    return null;
  }

  try {
    // refreshToken은 HttpOnly 쿠키로 자동 전송 (withCredentials)
    const response = await axiosInstance.patch(
      `${process.env.REACT_APP_BE_URL}/api/users/reissue-token`,
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    clearAuthAndRedirect();
    return null;
  }
}

function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('major');
  Swal.fire({
    icon: 'warning',
    title: '타임오버',
    text: '로그인 시간이 만료되어 로그아웃 되었습니다.',
  });
  window.location.href = '/login';
}