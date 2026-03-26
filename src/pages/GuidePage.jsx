import React from 'react';
import styled from 'styled-components';
import TabBar from '../components/TabBar';
import { COLORS } from '../constants/appConstants';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  width: 100%;
  overflow: auto;
`;

export default function GuidePage() {
  return (
    <AppContainer>
      <TabBar Title={`사용 가이드 ver.0.1.3`} />
      <img
        alt="AndroidInstall"
        src={`${process.env.PUBLIC_URL}/image/installAndriod.svg`}
      ></img>
      <img
        alt="IOSInstall"
        src={`${process.env.PUBLIC_URL}/image/installIOS.svg`}
      ></img>
      <hr />
    </AppContainer>
  );
}
