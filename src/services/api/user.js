import api from '../api';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BE_URL;

export const getUserInfo = () =>
  api.get('/api/users');

export const deleteUser = () =>
  api.delete('/api/users');

export const oauthLogin = (loginData) =>
  axios.post(`${BASE_URL}/api/users/oauth`, loginData, { withCredentials: true });

export const login = (userData) =>
  axios.post(`${BASE_URL}/api/users/login`, userData);

export const register = (userData) =>
  axios.post(`${BASE_URL}/api/users/register`, userData);

export const registerInfo = (data) =>
  api.post('/api/users/register-info', data);

export const checkDuplicateEmail = (email) =>
  axios.get(`${BASE_URL}/api/users/duplicateEmail?email=${email}`);

export const checkAccountExists = (email, name) =>
  axios.get(`${BASE_URL}/api/users/accountExists?email=${email}&name=${name}`);

export const requestEmailVerification = (email) =>
  axios.post(`${BASE_URL}/api/users/emailCheckRequest?email=${email}`);

export const verifyEmailCode = (email, code) =>
  axios.post(`${BASE_URL}/api/users/emailCheck?email=${email}&code=${code}`);

export const resetPassword = (email, newPassword) =>
  axios.patch(`${BASE_URL}/api/users/reset-password`, { email, newPassword });
