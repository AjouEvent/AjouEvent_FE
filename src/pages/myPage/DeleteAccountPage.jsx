import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { resetTopicSubscriptions, resetKeywordSubscriptions } from '../../services/api/subscription';
import { deleteUser } from '../../services/api/user';
import { clearAuth } from '../../utils/auth';
import NavigationBar from '../../components/layout/NavigationBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export default function DeleteAccountPage() {
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
      toast.success('성공', { description: '구독한 토픽이 초기화되었습니다.' });
    } catch (error) {
      toast.error('실패', { description: '토픽 초기화에 실패했습니다.' });
    } finally {
      setIsLoadingTopic(false);
    }
  };

  const handleKeywordReset = async () => {
    setIsLoadingKeyword(true);
    try {
      await resetKeywordSubscriptions();
      setIsKeywordReset(true);
      toast.success('성공', { description: '구독한 키워드가 초기화되었습니다.' });
    } catch (error) {
      toast.error('실패', { description: '키워드 초기화에 실패했습니다.' });
    } finally {
      setIsLoadingKeyword(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (isTopicReset && isKeywordReset && reason) {
      try {
        await deleteUser();
        clearAuth();
        toast.success('탈퇴 완료', { description: '정상적으로 탈퇴되었습니다.' });
        navigate('/login');
      } catch (error) {
        toast.error('실패', { description: '탈퇴에 실패했습니다.' });
      }
    } else {
      toast.warning('알림', { description: '모든 조건을 충족해야 탈퇴할 수 있습니다.' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white overflow-x-hidden">
      <div className="flex flex-col min-h-screen justify-center bg-white px-5 pt-4">
        {!nextStep ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-[#191F28] text-xl font-bold tracking-tight m-0">정말 떠나시는 건가요?</h2>
            <p className="text-[#6B7684] text-sm leading-relaxed m-0">
              알림이 자주 온다면 필요없는 토픽, 키워드 구독을 해지해보시는 게 어떤가요?
            </p>
            <button
              onClick={() => setNextStep(true)}
              className="w-full h-14 bg-[#3182F6] hover:bg-[#1B6EE8] text-white rounded-xl font-bold text-base border-none cursor-pointer transition-colors mt-20"
            >
              다음
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <h2 className="text-[#191F28] text-xl font-bold tracking-tight m-0">탈퇴 절차</h2>
            <p className="text-[#6B7684] text-sm leading-relaxed m-0">
              탈퇴 전 구독 중인 토픽과 키워드를 초기화하고, 탈퇴 사유를 선택해주세요.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleTopicReset}
                disabled={isTopicReset || isLoadingTopic}
                className={`w-full h-12 rounded-xl font-semibold text-sm border-none cursor-pointer transition-colors ${
                  isTopicReset
                    ? 'bg-[#F2F4F6] text-[#B0B8C1] cursor-not-allowed'
                    : isLoadingTopic
                    ? 'bg-[#E5E8EB] text-[#6B7684] cursor-not-allowed'
                    : 'bg-[#EBF4FE] text-[#3182F6] hover:bg-[#D6ECFE]'
                }`}
              >
                {isLoadingTopic ? '토픽 초기화 중...' : isTopicReset ? '✓ 토픽 초기화 완료' : '구독한 토픽 초기화'}
              </button>

              <button
                onClick={handleKeywordReset}
                disabled={isKeywordReset || isLoadingKeyword}
                className={`w-full h-12 rounded-xl font-semibold text-sm border-none cursor-pointer transition-colors ${
                  isKeywordReset
                    ? 'bg-[#F2F4F6] text-[#B0B8C1] cursor-not-allowed'
                    : isLoadingKeyword
                    ? 'bg-[#E5E8EB] text-[#6B7684] cursor-not-allowed'
                    : 'bg-[#EBF4FE] text-[#3182F6] hover:bg-[#D6ECFE]'
                }`}
              >
                {isLoadingKeyword ? '키워드 초기화 중...' : isKeywordReset ? '✓ 키워드 초기화 완료' : '구독한 키워드 초기화'}
              </button>

              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="탈퇴 사유를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="알림이 너무 많음">알림이 너무 많음</SelectItem>
                  <SelectItem value="사용 빈도가 낮음">사용 빈도가 낮음</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={handleAccountDeletion}
              disabled={!isTopicReset || !isKeywordReset || !reason}
              className={`w-full h-14 rounded-xl font-bold text-base border-none cursor-pointer transition-colors mt-10 ${
                !isTopicReset || !isKeywordReset || !reason
                  ? 'bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed'
                  : 'bg-[#F04452] hover:bg-[#D93746] text-white'
              }`}
            >
              탈퇴하기
            </button>
          </div>
        )}
      </div>
      <NavigationBar />
    </div>
  );
}
