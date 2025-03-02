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

export default function SubscribePage() {
  const location = useLocation();
  const { subscribeItems, subscribedKeywords, fetchSubscribeItems, fetchSubscribedKeywords } = useStore();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'subscribe',
  );

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    // fetchSubscribeItems();
    fetchSubscribedKeywords();
  }, []);

  const handleTabClick = async (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <AppContainer>
      {accessToken ? (
        <MainContentContaioner>
          <LocationBar location="구독" />
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
              <SubscribeTab />
            </SubscribeContainer>
          )}
          {activeTab === 'keyword' && (
            <SubscribeContainer>
              <KeywordTab />
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
