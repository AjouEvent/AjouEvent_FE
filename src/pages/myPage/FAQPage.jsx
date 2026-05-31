import React, { useState } from 'react';
import TabBar from '../../components/layout/TabBar';

const faqs = [
  {
    category: '서비스 소개',
    items: [
      {
        q: '아주이벤트는 어떤 서비스인가요?',
        a: '아주이벤트는 아주대학교의 공지사항, 행사, 채용 정보 등을 한곳에서 확인하고 관심 있는 주제를 구독해 알림을 받을 수 있는 서비스입니다.',
      },
      {
        q: '로그인 없이도 이용할 수 있나요?',
        a: '이벤트 목록 조회는 로그인 없이도 가능하지만, 구독 및 알림 기능은 로그인 후 이용하실 수 있습니다.',
      },
    ],
  },
  {
    category: '알림 & 구독',
    items: [
      {
        q: '토픽 구독은 무엇인가요?',
        a: '토픽 구독은 학사, 장학, 취업, 행사 등 카테고리 단위로 구독하는 기능입니다. 해당 카테고리에 새 공지가 등록되면 푸시 알림을 받을 수 있습니다.',
      },
      {
        q: '키워드 구독은 어떻게 동작하나요?',
        a: '관심 있는 키워드를 등록하면, 공지 제목 또는 내용에 해당 키워드가 포함될 경우 알림을 받을 수 있습니다. 구독 페이지에서 키워드를 추가하거나 삭제할 수 있습니다.',
      },
      {
        q: '알림이 오지 않아요.',
        a: '기기의 알림 권한 설정을 확인해 주세요. 브라우저 설정에서 아주이벤트의 알림이 허용되어 있는지 확인하고, 구독 페이지에서 원하는 토픽 또는 키워드가 구독 중인지 확인해 주세요.',
      },
      {
        q: '알림을 너무 많이 받고 있어요.',
        a: '구독 페이지에서 필요 없는 토픽이나 키워드 구독을 해제하면 알림 수를 줄일 수 있습니다. 알림 페이지 상단에서 알림을 일시적으로 끌 수도 있습니다.',
      },
    ],
  },
  {
    category: '계정 관리',
    items: [
      {
        q: '회원정보(이름, 학과)를 변경하고 싶어요.',
        a: '마이페이지 > 회원정보 수정에서 이름과 학과를 변경할 수 있습니다.',
      },
      {
        q: '비밀번호를 변경하고 싶어요.',
        a: '현재 비밀번호 변경 기능은 준비 중입니다. 불편하시면 피드백/오류 제보를 통해 의견을 남겨 주세요.',
      },
      {
        q: '회원 탈퇴는 어떻게 하나요?',
        a: '마이페이지 > 회원정보 수정 페이지 하단의 "회원 탈퇴하기" 버튼을 통해 진행할 수 있습니다. 탈퇴 전 구독 중인 토픽과 키워드가 자동으로 초기화됩니다.',
      },
    ],
  },
  {
    category: '기타',
    items: [
      {
        q: '오류를 발견했어요.',
        a: '마이페이지 > 피드백 / 오류 제보를 통해 알려주시면 빠르게 확인하겠습니다. 소중한 의견 감사합니다.',
      },
      {
        q: '개발팀에 대해 알고 싶어요.',
        a: '마이페이지 > 팀소개를 통해 개발팀 노션 페이지를 확인하실 수 있습니다.',
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-[#F5F6F8] last:border-b-0 ${open ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="text-[#333D4B] text-sm font-medium pr-3 leading-relaxed">Q. {q}</span>
        <span
          className={`text-[#C5CDD6] text-xl font-light flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          ›
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="bg-[#F5F6F8] rounded-xl px-4 py-3">
            <p className="text-[#6B7684] text-sm leading-relaxed m-0 whitespace-pre-line">A. {a}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6F8] pb-20">
      <TabBar Title="FAQ" />

      <div className="flex flex-col gap-2 mt-2">
        {faqs.map(({ category, items }) => (
          <div key={category} className="bg-white border-t border-b border-[#F0F2F5] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#F5F6F8]">
              <span className="text-[#3182F6] text-xs font-bold tracking-wide">{category}</span>
            </div>
            {items.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
