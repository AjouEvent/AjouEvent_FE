import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/appConstants';
import EventDetail from '../../components/events/EventDetail';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  height: 100vh;
  width: 100%;
`;

export default function EventDetailPage() {
  return (
    <AppContainer>
      <EventDetail></EventDetail>
    </AppContainer>
  );
}
