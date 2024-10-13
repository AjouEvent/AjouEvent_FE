import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import LocationBar from "../components/LocationBar";
import SubscribeTab from "./SubscribeTab";
import KeywordTab from './KeywordTab';
import requestWithAccessToken from "../JWTToken/requestWithAccessToken"; // API 요청 함수

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
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
  border-bottom: ${(props) => (props.active ? "2px solid #000" : "1px solid #ddd")};
  color: ${(props) => (props.active ? "#000" : "#333")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: background-color 0.3s ease;
  position: relative;
`;

// 뱃지 스타일
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
  const [activeTab, setActiveTab] = useState("subscribe");
  const [isTopicUnread, setIsTopicUnread] = useState(false); // 구독 알림 읽음 상태
  const [isKeywordUnread, setIsKeywordUnread] = useState(false); // 키워드 알림 읽음 상태

  const accessToken = localStorage.getItem("accessToken");

  // fetchReadStatus 함수 정의
  const fetchReadStatus = async () => {
    try {
      const response = await requestWithAccessToken("get", `${process.env.REACT_APP_BE_URL}/api/users/readStatus`);
      console.log("받아 오는 상태:", response.data);
      // 서버 응답 상태 그대로 사용
      setIsTopicUnread(!response.data.isTopicTabRead);  // 구독 알림 읽음 상태 그대로 사용
      setIsKeywordUnread(!response.data.isKeywordTabRead);  // 키워드 알림 읽음 상태 그대로 사용
    } catch (error) {
      console.error("Error fetching read status", error);
    }
  };

  const updateSubscribedTabRead = async () => {
    try {
      await requestWithAccessToken("post", `${process.env.REACT_APP_BE_URL}/api/users/updateSubscribedTabRead`);
    } catch (error) {
      console.error("Error updating subscribed tab read status:", error);
      throw error;
    }
  };

  useEffect(() => {
    // 페이지 진입 시 읽음 상태 확인
    fetchReadStatus();
  }, []);


  // 구독 알림 상태 업데이트
  const updateTopicTabReadStatus = async () => {
    try {
      await requestWithAccessToken("post", `${process.env.REACT_APP_BE_URL}/api/users/updateTopicTabRead`);
    } catch (error) {
      console.error("구독 알림 상태 업데이트 중 오류:", error);
    }
  };

  // 키워드 알림 상태 업데이트
  const updateKeywordTabReadStatus = async () => {
    try {
      await requestWithAccessToken("post", `${process.env.REACT_APP_BE_URL}/api/users/updateKeywordTabRead`);
    } catch (error) {
      console.error("키워드 알림 상태 업데이트 중 오류:", error);
    }
  };

  // 구독 탭 클릭 시 상태 업데이트
  const handleTabClick = async (tabName) => {
    setActiveTab(tabName);
    if (tabName === "subscribe") {
      try {
      // 구독 알림 상태 업데이트
      await updateTopicTabReadStatus();
      const readStatus = await fetchReadStatus(); // 상태 갱신
      if (readStatus.isTopicTabRead && readStatus.isKeywordTabRead) {
        // 구독 탭 상태 업데이트
        await updateSubscribedTabRead();
      }
    } catch (error) {
      console.error("Error handling subscribe tab click:", error);
    }
    } else if (tabName === "keyword") {
      try {
      // 키워드 알림 상태 업데이트
      await updateKeywordTabReadStatus();
      const readStatus = await fetchReadStatus(); // 상태 갱신
      if (readStatus.isTopicTabRead && readStatus.isKeywordTabRead) {
        // 구독 탭 상태 업데이트
        await updateSubscribedTabRead();
      }
    } catch (error) {
      console.error("Error handling keyword tab click:", error);
    }
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchReadStatus(); // 구독 알림, 키워드 알림의 읽음 상태 가져오기
    }
  }, [accessToken]);

  return (
    <AppContainer>
      {accessToken ? (
        <MainContentContaioner>
          <LocationBar location="구독" />
          <TabContainer>
            <Tab active={activeTab === "subscribe"} onClick={() => handleTabClick("subscribe")}>
              구독 알림
              {isTopicUnread && <Badge />} {/* 읽지 않은 상태면 뱃지 표시 */}
            </Tab>
            <Tab active={activeTab === "keyword"} onClick={() => handleTabClick("keyword")}>
              키워드 알림
              {isKeywordUnread && <Badge />} {/* 읽지 않은 상태면 뱃지 표시 */}
            </Tab>
          </TabContainer>
          {activeTab === "subscribe" && (
            <SubscribeContainer>
              <SubscribeTab />
            </SubscribeContainer>
          )}
          {activeTab === "keyword" && (
            <SubscribeContainer>
              <KeywordTab />
            </SubscribeContainer>
          )}
        </MainContentContaioner>
      ) : (
        <TemporaryContaioner>
          <p>로그인이 필요한 서비스입니다</p>
          <StyledLink bgcolor={"white"} color={"black"} to="/login">
            로그인
          </StyledLink>
        </TemporaryContaioner>
      )}
      <NavigationBar />
    </AppContainer>
  );
}