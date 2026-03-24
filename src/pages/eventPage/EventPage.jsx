import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constant/appConstants';
import EventMain from '../events/EventMain';
import NavigationBar from '../../components/NavigationBar';
import SearchDropBox from '../../searchPage/SearchDropBox';
import SearchBar from '../searchPage/SearchBar';
import LocationBar from '../../components/LocationBar';

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  height: 100vh;
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100vw;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 0 80px 0;
`;

export default function EventPage() {
  return (
    <AppContainer>
      <MainContentContaioner>
        <LocationBar location="전체 이벤트 검색" />
        <SearchDropBox />
        <SearchBar />
        <EventMain />
      </MainContentContaioner>
      <NavigationBar />
    </AppContainer>
  );
}
