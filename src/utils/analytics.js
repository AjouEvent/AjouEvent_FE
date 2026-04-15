import ReactGA from 'react-ga4';

const isDev = process.env.NODE_ENV === 'development';

const trackEvent = (eventName, params = {}) => {
  if (isDev) {
    console.log('[GA Event]', eventName, params);
  }
  ReactGA.event(eventName, params);
};

export const GA = {
  // 행사 상세 조회
  eventDetailView: (eventId, eventTitle, subject) =>
    trackEvent('event_detail_view', {
      event_id: String(eventId),
      event_title: eventTitle,
      subject,
    }),

  // 좋아요 / 좋아요 취소
  eventLike: (eventId, eventTitle) =>
    trackEvent('event_like', {
      event_id: String(eventId),
      event_title: eventTitle,
    }),

  eventUnlike: (eventId, eventTitle) =>
    trackEvent('event_unlike', {
      event_id: String(eventId),
      event_title: eventTitle,
    }),

  // 캘린더 추가
  calendarAdd: (eventTitle) =>
    trackEvent('calendar_add', { event_title: eventTitle }),

  // 검색 쿼리
  searchQuery: (query, resultCount) =>
    trackEvent('search', {
      search_term: query,
      result_count: resultCount,
    }),

  // 필터 변경 (category / detail)
  searchFilterUse: (filterType, filterValue) =>
    trackEvent('search_filter_use', {
      filter_type: filterType,
      filter_value: filterValue,
    }),

  // 토픽 구독 / 해제
  subscribeTopic: (topicName) =>
    trackEvent('subscribe_topic', { topic_name: topicName }),

  unsubscribeTopic: (topicName) =>
    trackEvent('unsubscribe_topic', { topic_name: topicName }),

  // 키워드 구독 추가
  keywordSubscribe: (keyword) =>
    trackEvent('keyword_subscribe', { keyword }),

  // 알림 클릭
  notificationClick: (notificationId, topicName) =>
    trackEvent('notification_click', {
      notification_id: String(notificationId),
      topic_name: topicName,
    }),

  // 로그인 퍼널
  loginAttempt: () => trackEvent('login_attempt'),
  loginSuccess: (isNewMember) =>
    trackEvent('login_success', { is_new_member: isNewMember }),
};
