import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  overflow-x: auto;
  white-space: nowrap;
  background: #ffffff;
  padding: 12px 10px 0px 16px;
  font-family: 'Pretendard Variable';
  font-weight: 600;
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

const ViewAllButton = styled.div`
  display: flex;
  height: fit-content;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 600px;
  border: 2px solid #f7f7f7; // 회색 테두리
  background-color: #e0e0e0; // 회색 배경
  cursor: pointer;
  p {
    margin: 0;
    color: #333; // 텍스트 색상 조정
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

const KeywordBar = ({ onKeywordSelect }) => {
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
      <MenuBarContainer>
        <ViewAllButton
          onClick={() =>
            navigate('/subscribe/keywordSubscribe', {
              state: { tab: 'keyword' },
            })
          }
        >
          <ViewAllIcon
            src={`${process.env.PUBLIC_URL}/icons/alarm_filled.svg`}
          />
          <p>키워드 설정</p>
        </ViewAllButton>
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
