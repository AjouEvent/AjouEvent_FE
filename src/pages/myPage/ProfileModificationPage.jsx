import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constant/appConstants';
import NavigationBar from '../../components/NavigationBar';
import ProfileModification from '../../components/ProfileModification';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  width: 100vw;
  overflow-x: hidden;
`;

export default function ProfileModificationPage() {
  return (
    <AppContainer>
      <ProfileModification></ProfileModification>
      <NavigationBar></NavigationBar>
    </AppContainer>
  );
}
