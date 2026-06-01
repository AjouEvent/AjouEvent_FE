import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBar from '../../components/layout/TabBar';
import NavigationBar from '../../components/layout/NavigationBar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { updateMember } from '../../services/api/user';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../../constants/appConstants';

export default function ProfileModificationPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  const [name, setName] = useState(user?.name || '');
  const [major, setMajor] = useState(user?.major || '');
  const [isLoading, setIsLoading] = useState(false);

  const arrowBackClicked = () => navigate('/mypage');
  const handleDeleteAccount = () => navigate('/delete-account');

  const isChanged =
    name.trim() !== (user?.name || '').trim() ||
    major.trim() !== (user?.major || '').trim();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.warning('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await updateMember({ name: name.trim(), major: major.trim() });
      localStorage.setItem(STORAGE_KEYS.NAME, name.trim());
      localStorage.setItem(STORAGE_KEYS.MAJOR, major.trim());
      toast.success('수정 완료', { description: '회원정보가 수정되었습니다.' });
      navigate('/mypage');
    } catch {
      toast.error('수정 실패', { description: '회원정보 수정에 실패했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-white h-screen overflow-x-hidden">
      <TabBar Title="회원정보 수정" onBack={arrowBackClicked} />
      <div className="flex flex-col w-full bg-white px-5 pt-4">

        <h3 className="text-[#191F28] text-base font-bold tracking-tight mb-4">로그인 정보</h3>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[#6B7684] text-xs font-semibold">아이디 (이메일)</label>
          <Input
            type="text"
            value={user?.email || ''}
            readOnly
            className="text-[#B0B8C1] cursor-default"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[#6B7684] text-xs font-semibold">이름</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-8">
          <label className="text-[#6B7684] text-xs font-semibold">학과</label>
          <Input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="학과를 입력해주세요"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!isChanged || isLoading}
          className="w-full mb-6"
        >
          {isLoading ? '저장 중...' : '저장하기'}
        </Button>

        <button
          onClick={handleDeleteAccount}
          className="text-[#F04452] text-sm font-medium bg-transparent border-none cursor-pointer text-right hover:text-[#D93746] transition-colors p-0"
        >
          회원 탈퇴하기
        </button>
      </div>
      <NavigationBar />
    </div>
  );
}
