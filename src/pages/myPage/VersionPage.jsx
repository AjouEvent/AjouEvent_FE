import React from 'react';
import TabBar from '../../components/layout/TabBar';

const APP_VERSION = '2.0.0';

const phases = [
  {
    id: 'p0',
    title: '프로젝트 시작',
    subtitle: '서비스 기획 & 기반 구축',
    date: '2024 이반',
    events: [
      { type: 'BE', label: 'Spring Boot 기반 백엔드 초기 세팅', sub: 'REST API 설계, 기본 도메인 구조 수립' },
      { type: 'FE', label: 'React + JavaScript 프로젝트 초기화', sub: '공지사항 목록 조회 UI 구현, Styled Components 도입' },
      { type: 'Infra', label: 'AWS EC2 + CodeDeploy 배포 파이프라인 구성', sub: 'appspec.yml, 배포 스크립트 작성' },
      { type: 'BE', label: '아주대학교 공지사항 크롤링 로직 구현', sub: '학교 홈페이지, 단과대, 학과별 게시판 수집' },
    ],
  },
  {
    id: 'p1',
    badge: 'V1',
    title: '핵심 기능 완성',
    subtitle: '구독 · 알림 · 캘린더',
    date: '2024 중반 ~ 하반',
    events: [
      { type: 'BE', label: 'FCM 푸시 알림 시스템 구현', sub: 'FCM 토큰 등록·관리, 키워드/카테고리별 알림 발송' },
      { type: 'FE', label: 'PWA 지원 및 백그라운드 알림 구현', sub: 'Service Worker + manifest.json, iOS Safari 대응' },
      { type: 'BE', label: '토픽·키워드 구독 API 구현', sub: '일반/장학/취업 등 카테고리별 구독 기능' },
      { type: 'FE', label: '구독 페이지 & 마이페이지 구현', sub: 'Zustand 상태 관리, 무한 스크롤 도입 → 초기 로딩 40% 감소' },
      { type: 'BE', label: '구글 캘린더 연동 API 구현', sub: '공지 일정 원클릭 캘린더 저장 기능' },
      { type: 'BE', label: 'Redis 캐싱 도입', sub: '인기 게시글 주간 랭킹, 배너 캐싱' },
      { type: 'Infra', label: 'GitHub Actions CI/CD 파이프라인 구축', sub: 'FE: Vercel, BE: EC2 자동 배포' },
    ],
  },
  {
    id: 'p15',
    badge: 'V1.5',
    title: '아키텍처 개선',
    subtitle: '코드 품질 & 안정성 향상',
    date: '2025 이반 ~ 중반',
    events: [
      { type: 'BE', label: 'CQS 패턴 적용 리팩터링', sub: '명령-조회 분리로 코드 가독성 및 유지보수성 향상' },
      { type: 'BE', label: 'Redis Cache Fallback 구조 적용', sub: 'Redis 다운 시 DB 폴백 로직, 배너 현재화 패턴 적용' },
      { type: 'BE', label: 'FCM 토큰 만료 처리 및 유효성 검사 분리', sub: '단일 책임 원칙 강화' },
      { type: 'FE', label: 'ESLint + Prettier 도입 및 Dead Code 정리', sub: '빈 핸들러·주석 코드 제거, 코드 스타일 일관화' },
      { type: 'FE', label: 'BE-FE API 스펙 동기화', sub: '배너 삭제 API 변경에 따른 호출 경로 수정' },
    ],
  },
  {
    id: 'p2',
    badge: 'V2',
    title: '전면 리아키텍처',
    subtitle: '모니터링 · 테스트 · 인프라',
    date: '2025 하반기 ~ 2026',
    events: [
      { type: 'BE', label: 'V2 아키텍처 전면 재설계', sub: 'Controller → Orchestrator → Service → Repository 계층 구조' },
      { type: 'Infra', label: 'Docker + Docker Compose 컨테이너화', sub: 'Dockerfile, docker-compose.yml, 환경별 분리 구성' },
      { type: 'Infra', label: 'Prometheus + Grafana 모니터링 도입', sub: '실시간 서비스 지표 대시보드 구축' },
      { type: 'BE', label: 'ArchUnit 레이어 의존 규칙 테스트 도입', sub: '단방향 의존성 규칙 자동 검증' },
      { type: 'BE', label: 'Playwright 기반 E2E 크롤링 스크립트 도입', sub: '크롤링 안정성 및 유지보수성 향상' },
      { type: 'FE', label: 'Playwright E2E 테스트 환경 구성', sub: 'e2e 디렉터리, playwright.config.js 추가' },
      { type: 'FE', label: 'UI 전반 리팩터링 & GA4 연동', sub: '이미지 렌더링 최적화, 좋아요 태그 커스텀화' },
    ],
  },
  {
    id: 'wip',
    badge: '진행 중',
    title: 'V1 → V2 마이그레이션',
    subtitle: '완성화 & 테스트 확대',
    date: '2026 ~',
    isActive: true,
    events: [
      { type: 'BE', label: 'V1 데이터 마이그레이션', sub: 'V2 스키마 정합성 보완 및 기존 사용자 데이터 이관' },
      { type: 'BE', label: 'Database 인덱스 재구성 & Schema 업데이트', sub: '쿼리 성능 최적화' },
      { type: 'Infra', label: '배포 워크플로우 수동 실행 트리거 추가', sub: 'GitHub Actions workflow_dispatch 지원' },
      { type: 'FE', label: '프론트엔드 테스트 코드 단계적 도입', sub: '단위 테스트 환경 세팅, Playwright E2E 확대' },
    ],
  },
];

const TYPE_DOT = {
  BE:    'bg-[#1D4ED8]',
  FE:    'bg-[#3B82F6]',
  Infra: 'bg-[#93C5FD]',
};

const TYPE_TAG = {
  BE:    'bg-[#EFF6FF] text-[#1E40AF]',
  FE:    'bg-[#DBEAFE] text-[#1D4ED8]',
  Infra: 'bg-[#E0EEFF] text-[#3B82F6]',
};

const VersionPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-10">
      <TabBar Title="버전 & 히스토리" />

      <div className="px-10 pt-5 pb-4 border-b border-[#F0F5FF]">
        <p className="text-[#93C5FD] text-xs m-0 mb-1">현재 버전</p>
        <p className="text-[#1E3A8A] text-2xl font-bold m-0">v{APP_VERSION}</p>
        <div className="flex gap-4 mt-3">
          {[{ label: 'BE', cls: 'bg-[#1D4ED8]' }, { label: 'FE', cls: 'bg-[#60A5FA]' }, { label: 'Infra', cls: 'bg-[#BFDBFE]' }].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cls}`} />
              <span className="text-[#93C5FD] text-[11px]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 pt-5">
        <div className="relative">
          <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-[#DBEAFE]" />

          {phases.map((phase, pi) => (
            <React.Fragment key={phase.id}>
              <div className={`flex items-start gap-4 ${pi > 0 ? 'mt-7' : ''}`}>
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-[#3182F6] shadow-md shadow-blue-100 flex items-center justify-center">
                    {phase.isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#3182F6] flex-shrink-0">
                        {phase.badge}
                      </span>
                      <span className="text-[#1E3A8A] text-sm font-bold truncate">{phase.title}</span>
                    </div>
                    <span className="text-[#93C5FD] text-[11px] flex-shrink-0">{phase.date}</span>
                  </div>
                  <p className="text-[#93C5FD] text-xs m-0 mt-0.5 pl-0.5">{phase.subtitle}</p>
                </div>
              </div>

              {phase.events.map((ev, ei) => (
                <div key={ei} className="flex items-start gap-4 mt-3.5">
                  <div className="relative z-10 flex-shrink-0 flex justify-center w-5 mt-1.5">
                    <div className={`w-2 h-2 rounded-full border-2 border-white ${TYPE_DOT[ev.type]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 leading-tight ${TYPE_TAG[ev.type]}`}>
                        {ev.type}
                      </span>
                      <span className="text-[#1E3A8A] text-[13px] leading-snug">{ev.label}</span>
                    </div>
                    {ev.sub && (
                      <p className="text-[#788088] text-xs mt-0.5 mb-0 leading-relaxed">{ev.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionPage;
