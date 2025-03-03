import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const MenuBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  background: #ffffff;
  padding: ${({ highlight }) => (highlight ? '18px 10px 18px 12px' : '12px 10px 0px 16px')};
  font-family: 'Pretendard Variable';
  font-weight: 600;
  box-sizing: border-box;
`;

const MenuItemContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MenuItem = styled.div`
  background-color: ${(props) => (props.isSelected ? '#0A5CA8' : '#ffffff')};
  color: ${(props) => (props.isSelected ? '#ffffff' : '#000000')};
  display: flex;
  height: fit-content;
  padding: 8px 12px;
  margin: 0 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 600px;
  border: 2px solid #f7f7f7;
  cursor: pointer;
`;

const ViewAllButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;  // 구독 설정과 툴팁 사이 여백
`;

const ViewAllButton = styled.div`
  display: flex;
  height: fit-content;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 600px;
  border: 2px solid #f7f7f7;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  box-sizing: border-box;
  animation: ${({ highlight }) => highlight ? glowAnimation : 'none'} 1.5s infinite;

  background-color: ${(props) =>
    props.isSelected ? '#e0e0e0' : '#ffffff'}; /* 항상 회색 유지 */
  p {
    margin: 0
`;

const InlineTooltip = styled.div`
  background-color: #0072ce;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  line-height: 1.4;
  display: ${({ show }) => (show ? 'block' : 'none')};
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ViewAllIcon = styled.img`
  width: 18px;
  aspect-ratio: 1;
  object-fit: cover;
`;

const NotificationBadge = styled.div`
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  display: ${({ isRead }) => {
    return isRead === false ? 'inline-block' : 'none';
  }};
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 8px rgba(0, 114, 206, 0.6); }
  50% { box-shadow: 0 0 15px rgba(0, 114, 206, 0.9); }
  100% { box-shadow: 0 0 8px rgba(0, 114, 206, 0.6); }
`;


const KeywordBar = ({ onKeywordSelect, showGuide }) => {
  const {
    isKeywordTabRead,
    setIsKeywordTabRead,
    subscribedKeywords,
    markKeywordAsRead,
    fetchSubscribedKeywords,
  } = useStore();
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  useEffect(() => {
    // fetchSubscribedKeywords();
  }, []);

  useEffect(() => {
    const allKeywordsRead =
      subscribedKeywords.length > 0 &&
      subscribedKeywords.every((item) => item.isRead === true);

    // 모든 항목이 읽음 상태가 되었을 때만 isKeywordTabRead를 업데이트
    if (allKeywordsRead && !isKeywordTabRead) {
      setIsKeywordTabRead(true);
    } else if (!allKeywordsRead && isKeywordTabRead) {
      setIsKeywordTabRead(false);
    }
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
    <Container>
      <MenuBarContainer highlight={showGuide}>
        <ViewAllButtonWrapper>
           <ViewAllButton isSelected={true}
            onClick={() =>
              navigate('/subscribe/keywordSubscribe', {
                state: { tab: 'keyword' },
              })
            }
            highlight={showGuide}
          >
            <ViewAllIcon
              src={`${process.env.PUBLIC_URL}/icons/alarm_filled.svg`}
            />
            <p>키워드 설정</p>
          </ViewAllButton>
          <InlineTooltip show={showGuide}>
            클릭해서 구독하기
          </InlineTooltip>
        </ViewAllButtonWrapper> 
        <MenuItemContainer>
          {subscribedKeywords.map((item, index) => (
            <MenuItem
              key={index}
              isSelected={
                selectedKeyword?.encodedKeyword === item.encodedKeyword
              }
              onClick={() => handleKeywordClick(item)}
            >
              {item.koreanKeyword}
              <NotificationBadge isRead={item.isRead} />
            </MenuItem>
          ))}
        </MenuItemContainer>
      </MenuBarContainer>
    </Container>
  );
};

export default KeywordBar;
