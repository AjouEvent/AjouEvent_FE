import React from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import EventDetail from "../events/EventDetail";

const AppContaioner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 100vh;
  width: 100%;
`;

export default function HomePage() {
  return (
    <AppContaioner>
      <p>homepage</p>
      <NavigationBar></NavigationBar>
    </AppContaioner>
  );
}
