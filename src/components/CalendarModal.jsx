import React, { useState } from 'react';
import styled from 'styled-components';
import requestWithAccessToken from '../services/jwt/requestWithAccessToken';
import Swal from 'sweetalert2';
import { Z_INDEX } from '../constant/appConstants';

const ModalBackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${Z_INDEX.CALENDAR};
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  h2 {
    margin: 8px 0 24px 0;
  }
`;

const Input = styled.input`
  font-family: 'Pretendard Variable';
  width: auto;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  font-family: 'Pretendard Variable';
  width: auto;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: -8px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  gap: 10px;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  gap: 10px;
  width: 100%;
`;

const Button = styled.button`
  width: 50%;
  font-family: 'Pretendard Variable';
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #b4b4b4;
`;

const SubmitButton = styled(Button)`
  background-color: #47bcff;
`;

const ResetButton = styled(Button)`
  background-color: #ff8181;
  padding: 0 6px;
  width: fit-content;
  margin-bottom: 4px;
  font-size: 0.7rem;
`;

const InputLabel = styled.p`
  font-family: 'Pretendard Variable';
  font-weight: 600;
  margin-bottom: 4px;
`;

function CalendarModal({ setIsModalOpen, title, content }) {
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 9);
  const formattedCurrentTime = currentTime.toISOString().slice(0, 16);

  const [summary, setSummary] = useState(title);
  const [description, setDescription] = useState(content.join('\n'));
  const [startDate, setStartDate] = useState(formattedCurrentTime);
  const [endDate, setEndDate] = useState(formattedCurrentTime);

  const [summaryError, setSummaryError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    let hasError = false;
    if (!summary.trim()) {
      setSummaryError('제목을 입력해 주세요');
      hasError = true;
    } else {
      setSummaryError('');
    }

    if (!description.trim()) {
      setDescriptionError('내용을 입력해 주세요');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (!startDate) {
      setStartDateError('시작 날짜를 선택해 주세요');
      hasError = true;
    } else {
      setStartDateError('');
    }

    if (!endDate) {
      setEndDateError('종료 날짜를 선택해 주세요');
      hasError = true;
    } else {
      setEndDateError('');
    }

    if (hasError) {
      return;
    }

    const formatDateTime = (datetime) => {
      if (datetime.includes(':')) {
        const [date, time] = datetime.split('T');
        const [hour, minute] = time.split(':');
        return `${date}T${hour}:${minute}:00`;
      }
      return `${datetime}:00`;
    };

    const eventData = {
      summary,
      description,
      startDate: formatDateTime(startDate) + '+09:00',
      endDate: formatDateTime(endDate) + '+09:00',
    };

    try {
      await requestWithAccessToken(
        'post',
        `${process.env.REACT_APP_BE_URL}/api/event/calendar`,
        eventData,
      );
      Swal.fire({
        icon: 'success',
        title: '구글 캘린더 등록 성공',
        text: '구글캘린더에 이벤트가 등록되었습니다.',
      });
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '구글 캘린더 등록 실패',
        text: '소셜로그인으로 로그인한 사용자만 이용가능한 서비스 입니다.',
      });
      console.error('There was an error submitting the event!', error);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (newEndDate < startDate) {
      setStartDate(newEndDate);
    }
  };

  const handleResetSummary = () => {
    setSummary('');
  };

  const handleResetDescription = () => {
    setDescription('');
  };

  return (
    <ModalBackgroundContainer>
      <ModalContainer>
        <h1>이벤트 캘린더 등록</h1>
        <ContentContainer>
          <InputLabel>제목</InputLabel>
          <ResetButton onClick={handleResetSummary}>초기화</ResetButton>
        </ContentContainer>
        <Input
          type="text"
          placeholder="제목을 입력해 주세요"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        {summaryError && <ErrorText>{summaryError}</ErrorText>}
        <ContentContainer>
          <InputLabel>내용</InputLabel>
          <ResetButton onClick={handleResetDescription}>초기화</ResetButton>
        </ContentContainer>
        <TextArea
          placeholder="내용을 입력해 주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {descriptionError && <ErrorText>{descriptionError}</ErrorText>}
        <InputLabel>시작 날짜</InputLabel>
        <Input
          type="datetime-local"
          placeholder="시작 날짜를 선택해 주세요"
          value={startDate}
          onChange={handleStartDateChange}
        />
        {startDateError && <ErrorText>{startDateError}</ErrorText>}
        <InputLabel>종료 날짜</InputLabel>
        <Input
          type="datetime-local"
          placeholder="종료 날짜를 선택해 주세요"
          value={endDate}
          onChange={handleEndDateChange}
        />
        {endDateError && <ErrorText>{endDateError}</ErrorText>}
        <ButtonContainer>
          <CancelButton onClick={handleCancel}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackgroundContainer>
  );
}

export default CalendarModal;
