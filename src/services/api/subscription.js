import api from '../api';

export const getTopicSubscriptionsStatus = () =>
  api.get('/api/topic/subscriptionsStatus');

export const getTopicSubscriptions = () =>
  api.get('/api/topic/subscriptions');

export const subscribeTopic = (topicEnglishName) =>
  api.post('/api/topic/subscribe', { topic: topicEnglishName });

export const unsubscribeTopic = (topicEnglishName) =>
  api.post('/api/topic/unsubscribe', { topic: topicEnglishName });

export const updateTopicNotification = (topicEnglishName, receiveNotification) =>
  api.post('/api/topic/subscriptions/notification', { topic: topicEnglishName, receiveNotification });

export const resetTopicSubscriptions = () =>
  api.delete('/api/topic/subscriptions/reset');

export const getUserKeywords = () =>
  api.get('/api/keyword/userKeywords');

export const subscribeKeyword = (koreanKeyword, topicName) =>
  api.post('/api/keyword/subscribe', { koreanKeyword, topicName });

export const unsubscribeKeyword = (encodedKeyword) =>
  api.post('/api/keyword/unsubscribe', { encodedKeyword });

export const resetKeywordSubscriptions = () =>
  api.delete('/api/keyword/subscriptions/reset');

export const getSubscribedTabReadStatus = () =>
  api.get('/api/subscriptions/isSubscribedTabRead');
