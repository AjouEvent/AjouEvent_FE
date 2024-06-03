import React from "react";
import SignUp from "../components/SignUp";
import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";

const AppContaioner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  width: 100vw;
  overflow-x: hidden;
`;

export default function SignUpPage() {
  return (
    <AppContaioner>
      <SignUp></SignUp>
      <NavigationBar></NavigationBar>
    </AppContaioner>
  );
}
