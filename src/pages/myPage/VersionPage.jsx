import React from 'react';
import TabBar from '../../components/layout/TabBar';

const phases = [
  {
    id: 'phase0',
    version: 'Phase 0',
    title: '프로젝트 시작',
    period: '2024 초반',
    isCurrent: false,
    categories: [
      {
        label: 'Backend',
        items: [
          'Spring Boot 기반 백엔드 초기 세팅 (Java, Gradle)',
          'REST API 설계 및 기본 도메인 구조 수립',
          '아주대학교 공지사항 크롤링 로직 구현 (학교 홈페이지, 단과대, 학과별 게시판 수집)',
        ],
      },
      {
        label: 'Frontend',
        items: [
          'React + JavaScript 프로젝트 초기화',
          '공지사항 목록 조회 UI 구현, Styled Components 도입',
        ],
      },
      {
        label: 'Infra',
        items: [
          'AWS EC2 + CodeDeploy 기반 배포 파이프라인 구성',
          'appspec.yml 및 배포 스크립트 작성',
        ],
      },
    ],
  },
  {
    id: 'phase1',
    version: 'V1',
    title: '핵심 기능 완성',
    period: '2024 중반 ~ 후반',
    isCurrent: false,
    categories: [
      {
        label: 'Backend',
        items: [
          'FCM 푸시 알림 시스템 구현 — FCM 토큰 등록·관리, 키워드/카테고리별 알림 발송',
          '토픽·키워드 구독 API 구현 — 일반/장학/학사/취업 등 카테고리별 구독',
          '구글 캘린더 연동 API 구현 — 공지 일정 원클릭 캘린더 저장',
          'Redis 캐싱 도입 — 인기 게시글·배너 캐싱, 조회수 기반 주간 랭킹 집계',
        ],
      },
      {
        label: 'Frontend',
        items: [
          'PWA 지원 및 백그라운드 푸시 알림 구현 — Service Worker + manifest.json, iOS Safari PWA 대응',
          '구독 페이지 및 마이페이지 구현',
          'Zustand 전역 상태 관리 도입',
          'Intersection Observer 기반 무한 스크롤 도입으로 초기 로딩 속도 40% 개선',
        ],
      },
      {
        label: 'Infra',
        items: [
          'GitHub Actions CI/CD 파이프라인 구축',
          'Frontend: Vercel, Backend: EC2 자동 배포',
        ],
      },
    ],
  },
  {
    id: 'phase1_5',
    version: 'V1.5',
    title: '아키텍처 개선 & 코드 품질 향상',
    period: '2025 초반 ~ 중반',
    isCurrent: false,
    categories: [
      {
        label: 'Backend',
        items: [
          'CQS(Command Query Separation) 패턴 적용 리팩토링 — 게시글·토픽·키워드·토큰 관련 명령-조회 분리',
          '게시글 조회수 증가 로직 책임 분리 — 단일 책임 원칙 강화',
          'FCM 토큰 만료 처리 및 유효성 검사 로직 역할 분리',
          'Redis 장애 대응 — Cache Fallback 구조 적용 (Redis 다운 시 DB 폴백), 배너 파사드 패턴 적용',
        ],
      },
      {
        label: 'Frontend',
        items: [
          'ESLint + Prettier 코딩 컨벤션 도입',
          'Dead Code 정리 — 빈 핸들러 함수, 불필요한 코드 제거',
          '배너 삭제 API 변경에 따른 호출 경로 수정 (BE-FE API 스펙 동기화)',
        ],
      },
    ],
  },
  {
    id: 'phase2',
    version: 'V2',
    title: '전면 리아키텍처',
    period: '2025 하반기 ~ 2026',
    isCurrent: false,
    categories: [
      {
        label: 'Backend',
        items: [
          '새 레포지토리 생성 및 V2 아키텍처 재설계 — Controller → Orchestrator → Service → Repository 계층 구조 정립',
          'ArchUnit 도입으로 레이어 의존 규칙 자동 검증 (단방향 의존성 강제)',
          'Playwright 기반 E2E 크롤링 스크립트 도입 — 크롤링 안정성 향상',
          'Redis 캐시 적용 범위 확대 — 인기 게시글·타입별 게시글·배너 전반',
        ],
      },
      {
        label: 'Frontend',
        items: [
          'Playwright E2E 테스트 환경 구성',
          '이미지 렌더링 최적화 및 UI 전반 리팩토링',
          '좋아요 토글 로직을 useEventLike 커스텀 훅으로 추출',
          'GA4(Google Analytics 4) 연동 POC 진행',
        ],
      },
      {
        label: 'Infra',
        items: [
          'Docker + Docker Compose 컨테이너화 — Dockerfile, docker-compose.yml, 로컬 환경 분리 구성',
          'Prometheus + Grafana 모니터링 스택 도입',
        ],
      },
    ],
  },
  {
    id: 'current',
    version: 'Now',
    title: 'V1 → V2 마이그레이션 & 안정화',
    period: '2026 ~',
    isCurrent: true,
    categories: [
      {
        label: 'Backend',
        items: [
          'V1 데이터 마이그레이션 — V2 스키마 정합성 보완 및 기존 사용자 데이터 이관 준비',
          'Database 인덱스 재구성 및 Schema 업데이트 — 쿼리 성능 최적화',
        ],
      },
      {
        label: 'Frontend',
        items: [
          '단위 테스트 환경 세팅 및 Playwright E2E 테스트 단계적 확대',
        ],
      },
      {
        label: 'Infra',
        items: [
          'GitHub Actions 배포 워크플로우에 수동 실행 트리거(workflow_dispatch) 추가',
        ],
      },
    ],
  },
];

const categoryConfig = {
  Backend: {
    badge: 'bg-[#EBF4FE] text-[#3182F6]',
    bullet: 'bg-[#3182F6]',
  },
  Frontend: {
    badge: 'bg-[#E6FBF6] text-[#00B493]',
    bullet: 'bg-[#00B493]',
  },
  Infra: {
    badge: 'bg-[#FEF3E2] text-[#E07A12]',
    bullet: 'bg-[#E07A12]',
  },
};

const VersionPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-10">
      <TabBar Title="버전 & 히스토리" />

      <div className="px-5 pt-5 bg-white">
        {phases.map((phase, index) => {
          const isLast = index === phases.length - 1;
          const config = categoryConfig;
          return (
            <div key={phase.id} className="flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0 w-5">
                <div
                  className={`relative z-10 w-4 h-4 rounded-full mt-3.5 flex-shrink-0 ${
                    phase.isCurrent
                      ? 'bg-[#3182F6]'
                      : 'bg-white border-2 border-[#C5CDD6]'
                  }`}
                >
                  {phase.isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-[#3182F6] animate-ping opacity-40" />
                  )}
                </div>
                {!isLast && <div className="w-px flex-1 bg-[#E5E8EB] mt-1.5" />}
              </div>

              <div className={`flex-1 ${!isLast ? 'pb-4' : ''}`}>
                <div className="bg-white overflow-hidden">
                  <div className={`px-4 pt-3 pb-2.5 rounded-md ${phase.isCurrent ? 'bg-[#EBF4FE]' : ''}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          phase.isCurrent
                            ? 'bg-[#3182F6] text-white'
                            : 'bg-[#E5E8EB] text-[#6B7684]'
                        }`}
                      >
                        {phase.version}
                      </span>
                      <span
                        className={`text-[14px] font-semibold tracking-tight ${
                          phase.isCurrent ? 'text-[#3182F6]' : 'text-[#191F28]'
                        }`}
                      >
                        {phase.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#B0B8C1] font-medium">{phase.period}</p>
                  </div>

                  <div className="border-t border-[#F0F2F5]" />

                  <div>
                    {phase.categories.map((cat) => {
                      const catConfig = config[cat.label] || config.Backend;
                      return (
                        <div key={cat.label} className="px-4 py-3">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${catConfig.badge}`}
                          >
                            {cat.label}
                          </span>
                          <ul className="space-y-1.5">
                            {cat.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0 ${catConfig.bullet}`}
                                />
                                <span className="text-[12px] text-[#333D4B] leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionPage;
