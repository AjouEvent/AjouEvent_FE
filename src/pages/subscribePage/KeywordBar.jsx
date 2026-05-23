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
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`w-full flex items-center overflow-x-auto whitespace-nowrap bg-white font-semibold box-border ${
          showGuide ? 'py-[18px] px-[10px] pl-3' : 'pt-3 pb-0 px-[10px] pl-4'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            onClick={() =>
              navigate('/subscribe/keywordSubscribe', { state: { tab: 'keyword' } })
            }
            className={`flex h-fit px-3 py-2 justify-center items-center gap-1 rounded-[600px] border-2 border-[#F5F5F5] bg-[#E0E0E0] cursor-pointer text-sm whitespace-nowrap ${
              showGuide ? 'animate-[glow_1.5s_infinite]' : ''
            }`}
          >
            <img
              src={`${process.env.PUBLIC_URL}/icons/alarm_filled.svg`}
              alt="bell"
              className="w-[18px] aspect-square object-cover"
            />
            <p className="m-0">키워드 설정</p>
          </div>
          {showGuide && (
            <div className="bg-[#0072CE] text-white px-2 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap leading-[1.4]">
              클릭해서 구독하기
            </div>
          )}
        </div>

        <div className="w-full flex overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {subscribedKeywords.map((item, index) => (
            <div
              key={index}
              onClick={() => handleKeywordClick(item)}
              className={`flex h-fit px-3 py-2 mx-1 justify-center items-center gap-1 rounded-[600px] border-2 border-[#F5F5F5] cursor-pointer ${
                selectedKeyword?.encodedKeyword === item.encodedKeyword
                  ? 'bg-[#0A5CA8] text-white'
                  : 'bg-white text-black'
              }`}
            >
              {item.koreanKeyword}
              {item.isRead === false && (
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordBar;
