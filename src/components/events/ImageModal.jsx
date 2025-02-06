import React, { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  border-radius: 8px;
  overflow: auto;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain; 
  border-radius: 8px;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 7px;
  z-index: 10;
  filter: invert(70%);
`;

const NextButton = styled(ArrowButton)`
  right: 7px;
  z-index: 10;
  filter: invert(70%);
`;

function ImageModal({ images, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);
  const [startX, setStartX] = useState(0);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  // 터치 시작
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  // 터치 끝
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    // 왼쪽으로 스와이프한 경우 다음 이미지
    if (diffX > 50) {
      handleNext();
    }
    // 오른쪽으로 스와이프한 경우 이전 이미지
    else if (diffX < -50) {
      handlePrev();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image src={images[index]} alt={`Image ${index + 1}`} />
        {images.length > 1 && (
          <>
            <PrevButton onClick={handlePrev}>&lt;</PrevButton>
            <NextButton onClick={handleNext}>&gt;</NextButton>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default ImageModal;