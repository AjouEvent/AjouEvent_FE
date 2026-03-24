import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { STORAGE_KEYS } from '../constant/appConstants';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const TapWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 0px 16px 0px;
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
  font-style: normal;
  font-weight: 700;
`;

const Title = styled.h2`
  font-family: 'Pretendard Variable';
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  flex-grow: 1;
`;

const Separator = styled.div`
  display: block;
  margin: 10px auto 10px;
  text-align: center;
  height: 10px;
  position: relative;
  background: transparent;
  color: rgba(255, 255, 255);
  width: 95%;
  max-width: 680px;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0;
    background: rgba(120, 120, 120, 0.5);
    height: 1px;
    width: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 0;
    background: rgba(120, 120, 120, 0.5);
    height: 1px;
    width: 50%;
  }
`;

const Heading = styled.h1`
  color: #000000;
  font-size: 24px;
  font-weight: 700;
  text-align: left;
  width: 100%;
  margin-bottom: 20px;
`;

const InputLabel = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  flex-grow: 1;
  white-space: nowrap;
`;

const DeleteAccountLink = styled.span`
  font-family: 'Pretendard Variable';
  color: #0066b3;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    color: #333;
  }
`;

const ProfileModification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const user = state?.user;
  console.log('user', user);
  const email = user?.email;

  // 뒤로가기 클릭 시 마이페이지 페이지로 이동
  const arrowBackClicked = () => {
    navigate('/mypage');
  };

  const handleDeleteAccount = () => {
    navigate('/delete-account'); // "회원 탈퇴하기" 클릭 시 DeleteAccountPage로 이동
  };

  return (
    <ProfileContainer>
      <TapWrapper>
        <TapIcon
          onClick={arrowBackClicked}
          loading="lazy"
          src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
        />
        <TapTitle>마이페이지</TapTitle>
      </TapWrapper>
      <Title>회원정보 수정</Title>
      <Separator></Separator>
      <Heading>로그인 정보</Heading>
      <InputContainer>
        <InputLabel>아이디 (이메일)</InputLabel>
        <Input type="text" value={email} readOnly />
      </InputContainer>
      <DeleteAccountLink onClick={handleDeleteAccount}>
        회원 탈퇴하기
      </DeleteAccountLink>
    </ProfileContainer>
  );
};

export default ProfileModification;
