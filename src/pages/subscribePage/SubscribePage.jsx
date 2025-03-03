import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useStore from '../../store/useStore';
import NavigationBar from '../../components/NavigationBar';
import LocationBar from '../../components/LocationBar';
import SubscribeTab from './SubscribeTab';
import KeywordTab from './KeywordTab';

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  font-family: 'Pretendard Variable';
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100%;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 0 80px 0;
`;

const TemporaryContaioner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ffffff;
  height: 100vh;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bgcolor};
  border-radius: 0.5rem;
  border: 1px solid gray;
  width: 6rem;
  height: 1.4rem;
  color: ${(props) => props.color};
  font-size: 0.8rem;
  text-decoration: none;
  margin: 0 1rem 0 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Tab = styled.div`
  flex: 1;
  padding: 10px 20px;
  cursor: pointer;
  text-align: center;
  border-bottom: ${(props) =>
    props.active ? '2px solid #000' : '1px solid #ddd'};
  color: ${(props) => (props.active ? '#000' : '#333')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  transition: background-color 0.3s ease;
  position: relative;
`;

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 20px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
`;

const SubscribeContainer = styled.div`
  width: 100%;
`;

const GuideMessage = styled.div`
  width: 100%;
  padding: 12px;
  background-color: #f0f8ff;
  font-size: 13px;
  color: #0072ce;
  text-align: center;
  font-weight: 600;
  line-height: 1.5; /* 줄 간격 확보 */
  word-break: keep-all; /* 단어 단위로 줄바꿈 */
  white-space: normal; /* 강제 줄바꿈 허용 */

  @media (max-width: 375px) {  // iPhone SE 같은 작은 화면 대응
    font-size: 12px;
    padding: 8px;
  }

  @media (max-width: 320px) {  // 더 작은 화면일 때
    font-size: 11px;
    padding: 6px;
  }
`;

export default function SubscribePage() {
  const location = useLocation();
  const { subscribeItems, subscribedKeywords, fetchSubscribeItems, fetchSubscribedKeywords } = useStore();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'subscribe',
  );
  const [showGuide, setShowGuide] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  // 구독 아이템/키워드 변화 감지해 showGuide 판단
  useEffect(() => {
    if (activeTab === 'subscribe') {
      setShowGuide(subscribeItems.length === 0);
    } else if (activeTab === 'keyword') {
      setShowGuide(subscribedKeywords.length === 0);
    }
  }, [subscribeItems, subscribedKeywords, activeTab]);

  useEffect(() => {
    // fetchSubscribeItems();
    fetchSubscribedKeywords(); // 여기에서 가져와야 키워드 알림 탭의 뱃지를 보여줄 수 있음
  }, []);

  const handleTabClick = async (tabName) => {
    setActiveTab(tabName);
  };

  const getGuideMessage = (activeTab) => {
    if (activeTab === 'subscribe') {
      return (
        <>
          아직 구독한 항목이 없습니다.
          <br />
          아래의 <strong>⚙️ 구독 설정</strong>에서 관심있는 공지를 구독해보세요!
        </>
      );
    } else if (activeTab === 'keyword') {
      return (
        <>
          아직 구독한 키워드가 없습니다.
          <br />
          아래의 <strong>🔔 키워드 설정</strong>에서 관심있는 키워드를 구독해보세요!
        </>
      );
    } else {
      // 기본 메시지 (탭 선택 전이거나, 예외 상황 대비)
      return (
        <>
          아직 구독한 항목이 없습니다.
          <br />
          아래의 톱니바퀴/종 모양의 <strong>'설정'</strong>에서 관심있는 공지를 구독해보세요!
        </>
      );
    }
  };

  return (
    <AppContainer>
      {accessToken ? (
        <MainContentContaioner>
          <LocationBar location="구독" />
          {showGuide && (
            <GuideMessage>
              {getGuideMessage(activeTab)}
            </GuideMessage>
          )}
          <TabContainer>
              <Tab active={activeTab === 'subscribe'} 
                onClick={() => setActiveTab('subscribe')}>
                구독 알림
                {subscribeItems.some((item) => !item.isRead) && <Badge />}
              </Tab>

              <Tab active={activeTab === 'keyword'} 
                onClick={() => setActiveTab('keyword')}>
                키워드 알림
                {subscribedKeywords.some((item) => !item.isRead) && <Badge />}
              </Tab>
          </TabContainer>
          {activeTab === 'subscribe' && (
            <SubscribeContainer>
              <SubscribeTab showGuide={showGuide} />
            </SubscribeContainer>
          )}
          {activeTab === 'keyword' && (
            <SubscribeContainer>
              <KeywordTab showGuide={showGuide} />
            </SubscribeContainer>
          )}
        </MainContentContaioner>
      ) : (
        <TemporaryContaioner>
          <p>로그인이 필요한 서비스입니다</p>
          <StyledLink bgcolor={'white'} color={'black'} to="/login">
            로그인
          </StyledLink>
        </TemporaryContaioner>
      )}
      <NavigationBar />
    </AppContainer>
  );
}
