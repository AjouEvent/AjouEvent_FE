import React from 'react';
import styled from 'styled-components';
import NavigationBar from '../../components/NavigationBar';
import PrivacyAgreement from '../../components/PrivacyAgreement';
import { COLORS } from '../../constants/appConstants';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  width: 100vw;
  overflow-x: hidden;
`;

export default function PrivacyAgreementPage() {
  return (
    <AppContainer>
      <PrivacyAgreement />
      <NavigationBar></NavigationBar>
    </AppContainer>
  );
}
