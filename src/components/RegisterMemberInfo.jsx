import React, { useState } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import requestWithAccessToken from '../services/jwt/requestWithAccessToken';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
  background-color: #f8f8f8;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => (props.hasError ? 'red' : '#ddd')};
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px;
  color: #000;
  background-color: ${(props) => (props.readOnly ? '#f0f0f0' : 'transparent')};
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  &:disabled {
    background-color: transparent;
  }
`;

const SelectButton = styled.button`
  background-color: #0072ce;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #084a89;
  }
`;

const Label = styled.label`
  white-space: nowrap;
  font-size: 17px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
  margin: 5px 0 7px 0;
  font-weight: 600;
  flex-grow: 1;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#0072CE')};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#218838')};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  width: 90%;
  max-width: 600px;
  height: 80%;
  overflow-y: auto;
`;

const ModalHeaderTitle = styled.h1`
  color: #000;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const Error = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  color: red;
  padding-left: 10px;
  font-size: 0.8em;
  min-height: 20px;
`;

const MenuItemInModal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f8;
  }
`;

const RegisterMajor = () => {
  const location = useLocation();
  const { email, name } = location.state || {};
  const [major, setMajor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const departmentList = [
    '간호학과',
    '건설시스템공학과',
    '건축학과',
    '경영인텔리전스학과',
    '경영학과',
    '경제학과',
    '경제정치사회융합학부',
    '교통시스템공학과',
    '국방디지털융합학과',
    '국어국문학과',
    '글로벌경영학과',
    '금융공학과',
    '기계공학과',
    '디지털미디어학과',
    '문화콘텐츠학과',
    '물리학과',
    '미래모빌리티공학과',
    '불어불문학과',
    '사이버보안학과',
    '사학과',
    '사회학과',
    '산업공학과',
    '생명과학과',
    '소프트웨어학과',
    '수학과',
    '스포츠레저학과',
    '심리학과',
    '약학과',
    '영어영문학과',
    '융합시스템공학과',
    '응용화학과',
    '응용화학생명공학과',
    '의학과',
    '인공지능융합학과',
    '자유전공학부',
    '전자공학과',
    '정치외교학과',
    '지능형반도체공학과',
    '첨단신소재공학과',
    '프런티어과학학부',
    '행정학과',
    '화학공학과',
    '화학과',
    '환경안전공학과',
  ];

  const handleMajorSubmit = async (e) => {
    e.preventDefault();

    if (!major) {
      setHasError(true);
      return;
    }

    try {
      console.log('email', email);
      await requestWithAccessToken(
        'post',
        `${process.env.REACT_APP_BE_URL}/api/users/register-info`,
        { major },
      );
      Swal.fire({
        icon: 'success',
        title: '학과 등록 성공',
        text: '구독 페이지로 이동합니다.',
      });

      // 학과 등록 이후 구독 페이지로 이동하면서 showGuide 전달
      navigate('/subscribe', { state: { showGuide: true } });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '등록 실패',
        text: '학과 등록 중 문제가 발생했습니다.',
      });
      console.error(error);
    }
  };

  const handleDepartmentSelect = (selectedMajor) => {
    setMajor(selectedMajor);
    setHasError(false);
    setShowModal(false);
  };

  return (
    <Container>
      <Title>학과 등록</Title>
      <Form onSubmit={handleMajorSubmit}>
        <Label>이메일</Label>
        <InputContainer>
          <Input
            type="email"
            value={email}
            readOnly
            placeholder="이메일"
            required
          />
        </InputContainer>

        <Label>이름</Label>
        <InputContainer>
          <Input
            type="text"
            value={name}
            readOnly
            placeholder="이름"
            required
          />
        </InputContainer>

        <LabelWrapper>
          <Label>소속</Label>
          {hasError && <Error>* 학과를 선택해주세요.</Error>}
        </LabelWrapper>
        <InputContainer hasError={hasError}>
          <Input type="text" value={major} placeholder="소속" disabled />
          <SelectButton type="button" onClick={() => setShowModal(true)}>
            선택하기
          </SelectButton>
        </InputContainer>

        <SubmitButton type="submit" disabled={!major}>
          등록
        </SubmitButton>
      </Form>

      {showModal && (
        <>
          <ModalOverlay onClick={() => setShowModal(false)} />
          <ModalContent>
            <ModalHeaderTitle>학과 선택</ModalHeaderTitle>
            {departmentList.map((dept) => (
              <MenuItemInModal
                key={dept}
                onClick={() => handleDepartmentSelect(dept)}
              >
                {dept}
              </MenuItemInModal>
            ))}
          </ModalContent>
        </>
      )}
    </Container>
  );
};

export default RegisterMajor;
