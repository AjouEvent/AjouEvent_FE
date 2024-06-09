import React, { useState } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

const BannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 100vw;
  width: 100%;
`;

const CarouselItemImage = styled.img`
  width: 100%;
  height: 100vw;
  object-fit: contain;
  cursor: pointer; /* Add cursor pointer for indicating clickable */
`;

export default function HomeBanner({ images }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // 클릭 핸들러 추가
  const handleClick = (url) => {
    window.location.href = url;
  };

  return (
    <BannerContainer>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        controls={true}
        interval={null}
        touch={true}
        style={{ width: "100vw", height: "100vw" }}
      >
        {images.map((image, idx) => (
          <Carousel.Item key={idx} onClick={() => handleClick(image.url)}>
            <CarouselItemImage src={image.src} alt={`Slide ${idx + 1}`} />
          </Carousel.Item>
        ))}
      </Carousel>

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
    </BannerContainer>
  );
}
