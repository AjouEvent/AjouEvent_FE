import { STORAGE_KEYS } from '../constants/appConstants';

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.EMAIL);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.NAME);
  localStorage.removeItem(STORAGE_KEYS.MAJOR);
}
