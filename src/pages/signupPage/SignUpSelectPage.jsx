import React from 'react';
import SignUpSelect from '../../components/SingUpSelect';
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

export default function SignUpSelectPage() {
  return (
    <AppContainer>
      <SignUpSelect></SignUpSelect>
      <NavigationBar></NavigationBar>
    </AppContainer>
  );
}
