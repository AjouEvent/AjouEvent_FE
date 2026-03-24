import React from 'react';
import SignUp from '../../components/SignUp';
import styled from 'styled-components';
import NavigationBar from '../../components/NavigationBar';
import { COLORS } from '../../constants/colors';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  width: 100vw;
  overflow-x: hidden;
`;

export default function SignUpPage() {
  return (
    <AppContainer>
      <SignUp></SignUp>
      <NavigationBar></NavigationBar>
    </AppContainer>
  );
}
