import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from '../../components/NavigationBar';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import LocationBar from '../../components/LocationBar';
import Swal from 'sweetalert2';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 100vh;
  overflow-y: hidden;
  width: 100vw;
  overflow-x: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  font-family: 'Pretendard Variable', serif;
  padding: 20px 40px 10px 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  h3 {
    margin-bottom: 1.6rem;
  }
`;

const LogoutBtnWapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 0.5rem;
  padding: 8px;
  border: 1px solid #b8b8b8;
  width: 85%;
  height: fit-content;
  color: gray;
  font-size: 0.8rem;
  text-decoration: none;
  text-align: center;
  font-family: 'Pretendard Variable';
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 20px 0;
`;

const MenuItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  font-family: 'Pretendard Variable', serif;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ArrowIcon = styled.span`
  font-size: 1rem;
  color: gray;
`;

const MyPage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await requestWithAccessToken(
          'get',
          `${process.env.REACT_APP_BE_URL}/api/users`,
        );
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [accessToken, navigate]);

  const handleEditClick = () => {
    navigate('/profile-modification', {
      state: {
        user,
      },
    });
  };

  const handleFrequentlyAskedQuestionsClick = () => {};

  const handleFeedBackClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSfSyN05EK3L9N7DMfQlpAnrebcuIGzadeANgELlGqrdlKeeqg/viewform',
      '_blank',
    );
  };

  const handleNofificationClick = () => {};

  const handleVersionClick = () => {};

  const handleLogoutBtnClick = () => {
    Swal.fire({
      icon: 'success',
      title: '로그아웃 성공',
      text: '로그아웃 했습니다.',
    });
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('major');
  };

  return (
    <AppContainer>
      <Container>
        <LocationBar location="마이페이지" />
        <UserInfo>
          <h3>회원정보</h3>
          <p>이름: {user.name}</p>
          <p>전공: {user.major}</p>
          <p>이메일: {user.email}</p>
        </UserInfo>
        <LogoutBtnWapper>
          <StyledLink onClick={handleLogoutBtnClick} to="/login">
            로그아웃
          </StyledLink>
        </LogoutBtnWapper>
        <MenuList>
          <MenuItem onClick={handleEditClick}>
            회원정보 수정 <ArrowIcon>›</ArrowIcon>
          </MenuItem>
          <MenuItem>
            자주묻는질문 <ArrowIcon>›</ArrowIcon>
          </MenuItem>
          <MenuItem>
            공지사항 <ArrowIcon>›</ArrowIcon>
          </MenuItem>
          <MenuItem>
            버전 <ArrowIcon>›</ArrowIcon>
          </MenuItem>
          <MenuItem>
            피드백 / 오류 제보
            <ArrowIcon onClick={handleFeedBackClick}>›</ArrowIcon>
          </MenuItem>
        </MenuList>
      </Container>
      <NavigationBar />
    </AppContainer>
  );
};

export default MyPage;
