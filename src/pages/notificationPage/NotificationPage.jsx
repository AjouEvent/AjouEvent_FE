import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../components/TabBar';
import NotificationList from './NotificationList';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;
  min-height: 100vh;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid rgba(239, 237, 239, 0.2);
`;

const TabButton = styled.button`
  flex: 1;
  padding: 16px;
  text-align: center;
  font-size: 1.125rem;
  font-family: 'Pretendard Variable', serif;
  font-weight: 600;
  border: none;
  background: none;
  color: ${(props) => (props.$active ? 'black' : 'gray')};
  cursor: pointer;
  border-bottom: ${(props) =>
    props.$active ? '2px solid black' : '1px solid gray'};
  transition: color 0.3s ease-in-out;
`;

const KeywordRegistrationBanner = styled.div`
  display: flex;
  padding: 16px;
  width: 100%;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.05);
  justify-content: space-between;
  align-items: center;
  font-family: 'Pretendard Variable', serif;
  font-size: 18px;
  font-weight: 600;
`;

const StyledButton = styled.button`
  background-color: #0a5ca8;
  color: #fff;
  padding: 4px 14px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Pretendard Variable', serif;
  font-weight: 500;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #1a4f8b;
  }
`;

const NotificationPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('topic');
  const [keywordCount, setKeywordCount] = useState(0);

  // 키워드 개수 가져오기
  useEffect(() => {
    const fetchUserKeywords = async () => {
      try {
        const response = await requestWithAccessToken(
          'get',
          `${process.env.REACT_APP_BE_URL}/api/keyword/userKeywords`,
        );
        setKeywordCount(response.data.length);
      } catch (error) {
        console.error('Error fetching user keywords:', error);
      }
    };

    fetchUserKeywords();
  }, []);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  // 키워드 설정 페이지 이동
  const KeywordSettingButtonClick = () => {
    navigate('/subscribe/keywordSubscribe');
  };

  return (
    <AppContainer>
      <TabBar Title="알림" />
      <TabContainer>
        <TabButton
          $active={currentTab === 'topic'}
          onClick={() => handleTabChange('topic')}
        >
          구독
        </TabButton>
        <TabButton
          $active={currentTab === 'keyword'}
          onClick={() => handleTabChange('keyword')}
        >
          키워드
        </TabButton>
      </TabContainer>

      {currentTab === 'keyword' && (
        <KeywordRegistrationBanner>
          <div>알림 등록한 키워드 {keywordCount}개</div>
          <StyledButton onClick={KeywordSettingButtonClick}>
            키워드 설정
          </StyledButton>
        </KeywordRegistrationBanner>
      )}

      {currentTab === 'topic' ? (
        <NotificationList
          key="topic"
          apiUrl={`${process.env.REACT_APP_BE_URL}/api/notification/topic`}
        />
      ) : (
        <NotificationList
          key="keyword"
          apiUrl={`${process.env.REACT_APP_BE_URL}/api/notification/keyword`}
        />
      )}
    </AppContainer>
  );
};

export default NotificationPage;
