# AjouEvent_FE

```
npm install react-router-dom
npm install styled-components
npm install axios
npm install firebase

npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
npm i --save @fortawesome/react-fontawesome@latest
npm install sweetalert2

npm i zustand

npm install dotenv (.env)
npm install react-intersection-observer --save (무한스크롤)

npm install react-ga --save
npm install react-bootstrap bootstrap

```

## version guide

### 24.06.06 - 0.0.1
### 24.06.07 - 0.0.2  

- 로그인
    - 로그인 시 refreshToken 추가
    - token 없거나 유효하지 않을 경우 강제 로그아웃 
- 캘린더
    - 캘린더 모바일 환경에서 초단위 안넘어 가는 것 -> 기본값 00초로 설정
    - 제목이나 내용 초기화 버튼 추가
    - 공백 제출 시 오류 라인 보여주고 api호출 막음

### 24.06.08 - 0.0.3

- 도메인마다 소셜로그인 리다이렉션 다르게 함

### 24.06.09 -0.0.4

- GA4 적용
- 상세 content없는 게시물 split처리 예외처리
- 캘린더에서 시간 등록할때 한국 시간 -9로 뜨는것 해결

### 24.06.09 -0.1.0

- 마이페이지 배너 클릭시 리다이렉팅
- 이벤트 좋아요 바로 오르게 이벤트 상세에 캐러셀적용

### 24.06.10 - 0.1.1

- FCM토큰 정상발급확인
- "Notification" in window 일때 예외 처리

### 24.06.10 - 0.1.2

- signUp 전화번호 삭제 및 이메일 인증 , UI/UX
- Notification Denied case error alert추가
- service worker 등록 삭제
