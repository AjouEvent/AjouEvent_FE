import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TapWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우 양 끝으로 배치 */
  padding: 16px 24px;
  gap: 8px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TapIcon = styled.img`
  aspect-ratio: 1;
  width: 20px;
  object-fit: contain;
  object-position: center;
  cursor: pointer;
`;

const TapTitle = styled.div`
  color: #000;
  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-weight: 700;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const TabBar = ({ Title, RightComponent }) => {
  const navigate = useNavigate();

  const arrowBackClicked = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/event');
    }
  };

  return (
    <TapWrapper>
      <LeftSection>
        <TapIcon
          onClick={arrowBackClicked}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
        />
        <TapTitle>{Title}</TapTitle>
      </LeftSection>
      <RightSection>{RightComponent}</RightSection>
    </TapWrapper>
  );
};

export default TabBar;