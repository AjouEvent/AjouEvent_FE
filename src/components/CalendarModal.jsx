import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addEventToCalendar } from '../services/api/event';

function CalendarModal({ setIsModalOpen, title, content }) {
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 9);
  const formattedCurrentTime = currentTime.toISOString().slice(0, 16);

  const [summary, setSummary] = useState(title);
  const [description, setDescription] = useState(content.join('\n'));
  const [startDate, setStartDate] = useState(formattedCurrentTime);
  const [endDate, setEndDate] = useState(formattedCurrentTime);

  const [summaryError, setSummaryError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');

  const handleCancel = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    let hasError = false;
    if (!summary.trim()) { setSummaryError('제목을 입력해 주세요'); hasError = true; } else setSummaryError('');
    if (!description.trim()) { setDescriptionError('내용을 입력해 주세요'); hasError = true; } else setDescriptionError('');
    if (!startDate) { setStartDateError('시작 날짜를 선택해 주세요'); hasError = true; } else setStartDateError('');
    if (!endDate) { setEndDateError('종료 날짜를 선택해 주세요'); hasError = true; } else setEndDateError('');
    if (hasError) return;

    const formatDateTime = (datetime) => {
      if (datetime.includes(':')) {
        const [date, time] = datetime.split('T');
        const [hour, minute] = time.split(':');
        return `${date}T${hour}:${minute}:00`;
      }
      return `${datetime}:00`;
    };

    const eventData = {
      summary,
      description,
      startDate: formatDateTime(startDate) + '+09:00',
      endDate: formatDateTime(endDate) + '+09:00',
    };

    try {
      await addEventToCalendar(eventData);
      Swal.fire({ icon: 'success', title: '구글 캘린더 등록 성공', text: '구글캘린더에 이벤트가 등록되었습니다.' });
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: '구글 캘린더 등록 실패', text: '소셜로그인으로 로그인한 사용자만 이용가능한 서비스 입니다.' });
      console.error('There was an error submitting the event!', error);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate > endDate) setEndDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (newEndDate < startDate) setStartDate(newEndDate);
  };

  const inputClass = 'w-full px-2.5 py-2.5 mb-2.5 border border-[#cdcdcd] rounded text-sm outline-none focus:border-[#0066b3] transition-colors';
  const labelClass = 'font-semibold mb-1 text-sm';
  const errorClass = 'text-red-500 text-[0.8rem] -mt-2 mb-2.5';

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1200]">
      <div className="flex flex-col bg-white p-5 rounded-lg w-[80%] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <h1 className="text-xl font-bold mb-6">이벤트 캘린더 등록</h1>

        <div className="flex justify-between items-end mb-1">
          <p className={labelClass}>제목</p>
          <button
            onClick={() => setSummary('')}
            className="bg-red-400 text-white px-1.5 py-0 text-[0.7rem] rounded cursor-pointer border-none mb-1"
          >
            초기화
          </button>
        </div>
        <input
          type="text"
          placeholder="제목을 입력해 주세요"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={inputClass}
        />
        {summaryError && <p className={errorClass}>{summaryError}</p>}

        <div className="flex justify-between items-end mb-1">
          <p className={labelClass}>내용</p>
          <button
            onClick={() => setDescription('')}
            className="bg-red-400 text-white px-1.5 py-0 text-[0.7rem] rounded cursor-pointer border-none mb-1"
          >
            초기화
          </button>
        </div>
        <textarea
          placeholder="내용을 입력해 주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          rows={4}
        />
        {descriptionError && <p className={errorClass}>{descriptionError}</p>}

        <p className={labelClass}>시작 날짜</p>
        <input
          type="datetime-local"
          value={startDate}
          onChange={handleStartDateChange}
          className={inputClass}
        />
        {startDateError && <p className={errorClass}>{startDateError}</p>}

        <p className={labelClass}>종료 날짜</p>
        <input
          type="datetime-local"
          value={endDate}
          onChange={handleEndDateChange}
          className={inputClass}
        />
        {endDateError && <p className={errorClass}>{endDateError}</p>}

        <div className="flex justify-between pt-5 gap-2.5 w-full">
          <button
            onClick={handleCancel}
            className="w-1/2 py-2.5 px-5 border-none rounded cursor-pointer text-white bg-[#b4b4b4]"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 py-2.5 px-5 border-none rounded cursor-pointer text-white bg-[#47bcff]"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
