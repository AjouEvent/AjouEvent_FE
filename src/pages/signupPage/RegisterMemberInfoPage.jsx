import React from 'react';
import styled from 'styled-components';
import NavigationBar from '../../components/NavigationBar';
import RegisterMemberInfo from '../../components/RegisterMemberInfo';
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

export default function RegisterMemberInfoPage() {
  return (
    <AppContainer>
      <RegisterMemberInfo></RegisterMemberInfo>
      <NavigationBar></NavigationBar>
    </AppContainer>
  );
}
