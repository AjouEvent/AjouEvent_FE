import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/layout/NavigationBar';
import LocationBar from '../../components/layout/LocationBar';
import { clearAuth } from '../../utils/auth';
import { getUserInfo, logout } from '../../services/api/user';
import Swal from 'sweetalert2';
import { STORAGE_KEYS } from '../../constants/appConstants';

const MyPage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, [accessToken, navigate]);

  const handleEditClick = () => navigate('/profile-modification', { state: { user } });

  const handleFeedBackClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSfSyN05EK3L9N7DMfQlpAnrebcuIGzadeANgELlGqrdlKeeqg/viewform',
      '_blank',
    );
  };

  const handleTeamInfoClick = () => {
    window.open(
      'https://frill-cactus-d3c.notion.site/ajouevent-com-1078a120218e80f78847e9b9b8cd330a?pvs=74',
      '_blank',
    );
  };

  const handleLogoutBtnClick = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch {
      // 서버 오류여도 클라이언트 측 인증 정보는 제거
    }
    clearAuth();
    Swal.fire({ icon: 'success', title: '로그아웃 성공', text: '로그아웃 했습니다.' });
    navigate('/login');
  };

  const menuItems = [
    { label: '회원정보 수정', onClick: handleEditClick },
    { label: '자주묻는질문' },
    { label: '공지사항' },
    { label: '버전' },
    { label: '피드백 / 오류 제보', onClick: handleFeedBackClick },
    { label: '팀소개', onClick: handleTeamInfoClick },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6F8] pb-20">
      <div className="flex bg-white">
        <LocationBar  location="프로필"  />
        <div className="flex items-center justify-end bg-white">
          <button
            onClick={handleLogoutBtnClick}
            className="flex items-center justify-center bg-[#F2F4F6] hover:bg-[#E5E8EB] active:bg-[#DDE0E5] rounded-xl px-3.5 py-2 text-[#6B7684] text-xs font-semibold transition-colors border-0 cursor-pointer"
            >
            로그아웃
          </button>
        </div>
      </div>

      <div className="bg-white px-5 pt-6 pb-5 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-[#3182F6] to-[#1B6EE8] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
              {user.name ? user.name[0] : '?'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#191F28] font-bold text-[17px] m-0 mb-0.5 tracking-tight">{user.name || '-'}</p>
            <p className="text-[#6B7684] text-sm m-0 mb-0.5 truncate">{user.major || '-'}</p>
            <p className="text-[#B0B8C1] text-xs m-0 truncate">{user.email || '-'}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 bg-white overflow-hidden border-t border-b border-[#F0F2F5]">
        <ul className="list-none m-0 p-0">
          {menuItems.map(({ label, onClick }, idx) => (
            <li
              key={label}
              onClick={onClick}
              className={`px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-[#FAFBFC] active:bg-[#F5F6F8] transition-colors ${
                idx < menuItems.length - 1 ? 'border-b border-[#F5F6F8]' : ''
              }`}
            >
              <span className="text-[#333D4B] text-sm font-medium">{label}</span>
              <span className="text-[#C5CDD6] text-lg font-light">›</span>
            </li>
          ))}
        </ul>
      </div>
      <NavigationBar />
    </div>
  );
};

export default MyPage;
