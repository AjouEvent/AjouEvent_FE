import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import Swal from 'sweetalert2';
import { getTopicSubscriptionsStatus, getUserKeywords, subscribeKeyword, unsubscribeKeyword } from '../../services/api/subscription';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import { COLORS, LIMITS, Z_INDEX, STORAGE_KEYS } from '../../constants/appConstants';

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100%;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 20px 80px 20px;
  font-family: 'Pretendard Variable';
`;

const TapWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 0px 16px 0px;
  gap: 8px;
`;

const TapIcon = styled.img`
  aspect-ratio: 1;
  width: 20px;
  object-fit: contain;
  object-position: center;
  cursor: pointer;
`;

const TapTitle = styled.div`
  color: ${COLORS.BLACK};
  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
`;

const TemporaryContaioner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  height: 100vh;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bgcolor};
  border-radius: 0.5rem;
  border: 1px solid gray;
  width: 6rem;
  height: 1.4rem;
  color: ${(props) => props.color};
  font-size: 0.8rem;
  text-decoration: none;
  margin: 0 1rem 0 1rem;
`;

const SubscribeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const SubscribeInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${COLORS.BORDER_GARY};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
`;

const SubscribeInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 5px;
  width: 100%;
  font-size: clamp(0.7rem, 2.5vw, 1rem); /* 글자 크기 조절 */
`;

const SubscribeButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 7px 15px;
  cursor: pointer;
  font-size: clamp(0.7rem, 2vw, 1rem); /* 글자 크기 조절 */
`;

const KeywordListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const KeywordHeader = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid ${COLORS.BORDER_GARY};
`;

const KeywordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${COLORS.OFF_WHITE};
  padding: 10px 0;
`;

const KeywordInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const KeywordText = styled.span`
  font-size: 1rem;
  display: flex;
  align-items: center;
  white-space: pre-wrap;
`;

const KeywordTag = styled.span`
  background-color: #f1f1f1;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-left: 8px;
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  color: red;
`;

const ViewAllButton = styled.div`
  display: flex;
  height: fit-content;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 600px;
  border: 2px solid ${COLORS.OFF_WHITE};
  background-color: ${COLORS.WHITE};
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? COLORS.LIGHT_GARY : COLORS.WHITE)};
  p {
    margin: 0;
    font-size: clamp(0.8rem, 2.5vw, 1rem); /* 글자 크기 조절 */
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
  z-index: ${Z_INDEX.MODAL};
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
  z-index: ${Z_INDEX.MODAL_TOP};
  width: 90%;
  height: 80%;
`;

const ModalHeaderIcon = styled.img`
  aspect-ratio: 1;
  width: 20px;
  object-fit: contain;
  object-position: center;
`;

const ModalHeaderTitle = styled.h1`
  color: ${COLORS.BLACK};
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
  border-bottom: 1px solid ${COLORS.LIGHT_GARY};
  font-family: 'Pretendard Variable';
  font-weight: 600;
`;

const CategoryTitle = styled.h2`
  font-family: 'Pretendard Variable';
  font-size: 30px;
  font-weight: 700;
  margin-top: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${COLORS.LIGHT_GARY};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const TopicButton = styled.button`
  background-color: ${(props) => (props.isSelected ? '#d3d3d3' : COLORS.WHITE)};
  border: 1px solid ${COLORS.BORDER_GARY};
  border-radius: 4px;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
  font-size: clamp(0.7rem, 2vw, 1rem); /* 글자 크기 조절 */
`;

const TopicDisplay = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f1f1f1;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: clamp(0.8rem, 2.5vw, 1rem); /* 글자 크기 조절 */
  color: ${COLORS.DARK_GARY_TEXT};
`;

const KeywordError = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
  color: red;
  padding-left: 20px;
  font-size: 0.8em;
`;

const handleError = (error) => {
  console.log('Error object:', error); // Error 객체 확인
  const { status, data } = error;

  console.log('Status:', status); // Status 확인
  console.log('StatusMessage:', data.statusMessage); // StatusMessage 확인
  console.log('Message:', data.message); // Message 확인

  switch (status) {
    case 409:
      Swal.fire({
        icon: 'error',
        title: '이미 구독한 키워드',
        text: data.statusMessage,
      });
      break;
    case 400:
      Swal.fire({
        icon: 'error',
        title: '키워드 개수 초과',
        text: data.statusMessage,
      });
      break;
    case 404:
      Swal.fire({
        icon: 'error',
        title: '찾을 수 없음',
        text: data.message || '찾을 수 없는 항목입니다.',
      });
      break;
    case 500:
      Swal.fire({
        icon: 'error',
        title: '서버 오류',
        text: data.message || '서버 오류가 발생했습니다.',
      });
      break;
    default:
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: data.message || '알 수 없는 오류가 발생했습니다.',
      });
  }
};

const Toast = Swal.mixin({
  toast: true,
  position: 'center-center',
  showConfirmButton: false,
  timer: LIMITS.TOAST_TIMER.MEDIUM,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export default function KeywordSubscribePage() {
  const { setSubscribedKeywords } = useSubscriptionStore((state) => ({
    setSubscribedKeywords: state.setSubscribedKeywords,
  }));
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 키워드 구독에서 Topic 선택
  const [showModal, setShowModal] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const arrowBackClicked = () => {
    // navigate('/subscribe', { state: { activeTab: 'keyword' } });
    navigate(-1);
  };

  // 입력값 변화 처리
  const handleChange = (event) => {
    let value = event.target.value;

    // 앞쪽 공백 제거
    value = value.replace(/^\s+/, '');

    // 한글, 영어, 공백만 입력 허용
    const koreanEnglishAndSpacePattern = /^[가-힣a-zA-Z\s]*$/;
    if (!koreanEnglishAndSpacePattern.test(value)) {
      setErrorMessage(
        '특수문자는 입력할 수 없습니다. 한글과 영어만 입력해 주세요.',
      );
    } else if (value.length === 0) {
      setErrorMessage('');
    } else if (value.length < LIMITS.MIN_KEYWORD_LENGTH) {
      setErrorMessage('두 글자 이상 입력해 주세요.');
    } else {
      setErrorMessage('');
    }

    setInputValue(value);
  };

  // 구독 버튼 클릭 시
  const handleClick = async () => {
    const koreanEnglishAndSpacePattern = /^[가-힣a-zA-Z\s]*$/;

    // 뒤 공백 제거
    const finalInputValue = inputValue.trimEnd();

    // 토픽이 선택되지 않은 경우
    if (!selectedTopic) {
      Swal.fire({
        icon: 'warning',
        title: '게시판 선택',
        text: '키워드를 구독하기 전에 게시판을 선택해 주세요.',
      });
      return;
    }

    if (
      finalInputValue.length < LIMITS.MIN_KEYWORD_LENGTH ||
      !koreanEnglishAndSpacePattern.test(inputValue)
    ) {
      Swal.fire({
        icon: 'error',
        title: '입력 오류',
        text: '2글자 이상, 한글만 입력해주세요',
      });
      setInputValue(''); // 입력값 초기화
      return;
    }

    setIsProcessing(true);
    try {
      Toast.fire({
        icon: 'info',
        title: `키워드 '${finalInputValue}' 구독 중`,
      });

      await subscribeKeyword(finalInputValue, selectedTopic.englishTopic);

      Swal.fire({
        icon: 'success',
        title: '구독 성공',
        text: `${finalInputValue}를 구독하셨습니다`,
      });

      fetchUserKeywords();
    } catch (error) {
      handleError(error.response);
      console.error('Error subscribing to keyword:', error);
    } finally {
      setInputValue(''); // 입력값 초기화
      setIsProcessing(false);
    }
  };

  const fetchUserKeywords = async () => {
    try {
      const response = await getUserKeywords();
      const userKeywords = response.data;
      setKeywords(userKeywords);
      setSubscribedKeywords(userKeywords);
    } catch (error) {
      console.error('Error fetching user keywords:', error);
    }
  };

  // 키워드 구독 취소
  const handleDeleteKeyword = async (keyword) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      Toast.fire({
        icon: 'info',
        title: `${keyword.koreanKeyword} 구독 취소 중`,
      });

      await unsubscribeKeyword(keyword.encodedKeyword);

      Swal.fire({
        icon: 'success',
        title: '구독 취소 성공',
        text: `${keyword.koreanKeyword}를 구독 취소하셨습니다`,
      });

      setKeywords((prevKeywords) =>
        prevKeywords.filter(
          (item) => item.encodedKeyword !== keyword.encodedKeyword,
        ),
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '구독 실패',
        text: '서버 에러',
      });
      console.error('Error unsubscribing from topic:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 키워드 구독시 topic 선택 창
  const handleTopicSelect = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
    }
    setShowModal(false);
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await getTopicSubscriptionsStatus();
        const datas = response.data;
        setMenuItems(datas);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
    fetchUserKeywords();
  }, []);

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
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

    // Sort each category by koreanOrder
    Object.keys(categories).forEach((category) => {
      categories[category].sort((a, b) => a.koreanOrder - b.koreanOrder);
    });

    return categories;
  };

  const categorizedItems = categorizeAndSortItems(menuItems);

  return (
    <AppContainer>
      {accessToken ? (
        <MainContentContaioner>
          <TapWrapper>
            <TapIcon
              onClick={arrowBackClicked}
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
            />
            <TapTitle>키워드 구독</TapTitle>
          </TapWrapper>
          <SubscribeContainer>
            <SubscribeInputContainer>
              <ViewAllButton
                isSelected={true}
                onClick={() => setShowModal(true)}
              >
                <ViewAllIcon src={`${process.env.PUBLIC_URL}/icons/gear.svg`} />
                <p>
                  {selectedTopic ? selectedTopic.koreanTopic : '게시판 선택'}
                </p>
              </ViewAllButton>
              <SubscribeInput
                value={inputValue}
                onChange={handleChange}
                placeholder="알림 받을 키워드를 입력해주세요."
              />
              <SubscribeButton onClick={handleClick} disabled={isProcessing}>
                구독
              </SubscribeButton>
            </SubscribeInputContainer>
            {errorMessage && <KeywordError>{errorMessage}</KeywordError>}
            <KeywordHeader>
              알림 설정한 키워드 {keywords.length} / {LIMITS.MAX_KEYWORDS}
            </KeywordHeader>
            <KeywordListContainer>
              {keywords.map((item, index) => (
                <KeywordItem key={index}>
                  <KeywordInfo>
                    <KeywordText>
                      {item.koreanKeyword}
                      <KeywordTag>{item.topicName}</KeywordTag>
                    </KeywordText>
                  </KeywordInfo>
                  <DeleteIcon onClick={() => handleDeleteKeyword(item)}>
                    🗑️
                  </DeleteIcon>
                </KeywordItem>
              ))}
            </KeywordListContainer>
          </SubscribeContainer>
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
                    <CategoryTitle
                      onClick={() => handleCategoryClick(category)}
                    >
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
                            <TopicButton
                              isSelected={selectedTopic === item}
                              onClick={() => handleTopicSelect(item)}
                            >
                              {selectedTopic === item ? '선택 해제' : '선택'}
                            </TopicButton>
                          </div>
                        </MenuItemInModal>
                      ))}
                  </div>
                ))}
              </ModalContent>
            </>
          )}
        </MainContentContaioner>
      ) : (
        <TemporaryContaioner>
          <p>로그인이 필요한 서비스입니다</p>
          <StyledLink bgcolor={'white'} color={'black'} to="/login">
            로그인
          </StyledLink>
        </TemporaryContaioner>
      )}
      <NavigationBar />
    </AppContainer>
  );
}