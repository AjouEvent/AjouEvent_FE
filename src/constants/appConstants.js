export const COLORS = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    PRIMARY_BLUE: '#0066b3',
    BLUE_BRIGHT: '#0072CE',
    BLUE_MEDIUM: '#0A5CA8',
    BLUE_SECONDARY: '#2366AF',
    BLUE_DARK:'#1A4F8B',
    OVERLAY_BLACK: 'rgba(0,0,0,0.5)',
    OVERLAY_GARY: 'rgba(120,120,120,0.5)',
    LIGHT_GARY: '#E0E0E0',
    BORDER_GARY: '#CDCDCD', // #CCC, #DDD를 #CDCDCD로 통일
    DARK_GRAY_TEXT: '#333',
    OFF_WHITE: '#F5F5F5'    // #F0F0F0, #F7F7F7를 #F5F5F5로 통일
}

export const Z_INDEX = {
  PAGE: 1,
  NAV: 5,
  IMAGE_CONTROLS: 10,
  CALENDAR: 20,
  DROPDOWN: 100,
  OVERLAY_BACKDROP: 999,
  MODAL: 1000,
  MODAL_TOP: 1001,
}

export const LIMITS = {
  MAX_KEYWORDS: 10,
  PAGE_SIZE: 10,
  MIN_KEYWORD_LENGTH: 2,
  SWIPE_THRESHOLD: 50,
  MAX_CACHE_ENTRIES: 50,
  NOTIFICATION_BADGE_MAX: 100,
  TOAST_TIMER: {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 3000,
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'id',
  EMAIL: 'email',
  NAME: 'name',
  MAJOR: 'major',
  FCM_TOKEN: 'fcmToken',
  IS_FIRST_TIME: 'isFirstTimeOpen',
  MODAL_DISMISSED_UNTIL: 'modalDismissedUntil',
};
