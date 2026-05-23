import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { resetTopicSubscriptions, resetKeywordSubscriptions } from '../services/api/subscription';
import { deleteUser } from '../services/api/user';
import { clearAuth } from '../utils/auth';

const btnClass = (disabled) =>
  `px-5 py-2.5 text-white border-none rounded cursor-pointer m-2.5 transition-colors ${
    disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0066b3] hover:bg-[#004f8a]'
  }`;

const DeleteAccountPage = () => {
  const [isTopicReset, setIsTopicReset] = useState(false);
  const [isKeywordReset, setIsKeywordReset] = useState(false);
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [isLoadingKeyword, setIsLoadingKeyword] = useState(false);
  const [reason, setReason] = useState('');
  const [nextStep, setNextStep] = useState(false);
  const navigate = useNavigate();

  const handleTopicReset = async () => {
    setIsLoadingTopic(true);
    try {
      await resetTopicSubscriptions();
      setIsTopicReset(true);
      Swal.fire('성공', '구독한 토픽이 초기화되었습니다.', 'success');
    } catch (error) {
      Swal.fire('실패', '토픽 초기화에 실패했습니다.', 'error');
    } finally {
      setIsLoadingTopic(false);
    }
  };

  const handleKeywordReset = async () => {
    setIsLoadingKeyword(true);
    try {
      await resetKeywordSubscriptions();
      setIsKeywordReset(true);
      Swal.fire('성공', '구독한 키워드가 초기화되었습니다.', 'success');
    } catch (error) {
      Swal.fire('실패', '키워드 초기화에 실패했습니다.', 'error');
    } finally {
      setIsLoadingKeyword(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (isTopicReset && isKeywordReset && reason) {
      try {
        await deleteUser();
        clearAuth();
        Swal.fire('탈퇴 완료', '정상적으로 탈퇴되었습니다.', 'success');
        navigate('/login');
      } catch (error) {
        Swal.fire('실패', '탈퇴에 실패했습니다.', 'error');
      }
    } else {
      Swal.fire('알림', '모든 조건을 충족해야 탈퇴할 수 있습니다.', 'warning');
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      {!nextStep ? (
        <>
          <p className="text-xl mb-5">정말 떠나시는 건가요?</p>
          <p className="text-xl mb-5">알림이 자주 온다면 필요없는 토픽, 키워드 구독을 해지해보시는 게 어떤가요?</p>
          <button onClick={() => setNextStep(true)} className={btnClass(false)}>다음</button>
        </>
      ) : (
        <>
          <button
            onClick={handleTopicReset}
            disabled={isTopicReset || isLoadingTopic}
            className={btnClass(isTopicReset || isLoadingTopic)}
          >
            {isLoadingTopic ? '토픽 초기화 중...' : isTopicReset ? '토픽 초기화 완료' : '구독한 토픽 초기화'}
          </button>
          <button
            onClick={handleKeywordReset}
            disabled={isKeywordReset || isLoadingKeyword}
            className={btnClass(isKeywordReset || isLoadingKeyword)}
          >
            {isLoadingKeyword ? '키워드 초기화 중...' : isKeywordReset ? '키워드 초기화 완료' : '구독한 키워드 초기화'}
          </button>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="px-2.5 py-2.5 my-5 border border-[#cdcdcd] rounded text-sm"
          >
            <option value="">탈퇴 사유를 선택하세요</option>
            <option value="알림이 너무 많음">알림이 너무 많음</option>
            <option value="사용 빈도가 낮음">사용 빈도가 낮음</option>
            <option value="기타">기타</option>
          </select>
          <button
            onClick={handleAccountDeletion}
            disabled={!isTopicReset || !isKeywordReset || !reason}
            className={btnClass(!isTopicReset || !isKeywordReset || !reason)}
          >
            탈퇴하기
          </button>
        </>
      )}
    </div>
  );
};

export default DeleteAccountPage;
