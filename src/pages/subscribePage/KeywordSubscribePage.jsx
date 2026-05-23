import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import Swal from 'sweetalert2';
import { getTopicSubscriptionsStatus, getUserKeywords, subscribeKeyword, unsubscribeKeyword } from '../../services/api/subscription';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import { LIMITS, STORAGE_KEYS } from '../../constants/appConstants';

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

const handleError = (error) => {
  const { status, data } = error;
  switch (status) {
    case 409: Swal.fire({ icon: 'error', title: '이미 구독한 키워드', text: data.statusMessage }); break;
    case 400: Swal.fire({ icon: 'error', title: '키워드 개수 초과', text: data.statusMessage }); break;
    case 404: Swal.fire({ icon: 'error', title: '찾을 수 없음', text: data.message || '찾을 수 없는 항목입니다.' }); break;
    case 500: Swal.fire({ icon: 'error', title: '서버 오류', text: data.message || '서버 오류가 발생했습니다.' }); break;
    default: Swal.fire({ icon: 'error', title: '오류', text: data.message || '알 수 없는 오류가 발생했습니다.' });
  }
};

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
  const [showModal, setShowModal] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const arrowBackClicked = () => navigate(-1);

  const handleChange = (event) => {
    let value = event.target.value.replace(/^\s+/, '');
    const pattern = /^[가-힣a-zA-Z\s]*$/;
    if (!pattern.test(value)) setErrorMessage('특수문자는 입력할 수 없습니다. 한글과 영어만 입력해 주세요.');
    else if (value.length === 0) setErrorMessage('');
    else if (value.length < LIMITS.MIN_KEYWORD_LENGTH) setErrorMessage('두 글자 이상 입력해 주세요.');
    else setErrorMessage('');
    setInputValue(value);
  };

  const handleClick = async () => {
    const pattern = /^[가-힣a-zA-Z\s]*$/;
    const finalInputValue = inputValue.trimEnd();
    if (!selectedTopic) {
      Swal.fire({ icon: 'warning', title: '게시판 선택', text: '키워드를 구독하기 전에 게시판을 선택해 주세요.' });
      return;
    }
    if (finalInputValue.length < LIMITS.MIN_KEYWORD_LENGTH || !pattern.test(inputValue)) {
      Swal.fire({ icon: 'error', title: '입력 오류', text: '2글자 이상, 한글만 입력해주세요' });
      setInputValue('');
      return;
    }
    setIsProcessing(true);
    try {
      Toast.fire({ icon: 'info', title: `키워드 '${finalInputValue}' 구독 중` });
      await subscribeKeyword(finalInputValue, selectedTopic.englishTopic);
      Swal.fire({ icon: 'success', title: '구독 성공', text: `${finalInputValue}를 구독하셨습니다` });
      fetchUserKeywords();
    } catch (error) {
      handleError(error.response);
    } finally {
      setInputValue('');
      setIsProcessing(false);
    }
  };

  const fetchUserKeywords = async () => {
    try {
      const response = await getUserKeywords();
      setKeywords(response.data);
      setSubscribedKeywords(response.data);
    } catch (error) {
      console.error('Error fetching user keywords:', error);
    }
  };

  const handleDeleteKeyword = async (keyword) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      Toast.fire({ icon: 'info', title: `${keyword.koreanKeyword} 구독 취소 중` });
      await unsubscribeKeyword(keyword.encodedKeyword);
      Swal.fire({ icon: 'success', title: '구독 취소 성공', text: `${keyword.koreanKeyword}를 구독 취소하셨습니다` });
      setKeywords((prev) => prev.filter((item) => item.encodedKeyword !== keyword.encodedKeyword));
    } catch (error) {
      Swal.fire({ icon: 'error', title: '구독 실패', text: '서버 에러' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(selectedTopic === topic ? null : topic);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await getTopicSubscriptionsStatus();
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
    fetchUserKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const categorizeAndSortItems = (items) => {
    const categories = { 학과: [], 단과대: [], 공지사항: [], 기숙사: [], 대학원: [] };
    items.forEach((item) => { if (categories[item.classification]) categories[item.classification].push(item); });
    Object.keys(categories).forEach((cat) => categories[cat].sort((a, b) => a.koreanOrder - b.koreanOrder));
    return categories;
  };

  const categorizedItems = categorizeAndSortItems(menuItems);

  return (
    <div className="flex items-center flex-col bg-white">
      {accessToken ? (
        <div className="flex w-full overflow-x-hidden items-center flex-col px-5 pb-20">
          <div className="w-full flex items-center py-4 gap-2">
            <img
              onClick={arrowBackClicked}
              loading="lazy"
              src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`}
              alt="뒤로가기"
              className="w-5 aspect-square object-contain cursor-pointer"
            />
            <div className="text-black text-lg font-bold">키워드 구독</div>
          </div>

          <div className="flex flex-col w-full mt-5">
            <div className="flex items-center justify-between border border-[#CDCDCD] rounded px-2.5 py-2.5 mb-5">
              <div
                onClick={() => setShowModal(true)}
                className="flex h-fit px-3 py-2 justify-center items-center gap-1 rounded-[600px] border-2 border-[#F5F5F5] bg-[#E0E0E0] cursor-pointer text-sm whitespace-nowrap"
              >
                <img src={`${process.env.PUBLIC_URL}/icons/gear.svg`} alt="gear" className="w-[18px] aspect-square object-cover" />
                <p className="m-0">{selectedTopic ? selectedTopic.koreanTopic : '게시판 선택'}</p>
              </div>
              <input
                value={inputValue}
                onChange={handleChange}
                placeholder="알림 받을 키워드를 입력해주세요."
                className="flex-1 border-none outline-none text-sm py-1 px-1 w-full"
                style={{ fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}
              />
              <button
                onClick={handleClick}
                disabled={isProcessing}
                className="bg-[#007bff] text-white border-none rounded-xl px-3.5 py-1.5 cursor-pointer"
                style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)' }}
              >
                구독
              </button>
            </div>
            {errorMessage && (
              <div className="flex justify-start w-full text-red-500 pl-5 text-[0.8em] mb-2">
                {errorMessage}
              </div>
            )}

            <div className="text-[1.4rem] font-bold mb-2.5 py-1 border-b border-[#CDCDCD]">
              알림 설정한 키워드 {keywords.length} / {LIMITS.MAX_KEYWORDS}
            </div>
            <div className="flex flex-col w-full">
              {keywords.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-[#F5F5F5] py-2.5">
                  <div className="flex flex-col">
                    <span className="text-base flex items-center whitespace-pre-wrap">
                      {item.koreanKeyword}
                      <span className="bg-[#f1f1f1] px-2.5 py-1 rounded-xl text-[0.9rem] ml-2">
                        {item.topicName}
                      </span>
                    </span>
                  </div>
                  <span onClick={() => handleDeleteKeyword(item)} className="cursor-pointer text-red-500">
                    🗑️
                  </span>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <>
              <div onClick={() => setShowModal(false)} className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000]" />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[10px] overflow-y-auto p-6 z-[1001] w-[90%] h-[80%]">
                <div className="w-full flex items-center pb-4 gap-2">
                  <img src={`${process.env.PUBLIC_URL}/icons/arrow_back.svg`} alt="back" className="w-5 aspect-square object-contain cursor-pointer" onClick={() => setShowModal(false)} />
                  <h1 className="text-black text-lg font-bold tracking-[-0.2px] m-0">전체 구독 항목</h1>
                </div>
                {Object.keys(categorizedItems).map((category) => (
                  <div key={category}>
                    <h2 className="text-3xl font-bold mt-10 pb-2.5 border-b border-[#E0E0E0] flex justify-between items-center cursor-pointer" onClick={() => handleCategoryClick(category)}>
                      {category}
                      <img src={openCategory === category ? `${process.env.PUBLIC_URL}/icons/arrow_down.svg` : `${process.env.PUBLIC_URL}/icons/arrow_right.svg`} alt="arrow" className="w-6 h-6" />
                    </h2>
                    {openCategory === category && categorizedItems[category].map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2.5 border-b border-[#E0E0E0] font-semibold">
                        <div>{item.koreanTopic}</div>
                        <button
                          onClick={() => handleTopicSelect(item)}
                          className={`border border-[#CDCDCD] rounded px-4 py-2 m-1 cursor-pointer ${selectedTopic === item ? 'bg-[#d3d3d3]' : 'bg-white'}`}
                          style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)' }}
                        >
                          {selectedTopic === item ? '선택 해제' : '선택'}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col bg-white h-screen">
          <p>로그인이 필요한 서비스입니다</p>
          <Link to="/login" className="flex flex-wrap items-center justify-center bg-white rounded-lg border border-gray-400 w-24 h-[1.4rem] text-black text-sm no-underline mx-4">
            로그인
          </Link>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
