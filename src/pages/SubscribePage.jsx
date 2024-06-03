import React, { useEffect } from "react";
import TopBar from "../components/TopBar";
import styled from "styled-components";
import EventMain from "../events/EventMain";
import NavigationBar from "../components/NavigationBar";
import GetUserPermission from "../fcm/GetUserPermission";
import SubscribeBar from "../components/SubscribeBar";

const AppContaioner = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  height: 100vh;
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100vw;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 80px 0 80px 0;
`;

export default function SubscribePage() {
  useEffect(() => {
    GetUserPermission();
  }, []);

  return (
    <AppContaioner>
      <MainContentContaioner>
        <SubscribeBar />
        <EventMain />
      </MainContentContaioner>
      <NavigationBar />
    </AppContaioner>
  );
}
