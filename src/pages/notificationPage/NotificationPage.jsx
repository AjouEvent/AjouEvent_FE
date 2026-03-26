import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TabBar from '../../components/TabBar';
import NotificationList from './NotificationList';
import api from '../../services/api';
import { COLORS } from '../../constant/appConstants';

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
  background-color: ${COLORS.BLUE_MEDIUM};
  color: ${COLORS.WHITE};
  padding: 4px 14px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Pretendard Variable', serif;
  font-weight: 500;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: ${COLORS.BLUE_DARK};
  }
`;

const MarkAllAsReadButton = styled.button`
  background-color: ${COLORS.BLUE_MEDIUM};
  color: ${COLORS.WHITE};
  padding: 4px 14px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Pretendard Variable', serif;
  font-weight: 500;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: ${COLORS.BLUE_DARK};
  }
`;

const NotificationPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('topic');
  const [keywordCount, setKeywordCount] = useState(0);
  const [notifications, setNotifications] = useState(0);

  // 키워드 개수 가져오기
  useEffect(() => {
    const fetchUserKeywords = async () => {
      try {
        const response = await api.get('/api/keyword/userKeywords');
        setKeywordCount(response.data.length);
      } catch (error) {
        console.error('Error fetching user keywords:', error);
      }
    };

    fetchUserKeywords();
  }, []);

  // 알림 모두 읽음 처리 함수 (백엔드 readAll API 호출)
  const readAllNotifications = async () => {
    if (!window.confirm('정말 모든 알림을 읽음 처리할까요?')) {
      return;
    }
    try {
      await api.post('/api/notification/readAll');
      alert('모든 알림을 읽음 처리했습니다.');
      setNotifications((prev) => prev + 1);
    } catch (error) {
      console.error('Error reading all notifications:', error);
      alert('알림 읽음 처리 중 오류가 발생했습니다.');
    }
  };

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
      <TabBar
        Title="알림"
        RightComponent={
          <MarkAllAsReadButton onClick={readAllNotifications}>
            모두 읽음
          </MarkAllAsReadButton>
        }
      />
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
          key={`topic-${notifications}`}
          apiUrl={`${process.env.REACT_APP_BE_URL}/api/notification/topic`}
        />
      ) : (
        <NotificationList
          key={`keyword-${notifications}`}
          apiUrl={`${process.env.REACT_APP_BE_URL}/api/notification/keyword`}
        />
      )}
    </AppContainer>
  );
};

export default NotificationPage;
