# 📢 AjouEvent (아주이벤트)

> **"학교의 모든 소식, 놓치지 말고 구독하세요"**
> 아주대학교 공지사항 및 행사 정보를 유튜브처럼 구독하고 푸시 알림으로 받아보는 **공지 통합 플랫폼**입니다.

![ajouevent_홍보_page-0001](https://github.com/user-attachments/assets/93b9314f-9d0b-4502-9950-8ffe0545dcfb)

## 🔗 배포 링크 (Deploy)
* **Web Service**: [https://www.ajouevent.com](https://www.ajouevent.com)
* **Service Type**: PWA (Progressive Web App) 지원 - 모바일/PC 설치 가능

<br/>

## 📖 프로젝트 배경 (Background)

**"장학금 신청 기간을 놓쳐서 못 받았어..."**
**"우리 학과 공지는 어디서 봐야 하지?"**

아주대학교의 공지사항은 학교 홈페이지, 단과대 사이트, 학과 게시판 등 여러 곳에 흩어져 있어 학생들이 필요한 정보를 제때 확인하기 어려웠습니다.
이러한 문제를 해결하기 위해, **"사용자가 관심 있는 키워드와 카테고리만 구독하면, 새 글이 올라올 때 즉시 알려주는 서비스"**를 기획하게 되었습니다.

<br/>

## ✨ 핵심 기능 (Key Features)

* **🔔 맞춤형 공지 구독**: 일반/장학/학사/취업 등 원하는 카테고리만 골라 구독 가능
* **💬 키워드 푸시 알림**: '졸업', '장학금' 등 특정 키워드 등록 시 관련 공지 등록 즉시 FCM 푸시 발송
* **📅 캘린더 연동**: 공지사항의 일정을 구글 캘린더에 원클릭으로 저장
* **📱 PWA 지원**: 앱스토어 심사 없이 웹에서 바로 설치하여 네이티브 앱처럼 사용 가능
* **🔥 실시간 인기 공지**: 학우들이 가장 많이 클릭한 이번 주 인기 공지사항 랭킹 제공
<img width="936" height="509" alt="image (7)" src="https://github.com/user-attachments/assets/fbd8c01c-8b0d-4b2d-8260-6472300ea2ac" />
<img width="751" height="324" alt="image (8)" src="https://github.com/user-attachments/assets/cb99ec78-953b-40b0-ac65-7eb4f1dd2fe8" />
<img width="1280" height="674" alt="image (9)" src="https://github.com/user-attachments/assets/88001c7e-07ab-4b29-8151-80de668809ce" />

<br/>


## 🛠️ 기술 스택 (Tech Stack)

| 분류 | 기술 |
| :-- | :-- |
| **Framework** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) |
| **Language** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=black) |
| **Notification** | ![Firebase](https://img.shields.io/badge/Firebase_FCM-FFCA28?style=flat&logo=firebase&logoColor=black) (Cloud Messaging) |
| **State Mgt** | `Recoil` (or Context API) |
| **Styling** | ![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=flat&logo=styled-components&logoColor=white) |
| **Deploy** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=Vercel&logoColor=white) (or AWS Amplify) |

<br/>

## 📂 아키텍처 및 폴더 구조 (Architecture)

PWA 설정과 FCM 알림 처리를 위한 구조로 설계되었습니다.

```bash
AjouEvent_FE/
├── public/
│   ├── firebase-messaging-sw.js # 백그라운드 푸시 알림 처리를 위한 Service Worker
│   └── manifest.json            # PWA 설치 정보 설정
├── src/
│   ├── api/                     # Axios 인스턴스 및 공지사항 조회 API
│   ├── assets/                  # 아이콘, 배너 이미지
│   ├── components/              # 공통 UI (Button, Modal, NoticeCard)
│   ├── pages/                   # 페이지 (Home, Subscribe, MyPage)
│   ├── hooks/                   # 커스텀 훅 (useNotification, useCalendar)
│   ├── utils/                   # 날짜 포맷팅, FCM 토큰 처리 로직
│   ├── App.js
│   └── index.js
├── .env                         # Firebase Key 및 API EndPoint
├── package.json
└── README.md
```

<br/>

## 💡 기술적 도전 & 트러블 슈팅 (Challenges)

**1. PWA와 FCM을 활용한 웹 푸시 구현**
* **문제**: 웹 환경(iOS/Android/PC)에서 네이티브 앱 없이 알림을 보내야 하는 요구사항.
* **해결**: Firebase Cloud Messaging(FCM)과 Service Worker를 연동하여 브라우저가 닫혀 있어도 백그라운드 알림을 수신할 수 있도록 구현. 특히 iOS(Safari)의 PWA 푸시 정책 변화에 맞춰 `manifest.json`을 최적화함.

**2. 구독 데이터 동기화 최적화**
* **문제**: 사용자가 구독한 태그/키워드가 많아질수록 메인 페이지 로딩 속도가 저하됨.
* **해결**: 초기 로딩 시 전체 공지를 불러오지 않고, `Intersection Observer`를 활용한 **무한 스크롤(Infinite Scroll)**을 도입하여 초기 렌더링 속도를 40% 개선.

**3. 크롤링 데이터 정제 및 렌더링**
* **문제**: 백엔드(Go/Java)에서 크롤링해온 데이터에 포함된 불필요한 HTML 태그나 깨진 문자열 처리.
* **해결**: 프론트엔드 단에서 정규표현식(Regex)을 이용한 유틸리티 함수를 제작하여, 텍스트 미리보기(Preview)를 깔끔하게 정제하여 UI 가독성을 높임.

<br/>

## 🚀 설치 및 실행 (Getting Started)

'''bash
# 1. Repository Clone
git clone https://github.com/AjouEvent/AjouEvent_FE.git

# 2. Install Dependencies
npm install

# 3. Environment Setup (.env)
# REACT_APP_API_URL=...
# REACT_APP_FIREBASE_API_KEY=...

# 4. Run Development Server
npm start
'''

<br/>

## 📬 Team & Contact

* **Team**: 이쿠죠 (Ikujo)
* **Frontend**: [@Yoonseokchan (PaleBlueNote)](https://github.com/PaleBlueNote)
* **Email**: yoonseokchan0731@gmail.com

---
© 2024 Yoonseokchan. All rights reserved.
