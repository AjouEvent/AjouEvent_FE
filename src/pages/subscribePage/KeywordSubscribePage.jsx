import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/layout/NavigationBar';
import Swal from 'sweetalert2';
import { getTopicSubscriptionsStatus, getUserKeywords, subscribeKeyword, unsubscribeKeyword } from '../../services/api/subscription';
import useSubscriptionStore from '../../store/useSubscriptionStore';
import { LIMITS, STORAGE_KEYS } from '../../constants/appConstants';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { ArrowLeft, Settings, Trash2, ChevronDown } from 'lucide-react';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [closingCategory, setClosingCategory] = useState(null);
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
      setSelectedTopic(null);
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
    setSelectedTopic(selectedTopic?.id === topic.id ? null : topic);
    setDialogOpen(false);
  };

  useEffect(() => {
    fetchUserKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (category) => {
    if (openCategory === category) {
      setClosingCategory(category);
      setTimeout(() => {
        setOpenCategory(null);
        setClosingCategory(null);
      }, 150);
    } else {
      setOpenCategory(category);
    }
  };

  const handleDialogOpenChange = async (open) => {
    if (open) {
      try {
        const response = await getTopicSubscriptionsStatus();
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    }
    setDialogOpen(open);
  };

  const categorizeAndSortItems = (items) => {
    const categories = { 학과: [], 단과대: [], 공지사항: [], 기숙사: [], 대학원: [] };
    items.forEach((item) => { if (categories[item.classification]) categories[item.classification].push(item); });
    Object.keys(categories).forEach((cat) => categories[cat].sort((a, b) => a.koreanOrder - b.koreanOrder));
    return categories;
  };

  const categorizedItems = categorizeAndSortItems(menuItems);

  return (
    <div className="flex items-center flex-col bg-white min-h-screen">
      {accessToken ? (
        <div className="flex w-full overflow-x-hidden items-center flex-col px-5 pb-24">
          {/* 헤더 */}
          <div className="w-full flex items-center py-4 gap-2">
            <button onClick={arrowBackClicked} className="p-1 rounded-lg hover:bg-[#F2F4F6] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#333D4B]" />
            </button>
            <h1 className="text-[#191F28] text-lg font-bold">키워드 구독</h1>
          </div>

          <div className="flex flex-col w-full gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                  <DialogTrigger asChild>
                    <button
                      className={`flex h-9 px-3 justify-center items-center gap-1.5 rounded-full border cursor-pointer text-sm font-semibold whitespace-nowrap transition-colors ${
                        selectedTopic
                          ? 'bg-[#EBF4FE] border-[#3182F6] text-[#3182F6]'
                          : 'border-[#E5E8EB] bg-[#F2F4F6] text-[#333D4B] hover:bg-[#E5E8EB]'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-[#6B7684]" />
                      <span>{selectedTopic ? selectedTopic.koreanTopic : '게시판 선택'}</span>
                    </button>
                  </DialogTrigger>

                  <DialogContent className="h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                    <DialogHeader className="px-5 py-4 border-b border-[#F0F2F5] flex-shrink-0">
                      <DialogTitle className="text-[#191F28] text-lg font-bold tracking-tight">
                        게시판 선택
                      </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="flex-1">
                      <div className="px-5 py-2">
                        {Object.keys(categorizedItems).map((category) => (
                          <div key={category} className="mb-1">
                            <button
                              className="w-full text-left text-base font-bold py-3.5 border-b border-[#E5E8EB] flex justify-between items-center cursor-pointer bg-transparent text-[#191F28]"
                              onClick={() => handleCategoryClick(category)}
                            >
                              <span>{category}</span>
                              <ChevronDown className={`w-5 h-5 text-[#8B95A1] transition-transform duration-200 ${
                                openCategory === category ? 'rotate-0' : '-rotate-90'
                              }`} />
                            </button>
                            {(openCategory === category || closingCategory === category) && (
                              <div className={closingCategory === category ? 'animate-accordion-up' : 'animate-accordion-down'}>
                                {categorizedItems[category].map((item) => {
                                  const isSelected = selectedTopic?.id === item.id;
                                  return (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center py-3 border-b border-[#F2F4F6]"
                                    >
                                      <span className="text-[#333D4B] text-sm font-medium">{item.koreanTopic}</span>
                                      <button
                                        onClick={() => handleTopicSelect(item)}
                                        className={`px-4 py-2 text-xs font-semibold rounded-xl border-none cursor-pointer transition-colors ${
                                          isSelected
                                            ? 'bg-[#EBF4FE] text-[#3182F6] hover:bg-[#D6ECFE]'
                                            : 'bg-[#3182F6] text-white hover:bg-[#1B6EE8]'
                                        }`}
                                      >
                                        {isSelected ? '선택 해제' : '선택'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                <Input
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="알림 받을 키워드를 입력해주세요."
                  className="flex-1 h-10 text-sm"
                />
                <Button
                  onClick={handleClick}
                  disabled={isProcessing}
                  size="sm"
                  className="shrink-0 rounded-xl h-10"
                >
                  구독
                </Button>
              </div>
              {errorMessage && (
                <p className="text-xs text-[#F04452] pl-1">{errorMessage}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b border-[#E5E8EB]">
                <span className="text-base font-bold text-[#191F28]">알림 설정한 키워드</span>
                <Badge variant="outline" className="text-xs">
                  {keywords.length} / {LIMITS.MAX_KEYWORDS}
                </Badge>
              </div>

              {keywords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#B0B8C1]">
                  <p className="text-sm">구독한 키워드가 없습니다.</p>
                  <p className="text-xs">게시판을 선택하고 키워드를 추가해보세요.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  {keywords.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#F8F9FA] rounded-xl px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-[#191F28]">{item.koreanKeyword}</span>
                        <Badge variant="secondary" className="w-fit text-xs">{item.topicName}</Badge>
                      </div>
                      <button
                        onClick={() => handleDeleteKeyword(item)}
                        disabled={isProcessing}
                        className="p-2 rounded-lg hover:bg-[#FFE8EA] transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-[#F04452]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col bg-white h-screen gap-3">
          <p className="text-sm text-[#6B7684]">로그인이 필요한 서비스입니다</p>
          <Link to="/login">
            <Button variant="outline" size="sm">로그인</Button>
          </Link>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
