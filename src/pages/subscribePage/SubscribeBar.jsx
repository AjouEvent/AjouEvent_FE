import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useStore from '../../store/useStore';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import Swal from 'sweetalert2';
import SubscribeStatusDropdown from './SubscribeStatusDropdown'; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const MenuBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  background: #ffffff;
  padding: ${({ highlight }) => (highlight ? '18px 10px 18px 12px' : '12px 10px 0px 16px')};
  font-family: 'Pretendard Variable';
  font-weight: 600;
  box-sizing: border-box;
`;

const MenuItemContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MenuItem = styled.div`
  background-color: ${(props) => (props.isSelected ? '#0A5CA8' : '#ffffff')};
  color: ${(props) => (props.isSelected ? '#ffffff' : '#000000')};
  display: flex;
  height: fit-content;
  padding: 8px 12px;
  margin: 0 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 600px;
  border: 2px solid #f7f7f7;
  cursor: pointer;
`;

const ViewAllButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;  // 구독 설정과 툴팁 사이 여백
`;

const ViewAllButton = styled.div`
  display: flex;
  height: fit-content;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 600px;
  border: 2px solid #f7f7f7;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  box-sizing: border-box;
  animation: ${({ highlight }) => highlight ? glowAnimation : 'none'} 1.5s infinite;

  background-color: ${(props) =>
    props.isSelected ? '#e0e0e0' : '#ffffff'}; /* 항상 회색 유지 */
  p {
    margin: 0
`;

const InlineTooltip = styled.div`
  background-color: #0072ce;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  line-height: 1.4;
  display: ${({ show }) => (show ? 'block' : 'none')};
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ViewAllIcon = styled.img`
  width: 18px;
  aspect-ratio: 1;
  object-fit: cover;
`;

const ModalOverlay = styled.div`
  display: block;
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
  border-radius: 10px;
  overflow-y: auto;
  padding: 24px;
  z-index: 1001;
  width: 90%;
  height: 80%;
`;

const ModalHeaderIcon = styled.img`
  aspect-ratio: 1;
  width: 20px;
  object-fit: contain;
  object-position: center;
`;

const SubscribeButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #0072ce;
  color: #ffffff;
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  width: fit-content;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  gap: 8px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ModalHeaderTitle = styled.h1`
  color: #000;
  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.2px;
  margin: 0;
`;

const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 0 16px 0;
  gap: 8px;
`;

const MenuItemInModal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Pretendard Variable';
  font-weight: 600;
`;

const CategoryTitle = styled.h2`
  font-family: 'Pretendard Variable';
  font-size: 30px;
  font-weight: 700;
  margin-top: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const NotificationBadge = styled.div`
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  display: ${({ isRead }) => {
    return isRead === false ? 'inline-block' : 'none';
  }};
`;

const Toast = Swal.mixin({
  toast: true,
  position: 'center-center',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 8px rgba(0, 114, 206, 0.6); }
  50% { box-shadow: 0 0 15px rgba(0, 114, 206, 0.9); }
  100% { box-shadow: 0 0 8px rgba(0, 114, 206, 0.6); }
`;

const SubscribeBar = ({ onTopicSelect, showGuide }) => {
  const {
    isTopicTabRead,
    setIsTopicTabRead,
    markTopicAsRead,
    subscribeItems,
    fetchSubscribeItems,
  } = useStore();
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [ringingTopics, setRingingTopics] = useState({});

  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
      onTopicSelect(null);
    } else {
      setSelectedTopic(topic);
      onTopicSelect(topic);
    }

    // 클릭한 토픽의 읽음 상태를 업데이트
    markTopicAsRead(topic);
  };

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  // 구독 설정 데이터 불러오기 함수
  const fetchMenuItems = async () => {
    try {
      const response = await requestWithAccessToken(
        'get',
        `${process.env.REACT_APP_BE_URL}/api/topic/subscriptionsStatus`,
      );
      const datas = response.data;
      setMenuItems(datas);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  // 구독 설정 버튼 클릭 시 API 호출 및 모달 열기
  const handleShowModal = async () => {
    if (!showModal) {
      await fetchMenuItems(); // 메뉴 아이템을 불러옴
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    fetchSubscribeItems();
  }, [menuItems]);

  useEffect(() => {
    const allTopicsRead =
      subscribeItems.length > 0 &&
      subscribeItems.every((item) => item.isRead === true);

    // 모든 항목이 읽음 상태가 되었을 때만 isTopicTabRead를 업데이트
    if (allTopicsRead && !isTopicTabRead) {
      setIsTopicTabRead(true);
    } else if (!allTopicsRead && !isTopicTabRead) {
      // 읽지 않은 항목이 있는 경우, isTopicTabRead를 false로 설정
      setIsTopicTabRead(false);
    }
  }, [subscribeItems, isTopicTabRead]);

  const handleSubscribe = async (topic) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      Toast.fire({
        icon: 'info',
        title: `${topic.koreanTopic} 구독 중`,
      });

      await requestWithAccessToken(
        'post',
        `${process.env.REACT_APP_BE_URL}/api/topic/subscribe`,
        { topic: topic.englishTopic },
      );

      // 구독에 성공한 후 사용자가 구독하고 있는 항목을 새로 불러오기
      await fetchMenuItems();

      // 구독에 성공하면 isTopicTabRead를 false로 설정하여 읽지 않은 항목이 있음을 표시
      setIsTopicTabRead(false);

      // Swal.fire({
      //   icon: "success",
      //   title: "구독 성공",
      //   text: `${topic.koreanTopic}를 구독하셨습니다`,
      // });

      // 클릭한 토픽에만 애니메이션 효과 적용
      setRingingTopics((prevState) => ({
        ...prevState,
        [topic.id]: true, // 해당 토픽의 아이콘에 애니메이션 적용
      }));

      setTimeout(() => {
        setRingingTopics((prevState) => ({
          ...prevState,
          [topic.id]: false,
        }));
      }, 1000);

      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((item) =>
          item.koreanTopic === topic.koreanTopic
            ? { ...item, subscribed: true }
            : item,
        ),
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '구독 실패',
        text: '서버 에러',
      });
      console.error('Error subscribing to topic:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const categorizeAndSortItems = (items) => {
    const categories = {
      학과: [],
      단과대: [],
      공지사항: [],
      기숙사: [],
      대학원: [],
    };

    items.forEach((item) => {
      if (categories[item.classification]) {
        categories[item.classification].push(item);
      }
    });

    Object.keys(categories).forEach((category) => {
      categories[category].sort((a, b) => a.koreanOrder - b.koreanOrder);
    });

    return categories;
  };

  const categorizedItems = categorizeAndSortItems(menuItems);

  return (
    <Container>
      <MenuBarContainer highlight={showGuide}>
        <ViewAllButtonWrapper>
          <ViewAllButton isSelected={true} onClick={handleShowModal} highlight={showGuide}>
            <ViewAllIcon src={`${process.env.PUBLIC_URL}/icons/gear.svg`} />
            <p>구독 설정</p>
          </ViewAllButton>
          <InlineTooltip show={showGuide}>클릭해서 구독하기</InlineTooltip>
        </ViewAllButtonWrapper>

        <MenuItemContainer>
          {Array.isArray(subscribeItems) ? (
            subscribeItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleTopicClick(item.englishTopic)}
                isSelected={selectedTopic === item.englishTopic}
              >
                <span>{item.koreanTopic}</span>
                <NotificationBadge isRead={item.isRead} />
              </MenuItem>
            ))
          ) : (
            <p>구독 항목이 없습니다</p>
          )}
        </MenuItemContainer>
      </MenuBarContainer>

      {showModal && (
        <>
          <ModalOverlay onClick={() => setShowModal(false)} />
          <ModalContent>
            <ModalHeader>
              <ModalHeaderIcon
                src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
                onClick={() => setShowModal(false)}
              />
              <ModalHeaderTitle>전체 구독 항목</ModalHeaderTitle>
            </ModalHeader>

            {Object.keys(categorizedItems).map((category) => (
              <div key={category}>
                <CategoryTitle onClick={() => handleCategoryClick(category)}>
                  {category}
                  <img
                    src={
                      openCategory === category
                        ? `${process.env.PUBLIC_URL}/icons/arrow_down.svg`
                        : `${process.env.PUBLIC_URL}/icons/arrow_right.svg`
                    }
                    alt="arrow"
                    style={{ width: '24px', height: '24px' }}
                  />
                </CategoryTitle>

                {openCategory === category &&
                  categorizedItems[category].map((item) => (
                    <MenuItemInModal key={item.id}>
                      <div>{item.koreanTopic}</div>
                      <div>
                        {item.subscribed ? (
                          <SubscribeStatusDropdown
                            topic={item}
                            fetchMenuItems={fetchMenuItems}
                            ringing={ringingTopics[item.id]}
                          />
                        ) : (
                          <SubscribeButton onClick={() => handleSubscribe(item)}>
                            구독
                          </SubscribeButton>
                        )}
                      </div>
                    </MenuItemInModal>
                  ))}
              </div>
            ))}
          </ModalContent>
        </>
      )}
    </Container>
  );
};

export default SubscribeBar;