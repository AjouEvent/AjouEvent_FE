import { create } from 'zustand';
import {
  getSubscribedTabReadStatus,
  getTopicSubscriptions,
  getUserKeywords,
  subscribeTopic,
  unsubscribeTopic,
} from '../services/api/subscription';
import { GA } from '../utils/analytics';

const useSubscriptionStore = create((set, get) => ({
  isTopicTabRead: true,
  isKeywordTabRead: true,
  isSubscribedTabRead: true,
  topics: [],
  subscribeItems: [],
  keywords: [],
  subscribedKeywords: [],

  setSubscribeItems: (items) => {
    set({ subscribeItems: items });
    get().updateTabReadStatus();
  },

  setSubscribedKeywords: (keywords) => {
    set({ subscribedKeywords: keywords });
    get().updateTabReadStatus();
  },

  updateTabReadStatus: () => {
    const { subscribeItems, subscribedKeywords } = get();
    const allTopicsRead = subscribeItems.every((item) => item.isRead);
    const allKeywordsRead = subscribedKeywords.every((item) => item.isRead);

    set({
      isTopicTabRead: allTopicsRead,
      isKeywordTabRead: allKeywordsRead,
      isSubscribedTabRead: allTopicsRead && allKeywordsRead,
    });
  },

  markTopicAsRead: (topic) => {
    const state = get();
    const updatedItems = state.subscribeItems.map((item) =>
      item.englishTopic === topic ? { ...item, isRead: true } : item,
    );
    const allTopicsRead = updatedItems.every((item) => item.isRead === true);
    const allKeywordsRead = state.subscribedKeywords.every((item) => item.isRead === true);
    set({
      subscribeItems: updatedItems,
      isTopicTabRead: allTopicsRead,
      isSubscribedTabRead: allTopicsRead && allKeywordsRead,
    });
  },

  markKeywordAsRead: (keyword) => {
    const state = get();
    const updatedItems = state.subscribedKeywords.map((item) =>
      item.encodedKeyword === keyword.encodedKeyword
        ? { ...item, isRead: true }
        : item,
    );
    const allKeywordsRead = updatedItems.every((item) => item.isRead === true);
    const allTopicsRead = state.subscribeItems.every((item) => item.isRead === true);
    set({
      subscribedKeywords: updatedItems,
      isKeywordTabRead: allKeywordsRead,
      isSubscribedTabRead: allTopicsRead && allKeywordsRead,
    });
  },

  setIsTopicTabRead: async (isRead) => {
    set({ isTopicTabRead: isRead });
  },

  setIsKeywordTabRead: async (isRead) => {
    set({ isKeywordTabRead: isRead });
  },

  setIsSubscribedTabRead: (isRead) => set({ isSubscribedTabRead: isRead }),

  updateSubscribedTabRead: async () => {
    try {
      const response = await getSubscribedTabReadStatus();
      set({ isSubscribedTabRead: response.data.isSubscribedTabRead });
    } catch (error) {
      console.error('Error updating isSubscribedTabRead:', error);
    }
  },

  updateTopicReadStatus: (topics) => {
    const allTopicsRead = topics.every((topic) => topic.isRead);
    set({ isTopicTabRead: allTopicsRead });
  },

  updateKeywordReadStatus: (keywords) => {
    const allKeywordsRead = keywords.every((keyword) => keyword.isRead);
    set({ isKeywordTabRead: allKeywordsRead });
  },

  fetchMemberStatus: async () => {
    try {
      const response = await getSubscribedTabReadStatus();
      set({
        isSubscribedTabRead: response.data.subscribedTabRead,
      });
    } catch (error) {
      console.error('Error fetching read status', error);
    }
  },

  fetchSubscribedTopics: async () => {
    try {
      const response = await getTopicSubscriptions();
      const topics = response.data;
      set({ topics });
    } catch (error) {
      console.error('Error fetching subscribed topics', error);
    }
  },

  fetchSubscribedKeywords: async () => {
    try {
      const response = await getUserKeywords();
      const keywords = response.data;
      set({ subscribedKeywords: keywords });
      get().updateTabReadStatus();
    } catch (error) {
      console.error('Error fetching subscribed keywords', error);
    }
  },

  fetchSubscribeItems: async () => {
    try {
      const response = await getTopicSubscriptions();
      const topics = response.data;
      set({ subscribeItems: topics });
      get().updateTabReadStatus();
    } catch (error) {
      console.error('Error fetching subscribe items:', error);
    }
  },

  subscribeToTopic: async (topic) => {
    try {
      await subscribeTopic(topic);
      GA.subscribeTopic(topic);
      set((state) => ({
        topics: state.topics.map((t) =>
          t.englishTopic === topic ? { ...t, subscribed: true } : t,
        ),
      }));
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  },

  unsubscribeFromTopic: async (topic) => {
    try {
      await unsubscribeTopic(topic);
      GA.unsubscribeTopic(topic);
      set((state) => ({
        topics: state.topics.map((t) =>
          t.englishTopic === topic ? { ...t, subscribed: false } : t,
        ),
      }));
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
    }
  },
}));

export default useSubscriptionStore;