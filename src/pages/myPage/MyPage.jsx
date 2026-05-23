import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import LocationBar from '../../components/LocationBar';
import { clearAuth } from '../../utils/auth';
import { getUserInfo } from '../../services/api/user';
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

  const handleLogoutBtnClick = () => {
    Swal.fire({ icon: 'success', title: '로그아웃 성공', text: '로그아웃 했습니다.' });
    clearAuth();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white h-screen overflow-y-hidden w-screen overflow-x-hidden">
      <div className="flex flex-col w-full h-full text-center">
        <LocationBar location="마이페이지" />
        <div className="flex flex-col justify-start items-start px-10 pt-5 pb-2.5 border-t border-black/[0.08]">
          <h3 className="mb-6">회원정보</h3>
          <p className="m-0 mb-1">이름: {user.name}</p>
          <p className="m-0 mb-1">전공: {user.major}</p>
          <p className="m-0 mb-1">이메일: {user.email}</p>
        </div>
        <div className="flex items-center justify-center w-full my-3">
          <Link
            onClick={handleLogoutBtnClick}
            to="/login"
            className="flex flex-wrap items-center justify-center bg-white rounded-lg p-2 border border-[#b8b8b8] w-[85%] text-gray-500 text-[0.8rem] no-underline text-center"
          >
            로그아웃
          </Link>
        </div>
        <ul className="list-none m-0 py-5 px-0">
          {[
            { label: '회원정보 수정', onClick: handleEditClick },
            { label: '자주묻는질문' },
            { label: '공지사항' },
            { label: '버전' },
            { label: '피드백 / 오류 제보', onClick: handleFeedBackClick },
          ].map(({ label, onClick }) => (
            <li
              key={label}
              onClick={onClick}
              className="border-b border-[#eee] px-5 py-2.5 text-base flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {label}
              <span className="text-base text-gray-400">›</span>
            </li>
          ))}
        </ul>
      </div>
      <NavigationBar />
    </div>
  );
};

export default MyPage;
