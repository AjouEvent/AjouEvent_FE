import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../../store/useSubscriptionStore';

const KeywordBar = ({ onKeywordSelect, showGuide }) => {
  const { isKeywordTabRead, setIsKeywordTabRead, subscribedKeywords, markKeywordAsRead } =
    useSubscriptionStore();
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  useEffect(() => {
    const allKeywordsRead =
      subscribedKeywords.length > 0 && subscribedKeywords.every((item) => item.isRead === true);
    if (allKeywordsRead && !isKeywordTabRead) setIsKeywordTabRead(true);
    else if (!allKeywordsRead && isKeywordTabRead) setIsKeywordTabRead(false);
  }, [subscribedKeywords, isKeywordTabRead, setIsKeywordTabRead]);

  const handleKeywordClick = (keyword) => {
    if (selectedKeyword?.encodedKeyword === keyword.encodedKeyword) {
      setSelectedKeyword(null);
      onKeywordSelect(null);
    } else {
      setSelectedKeyword(keyword);
      onKeywordSelect(keyword);
    }
    markKeywordAsRead(keyword);
  };

  return (
    <div className="w-full flex items-center overflow-x-auto whitespace-nowrap bg-white px-4 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/subscribe/keywordSubscribe', { state: { tab: 'keyword' } })}
          className={`flex h-9 px-3 justify-center items-center gap-1.5 rounded-full border border-[#E5E8EB] bg-[#F2F4F6] cursor-pointer text-sm font-semibold whitespace-nowrap text-[#333D4B] hover:bg-[#E5E8EB] transition-colors ${
            showGuide ? 'ring-2 ring-[#3182F6]' : ''
          }`}
        >
          <img
            src={`${process.env.PUBLIC_URL}/icons/alarm_filled.svg`}
            alt="bell"
            className="w-4 h-4 opacity-60"
          />
          <span>키워드 설정</span>
        </button>
        {showGuide && (
          <span className="bg-[#3182F6] text-white px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap">
            클릭해서 구독하기
          </span>
        )}
      </div>

      <div className="flex gap-2 ml-2">
        {subscribedKeywords.map((item, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(item)}
            className={`flex h-9 px-3 justify-center items-center gap-1 rounded-full border text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selectedKeyword?.encodedKeyword === item.encodedKeyword
                ? 'bg-[#3182F6] border-[#3182F6] text-white'
                : 'bg-white border-[#E5E8EB] text-[#333D4B] hover:bg-[#F9FAFB]'
            }`}
          >
            {item.koreanKeyword}
            {item.isRead === false && (
              <div className="w-1.5 h-1.5 bg-[#F04452] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KeywordBar;
