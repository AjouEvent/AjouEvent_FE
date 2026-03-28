import api from '../api';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BE_URL;

export const getBannerImages = () =>
  axios.get(`${BASE_URL}/api/event/banner`);

export const getPopularEvents = () =>
  api.get('/api/event/popular');

export const getEventDetail = (id, config) =>
  axios.get(`${BASE_URL}/api/event/detail/${id}`, config);

export const getAuthEventDetail = (id) =>
  api.get(`/api/event/detail/${id}`);

export const getLikedEvents = (page, pageSize, keyword) =>
  api.get(`/api/event/liked?AjouNormal&page=${page}&size=${pageSize}&keyword=${keyword}`);

export const getEventsByCategory = (category, page, pageSize, keyword) =>
  api.get(`/api/event/${encodeURIComponent(category)}?page=${page}&size=${pageSize}&keyword=${keyword}`);

export const getSubscribedEvents = (page, pageSize, keyword) =>
  api.get(`/api/event/subscribed?page=${page}&size=${pageSize}&keyword=${keyword}`);

export const getPostsByKeyword = (encodedKeyword, page, pageSize) =>
  encodedKeyword
    ? api.get(`/api/event/getSubscribedPostsByKeyword/${encodedKeyword}?page=${page}&size=${pageSize}`)
    : api.get(`/api/event/getSubscribedPostsByKeyword?page=${page}&size=${pageSize}`);

export const likeEvent = (id) =>
  api.post(`/api/event/like/${id}`);

export const unlikeEvent = (id) =>
  api.delete(`/api/event/like/${id}`);

export const addEventToCalendar = (eventData) =>
  api.post('/api/event/calendar', eventData);
