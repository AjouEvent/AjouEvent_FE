import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { STORAGE_KEYS } from '../constants/appConstants';
import { resetTopicSubscriptions, resetKeywordSubscriptions } from '../services/api/subscription';
import { deleteUser } from '../services/api/user';
import { clearAuth } from '../utils/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: rgb(0, 102, 179);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;

  &:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 10px;
  margin: 20px 0;
`;

const DeleteAccountPage = () => {
  const [isTopicReset, setIsTopicReset] = useState(false);
  const [isKeywordReset, setIsKeywordReset] = useState(false);
  const [isLoadingTopic, setIsLoadingTopic] = useState(false); // 로딩 상태 추가
  const [isLoadingKeyword, setIsLoadingKeyword] = useState(false); // 로딩 상태 추가
  const [reason, setReason] = useState('');
  const [nextStep, setNextStep] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const handleTopicReset = async () => {
    setIsLoadingTopic(true); // 로딩 시작
    try {
      await resetTopicSubscriptions();
      setIsTopicReset(true);
      Swal.fire('성공', '구독한 토픽이 초기화되었습니다.', 'success');
    } catch (error) {
      Swal.fire('실패', '토픽 초기화에 실패했습니다.', 'error');
    } finally {
      setIsLoadingTopic(false); // 로딩 종료
    }
  };

  const handleKeywordReset = async () => {
    setIsLoadingKeyword(true); // 로딩 시작
    try {
      await resetKeywordSubscriptions();
      setIsKeywordReset(true);
      Swal.fire('성공', '구독한 키워드가 초기화되었습니다.', 'success');
    } catch (error) {
      Swal.fire('실패', '키워드 초기화에 실패했습니다.', 'error');
    } finally {
      setIsLoadingKeyword(false); // 로딩 종료
    }
  };

  const handleNextStep = () => {
    setNextStep(true);
  };

  const handleAccountDeletion = async () => {
    if (isTopicReset && isKeywordReset && reason) {
      try {
        await deleteUser();
        clearAuth();
        Swal.fire('탈퇴 완료', '정상적으로 탈퇴되었습니다.', 'success');
        navigate('/login'); // 탈퇴 후 로그인 페이지로 이동
      } catch (error) {
        Swal.fire('실패', '탈퇴에 실패했습니다.', 'error');
      }
    } else {
      Swal.fire('알림', '모든 조건을 충족해야 탈퇴할 수 있습니다.', 'warning');
    }
  };

  return (
    <Container>
      {!nextStep ? (
        <>
          <Message>정말 떠나시는 건가요?</Message>
          <Message>
            알림이 자주 온다면 필요없는 토픽, 키워드 구독을 해지해보시는 게
            어떤가요?
          </Message>
          <Button onClick={handleNextStep}>다음</Button>
        </>
      ) : (
        <>
          <Button
            onClick={handleTopicReset}
            disabled={isTopicReset || isLoadingTopic}
          >
            {isLoadingTopic
              ? '토픽 초기화 중...'
              : isTopicReset
                ? '토픽 초기화 완료'
                : '구독한 토픽 초기화'}
          </Button>
          <Button
            onClick={handleKeywordReset}
            disabled={isKeywordReset || isLoadingKeyword}
          >
            {isLoadingKeyword
              ? '키워드 초기화 중...'
              : isKeywordReset
                ? '키워드 초기화 완료'
                : '구독한 키워드 초기화'}
          </Button>

          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">탈퇴 사유를 선택하세요</option>
            <option value="알림이 너무 많음">알림이 너무 많음</option>
            <option value="사용 빈도가 낮음">사용 빈도가 낮음</option>
            <option value="기타">기타</option>
          </Select>

          <Button
            onClick={handleAccountDeletion}
            disabled={!isTopicReset || !isKeywordReset || !reason}
          >
            탈퇴하기
          </Button>
        </>
      )}
    </Container>
  );
};

export default DeleteAccountPage;
