import React, { useState } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import { COLORS } from '../constants/appConstants';

const BannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  width: 100%;
  height: 100vw;
`;

const CarouselItemImage = styled.img`
  width: 100%;
  height: 100vw;
  object-fit: contain;
  cursor: pointer; // 커서 스타일 추가
`;

const StyledCarouselControlPrevIcon = styled.span`
  filter: invert(50%);
`;

const StyledCarouselControlNextIcon = styled.span`
  filter: invert(50%);
`;

export default function EventBanner({ images, onImageClick }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <BannerContainer>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        controls={images.length > 1} // 이미지가 여러 개일 때만 화살표 표시
        interval={null}
        touch={true}
        style={{ width: "100vw", height: "100vw" }}
        prevIcon={
          images.length > 1 && (
            <StyledCarouselControlPrevIcon className="carousel-control-prev-icon" />
          )
        }
        nextIcon={
          images.length > 1 && (
            <StyledCarouselControlNextIcon className="carousel-control-next-icon" />
          )
        }
      >
        {images.map((src, idx) => (
          <Carousel.Item key={idx}>
            <CarouselItemImage
              src={src}
              alt={`Slide ${idx + 1}`}
              onClick={() => onImageClick(idx)}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {images.length > 1 && (
        <div className="carousel-indicators">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              className={index === idx ? "active" : ""}
              aria-current={index === idx ? "true" : undefined}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      )}
    </BannerContainer>
  );
}