import api from '../api';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BE_URL;

export const getUserInfo = () =>
  api.get('/api/users');

export const deleteUser = () =>
  api.delete('/api/users');

export const oauthLogin = (loginData) =>
  axios.post(`${BASE_URL}/api/users/oauth`, loginData, { withCredentials: true });

export const registerInfo = (data) =>
  api.post('/api/users/register-info', data);
