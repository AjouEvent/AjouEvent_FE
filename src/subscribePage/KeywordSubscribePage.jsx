import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import requestWithAccessToken from "../JWTToken/requestWithAccessToken";
import Swal from "sweetalert2";
import Inko from 'inko'; // 한타를 영어로 변환해주는 라이브러리

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  height: 100vh;
`;

const MainContentContaioner = styled.div`
  display: flex;
  width: 100%;
  overflow-x: hidden;
  align-items: center;
  flex-direction: column;
  padding: 0 20px 80px 20px;
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
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
`;

const TemporaryContaioner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ffffff;
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
  border: 1px solid #ddd;
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
  border-bottom: 1px solid #ddd;
`;

const KeywordItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
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
  border: 2px solid #f7f7f7;
  background-color: #ffffff;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? '#e0e0e0' : '#ffffff')};
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

const ModalHeaderTitle = styled.h1`
  color: #000;
  font-family: "Pretendard Variable";
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
  font-family: "Pretendard Variable";
  font-weight: 600;
`;

const CategoryTitle = styled.h2`
  font-family: "Pretendard Variable";
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

const TopicButton = styled.button`
  background-color: ${(props) => (props.isSelected ? '#d3d3d3' : '#ffffff')};
  border: 1px solid #ccc;
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
  color: #333;
`;

const Toast = Swal.mixin({
  toast: true,
  position: "center-center",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default function KeywordSubscribePage() {
  const accessToken = localStorage.getItem("accessToken");
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

  // 뒤로가기 클릭 시 구독 페이지로 이동
  const arrowBackClicked = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/subscribe");
    }
  };

  // 입력값 변화 처리
  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // 한글 입력 검사 및 에러 메시지 설정
    const koreanPattern = /^[가-힣]+$/;
    if (!koreanPattern.test(value)) {
      setErrorMessage('한글만 입력해주세요');
    } else if (value.length === 0) {
      setErrorMessage('');
    } else if (value.length < 2) {
      setErrorMessage('한 글자 이상 입력해주세요');
    }
  };

  // 구독 버튼 클릭 시
  const handleClick = async () => {
    const koreanPattern = /^[가-힣]+$/;

    // 한글 그대로 출력
    var inko = new Inko();
    var ko2en = inko.ko2en(inputValue)

    console.log('한글 그대로:', inputValue);
    // 한글을 영타로 변환하여 출력
    console.log('영타로 변환:', ko2en);

    // 토픽이 선택되지 않은 경우
    if (!selectedTopic) {
      Swal.fire({
        icon: 'warning',
        title: '게시판 선택',
        text: '키워드를 구독하기 전에 게시판을 선택해 주세요.',
      });
      return;
    }


    if (inputValue.length <= 1 || !koreanPattern.test(inputValue)) {
      Swal.fire({
        icon: 'error',
        title: '입력 오류',
        text: '1글자 이상, 한글만 입력해주세요',
      });
      setInputValue(''); // 입력값 초기화
      return;
    }

    setIsProcessing(true);
    try {
      // 한글을 영타로 변환
      const inko = new Inko();
      const englishKeyword = inko.ko2en(inputValue);

      Toast.fire({
        icon: "info",
        title: `키워드 '${inputValue}' 구독 중`,
      });

      console.log('구독하는 Topic:', selectedTopic)
      console.log('백엔드로 보내는 TopicName', selectedTopic.englishTopic )

      await requestWithAccessToken(
        "post",
        `${process.env.REACT_APP_BE_URL}/api/keyword/subscribe`,
        { englishKeyword: englishKeyword, 
          koreanKeyword: inputValue, 
          topicName: selectedTopic.englishTopic }
      );

      Swal.fire({
        icon: "success",
        title: "구독 성공",
        text: `${inputValue}를 구독하셨습니다`,
      });

      // 구독 성공 후, 최신 키워드 리스트를 불러옵니다.
      await fetchUserKeywords();

      // 구독된 키워드를 바로 리스트에 추가하는 대신, fetchUserKeywords에서 가져온 최신 데이터를 사용합니다.
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "구독 실패",
        text: "서버 에러",
      });
      console.error("Error subscribing to keyword:", error);
    } finally {
      setInputValue(''); // 입력값 초기화
      setIsProcessing(false);
    }
  };

  // useEffect 안에 있던 fetchUserKeywords를 밖으로 빼서 다른 곳에서도 호출할 수 있도록 수정합니다.
  const fetchUserKeywords = async () => {
    try {
      const response = await requestWithAccessToken(
        "get",
        `${process.env.REACT_APP_BE_URL}/api/keyword/userKeywords`
      );
      const userKeywords = response.data;
      setKeywords(userKeywords); 
    } catch (error) {
      console.error("Error fetching user keywords:", error);
    }
  };

  // 키워드 구독 취소
  const handleDeleteKeyword =  async (keyword) => {
    if (isProcessing) return;

    setIsProcessing(true);

    console.log('구독 취소하는 키워드:', keyword.englishKeyword)

    try {
      Toast.fire({
        icon: "info",
        title: `${keyword.koreanKeyword} 구독 취소 중`,
      });

      await requestWithAccessToken(
        "post",
        `${process.env.REACT_APP_BE_URL}/api/keyword/unsubscribe`,
        { englishKeyword: keyword.englishKeyword }
      );

      Swal.fire({
        icon: "success",
        title: "구독 취소 성공",
        text: `${keyword.koreanKeyword}를 구독 취소하셨습니다`,
      });

      setKeywords(prevKeywords =>
        prevKeywords.filter(item => item.englishKeyword !== keyword.englishKeyword)
      );

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "구독 실패",
        text: "서버 에러",
      });
      console.error("Error unsubscribing from topic:", error);
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
        const response = await requestWithAccessToken(
          "get",
          `${process.env.REACT_APP_BE_URL}/api/topic/subscriptionsStatus`
        );
        const datas = response.data;
        setMenuItems(datas);
      } catch (error) {
        console.error("Error fetching menu items:", error);
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
      테스트: [] // 실제 배포할 때는 빼기
    };

    items.forEach(item => {
      if (categories[item.classification]) {
        categories[item.classification].push(item);
      }
    });

    // Sort each category by koreanOrder
    Object.keys(categories).forEach(category => {
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
              <ViewAllButton isSelected={true} onClick={() => setShowModal(true)}>
              <ViewAllIcon src={`${process.env.PUBLIC_URL}/icons/gear.svg`} />
              <p>{selectedTopic ? selectedTopic.koreanTopic : '게시판 선택'}</p>
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
            {errorMessage && <div>{errorMessage}</div>}
            <KeywordHeader>
              알림 설정한 키워드 {keywords.length} / 10
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
                  <DeleteIcon onClick={() => handleDeleteKeyword(item)}>🗑️</DeleteIcon>
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
          <StyledLink bgcolor={"white"} color={"black"} to="/login">
            로그인
          </StyledLink>
        </TemporaryContaioner>
      )}
      <NavigationBar />
    </AppContainer>
  );
}
