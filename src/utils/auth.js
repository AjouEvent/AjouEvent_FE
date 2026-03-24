export function clearAuth() {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('major');
}
