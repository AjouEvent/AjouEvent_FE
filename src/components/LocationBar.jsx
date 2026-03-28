import React from "react";
import styled from "styled-components";
import { COLORS } from '../constants/appConstants';

const LocationWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 26px 0px 26px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const LocationTitle = styled.h1`
  margin: 0 0 0 24px;
  color: ${COLORS.BLACK};
  font-family: "Pretendard Variable";
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.2px;
`;

const LocationBar = ({ location }) => {
  return (
    <LocationWrapper>
      <LocationTitle>{location}</LocationTitle>
    </LocationWrapper>
  );
};

export default LocationBar;
