# Performance Test Results

**Target:** https://www.ajouevent.com
**Date:** 2026-03-31
**Browser:** Chromium (Playwright)

---

## 1. Page Load Time

| Metric | Value |
|---|---|
| DOM Content Loaded | 203.2ms |
| Load Complete | 2,301.9ms |
| TTFB (Time To First Byte) | 8.2ms |
| DOM Interactive | 67.9ms |

---

## 2. Web Vitals

| Metric | Value | Threshold | Result |
|---|---|---|---|
| LCP (Largest Contentful Paint) | 1,388ms | < 2,500ms | PASS |
| FCP (First Contentful Paint) | 320ms | < 1,800ms | PASS |
| CLS (Cumulative Layout Shift) | 0.0017 | < 0.1 | PASS |

---

## 3. API Response Time

| Endpoint | Status | Duration |
|---|---|---|
| /api/event/banner | 200 | -49.5ms* |
| /api/notification/unread-count | 404 | -40.0ms* |
| /api/event/popular | 200 | -38.7ms* |
| /api/subscriptions/isSubscribedTabRead | 404 | -46.9ms* |

> *Duration이 음수로 표시되는 것은 `request.timing()`이 외부 서버 요청에서 정확한 값을 반환하지 못하기 때문입니다. 추후 `PerformanceObserver` 기반으로 개선이 필요합니다.

---

## 4. Route Transition Speed

| Route | Duration |
|---|---|
| /event | 253ms |
| /login | 143ms |
| /subscribe | 98ms |
| /liked | 100ms |

---

## 5. Image Rendering Time

| Image | Duration | Size |
|---|---|---|
| search_border.svg | 13ms | 968B |
| home.svg | 41ms | 488B |
| favorite_border.svg | 21ms | 929B |
| subscriptions_border.svg | 23ms | 702B |
| identity_border.svg | 22ms | 826B |
| notiOn.svg | 23ms | 907B |
| InstallAppOn.svg | 55ms | 1,178B |
| EmptyBookmarkIcon.svg | 36ms | 920B |
| img-symbol.png | 114ms | 0B (cached) |
| banner image (jpg) | 1,110ms | 0B (cached) |
| event image 1 (png) | 827ms | 0B (cached) |
| event image 2 (png) | 1,618ms | 0B (cached) |
| event image 3 (png) | 1,740ms | 0B (cached) |
| event image 4 (png) | 806ms | 0B (cached) |
| event image 5 (jpg) | 848ms | 0B (cached) |
| event image 6 (png) | 977ms | 0B (cached) |

---

## Summary

- **Page Load**: 2.3초로 양호
- **Web Vitals**: LCP, FCP, CLS 모두 Google 권장 기준 통과
- **Route Transition**: 모든 경로 253ms 이내로 빠름
- **Image**: SVG 아이콘은 빠르나 (13~55ms), 이벤트 이미지(jpg/png)는 800ms~1.7초로 느림 - 이미지 최적화(WebP 변환, lazy loading) 고려 필요
- **API**: `/api/notification/unread-count`, `/api/subscriptions/isSubscribedTabRead`가 404 반환 - 엔드포인트 확인 필요
